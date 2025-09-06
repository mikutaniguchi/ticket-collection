import type { Ticket, TicketCardData } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    exhibitionName: 'ルノワール×セザンヌ展',
    museumName: '国立西洋美術館',
    exhibitionUrl: 'https://www.nmwa.go.jp/',
    visitDate: new Date('2024-03-15'),
    rating: 4,
    review:
      'ルノワールとセザンヌの作品を同時に見ることができる貴重な機会でした。両画家の技法の違いや影響関係がよく分かる構成で、とても勉強になりました。',
    ticketImage: '/images/tickets/renoir-cezanne.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    exhibitionName: 'ジブリ立体造型物展',
    museumName: '東京都現代美術館',
    exhibitionUrl: 'https://www.mot-art-museum.jp/',
    visitDate: new Date('2024-02-28'),
    rating: 4,
    review:
      '現代の立体造型作品の多様性に驚きました。素材や技法の革新性、そして空間との関係性を考えさせられる展覧会でした。',
    ticketImage: '/images/tickets/sculpture-exhibition.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },
  {
    id: '3',
    exhibitionName: '高畑勲展',
    museumName: '麻布台ヒルズ',
    visitDate: new Date('2024-02-10'),
    rating: 5,
    review:
      '高畑勲監督の作品世界を深く知ることができました。絵コンテや原画から、作品への愛情と緻密な計算が伝わってきて感動的でした。',
    ticketImage: '/images/tickets/takahata-isao.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '4',
    exhibitionName: '佐藤雅彦展',
    museumName: '21_21 DESIGN SIGHT',
    visitDate: new Date('2023-11-15'),
    rating: 4,
    review:
      '「ピ」「ドンタコス」など、日常に潜むデザインの思考プロセスを体験できる興味深い展覧会でした。見る者の視点を変える仕掛けが随所にありました。',
    ticketImage: '/images/tickets/sato-masahiko-exhibition.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15'),
  },

  {
    id: '5',
    exhibitionName: 'ゴッホ展',
    museumName: '国立新美術館',
    visitDate: new Date('2024-01-05'),
    rating: 5,
    review:
      'ゴッホの情熱的な筆致と色彩に心を奪われました。後期の作品は特に力強く、感動的でした。',
    ticketImage:
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=500&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    exhibitionName: 'ミロ展',
    museumName: '東京都美術館',
    visitDate: new Date('2023-12-20'),
    rating: 5,
    review: 'わたしには難しかった',
    ticketImage: '/images/tickets/miro-exhibition.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop',
    ],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2023-12-20'),
  },
];

// チケットカード用のデータ変換関数
export const convertToCardData = (ticket: Ticket): TicketCardData => ({
  id: ticket.id,
  ticketImage: ticket.ticketImage,
  exhibitionName: ticket.exhibitionName,
  museumName: ticket.museumName,
  visitDate: ticket.visitDate.toISOString().split('T')[0],
  rating: ticket.rating,
});

// チケットカード用データ配列（日付降順でソート）
export const mockTicketCards: TicketCardData[] = mockTickets
  .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime())
  .map(convertToCardData);
