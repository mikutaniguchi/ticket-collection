import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Ticket, TicketFormData } from '../types/ticket';

const COLLECTION_NAME = 'tickets';

export const ticketService = {
  async createTicket(userId: string, data: TicketFormData): Promise<string> {
    try {
      const ticketData = {
        ...data,
        userId,
        visitDate: Timestamp.fromDate(data.visitDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), ticketData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('チケットの作成に失敗しました');
    }
  },

  async updateTicket(
    ticketId: string,
    data: Partial<TicketFormData>
  ): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
        ...(data.visitDate && {
          visitDate: Timestamp.fromDate(data.visitDate),
        }),
      };

      await updateDoc(doc(db, COLLECTION_NAME, ticketId), updateData);
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error('チケットの更新に失敗しました');
    }
  },

  async deleteTicket(ticketId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, ticketId));
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
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('visitDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const tickets: Ticket[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tickets.push({
          id: doc.id,
          ...data,
          visitDate: data.visitDate.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Ticket);
      });

      return tickets;
    } catch (error) {
      console.error('Error getting user tickets:', error);
      throw new Error('チケットの一覧取得に失敗しました');
    }
  },
};
