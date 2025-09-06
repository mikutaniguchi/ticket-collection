// チケット関連の型定義

// 基本のチケット型
export interface Ticket {
  id: string;
  title: string;
  location?: string;
  websiteUrl?: string;
  visitDate: Date;
  rating: number;
  review: string;
  ticketImage: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

// カード表示用の簡略化された型
export interface TicketCardData {
  id: string;
  ticketImage: string;
  title: string;
  location?: string;
  visitDate: string;
  rating: number;
}

// フォーム入力用の型
export interface TicketFormData {
  ticketImage: File | string;
  title: string;
  location?: string;
  websiteUrl?: string;
  visitDate: Date;
  rating: number;
  review: string;
  gallery: File[] | string[];
}
