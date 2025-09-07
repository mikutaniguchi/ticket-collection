import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { processAndUploadFile } from './fileStorage';
import type { Ticket, TicketFormData } from '../types/ticket';

const COLLECTION_NAME = 'tickets';

export const ticketService = {
  async createTicket(userId: string, data: TicketFormData): Promise<string> {
    try {
      // まずFirestoreにチケットデータを作成（画像URL無し）
      const ticketData = {
        title: data.title,
        location: data.location || '',
        websiteUrl: data.websiteUrl || '',
        visitDate: Timestamp.fromDate(data.visitDate),
        rating: data.rating,
        review: data.review || '',
        ticketImage: '', // 後で更新
        gallery: [], // 後で更新
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), ticketData);
      const ticketId = docRef.id;

      // チケット画像をアップロード
      let ticketImageUrl = '';
      if (data.ticketImage && data.ticketImage instanceof File) {
        const uploadedTicketImage = await processAndUploadFile(
          data.ticketImage,
          userId,
          ticketId,
          'ticket'
        );
        ticketImageUrl = uploadedTicketImage.url;
      } else if (typeof data.ticketImage === 'string') {
        ticketImageUrl = data.ticketImage;
      }

      // ギャラリー画像をアップロード
      const galleryUrls: string[] = [];
      if (data.gallery && data.gallery.length > 0) {
        for (const galleryItem of data.gallery) {
          if (galleryItem instanceof File) {
            const uploadedGalleryImage = await processAndUploadFile(
              galleryItem,
              userId,
              ticketId,
              'gallery'
            );
            galleryUrls.push(uploadedGalleryImage.url);
          } else if (typeof galleryItem === 'string') {
            galleryUrls.push(galleryItem);
          }
        }
      }

      // 画像URLでFirestoreを更新
      await updateDoc(doc(db, COLLECTION_NAME, ticketId), {
        ticketImage: ticketImageUrl,
        gallery: galleryUrls,
        updatedAt: Timestamp.now(),
      });

      return ticketId;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('チケットの作成に失敗しました');
    }
  },

  async updateTicket(
    ticketId: string,
    userId: string,
    data: TicketFormData
  ): Promise<void> {
    try {
      // 現在のチケットデータを取得
      const currentTicket = await this.getTicket(ticketId);
      if (!currentTicket) {
        throw new Error('チケットが見つかりません');
      }

      let ticketImageUrl = currentTicket.ticketImage;
      let galleryUrls = [...currentTicket.gallery];

      // チケット画像の処理
      if (data.ticketImage && data.ticketImage instanceof File) {
        // 新しい画像がアップロードされた場合
        const uploadedTicketImage = await processAndUploadFile(
          data.ticketImage,
          userId,
          ticketId,
          'ticket'
        );
        ticketImageUrl = uploadedTicketImage.url;

        // 古い画像を削除（必要に応じて）
        // TODO: 古い画像のfullPathを保存していれば削除可能
      } else if (typeof data.ticketImage === 'string') {
        ticketImageUrl = data.ticketImage;
      }

      // ギャラリー画像の処理
      if (data.gallery && data.gallery.length >= 0) {
        galleryUrls = [];
        for (const galleryItem of data.gallery) {
          if (galleryItem instanceof File) {
            const uploadedGalleryImage = await processAndUploadFile(
              galleryItem,
              userId,
              ticketId,
              'gallery'
            );
            galleryUrls.push(uploadedGalleryImage.url);
          } else if (typeof galleryItem === 'string') {
            galleryUrls.push(galleryItem);
          }
        }
      }

      // Firestoreを更新
      const updateData = {
        title: data.title,
        location: data.location,
        websiteUrl: data.websiteUrl,
        visitDate: Timestamp.fromDate(data.visitDate),
        rating: data.rating,
        review: data.review,
        ticketImage: ticketImageUrl,
        gallery: galleryUrls,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, COLLECTION_NAME, ticketId), updateData);
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error('チケットの更新に失敗しました');
    }
  },

  async deleteTicket(ticketId: string): Promise<void> {
    try {
      // Firestoreからチケットを削除
      await deleteDoc(doc(db, COLLECTION_NAME, ticketId));

      // TODO: 画像ファイルも削除する場合は以下を実装
      // 現在は画像のfullPathを保存していないため、後で改善
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw new Error('チケットの削除に失敗しました');
    }
  },

  async getTicket(ticketId: string): Promise<Ticket | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, ticketId));

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          visitDate: data.visitDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Ticket;
      }

      return null;
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw new Error('チケットの取得に失敗しました');
    }
  },

  async getUserTickets(userId: string): Promise<Ticket[]> {
    try {
      // まずはシンプルなクエリで試す（orderByなし）
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const tickets: Ticket[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tickets.push({
          id: doc.id,
          ...data,
          visitDate: data.visitDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Ticket);
      });

      // 取得後にJavaScriptでソート（日時の新しい順）
      tickets.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
      return tickets;
    } catch (error) {
      console.error('Error getting user tickets:', error);
      throw new Error('チケットの一覧取得に失敗しました');
    }
  },
};
