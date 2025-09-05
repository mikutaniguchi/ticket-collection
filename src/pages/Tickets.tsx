import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import TicketGrid from '../components/features/ticket/TicketGrid';
import FloatingButton from '../components/ui/FloatingButton';
import '../styles/TicketGrid.css';

// モックデータ（様々な縦横比のチケット画像をシミュレート）
const mockTickets = [
  {
    id: '1',
    ticketImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    exhibitionName: 'モネとその時代',
    museumName: '国立西洋美術館',
    visitDate: '2024-03-15',
    rating: 4.5,
  },
  {
    id: '2',
    ticketImage:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=800&fit=crop',
    exhibitionName: '現代アートの新潮流',
    museumName: '東京都現代美術館',
    visitDate: '2024-02-28',
    rating: 4.0,
  },
  {
    id: '3',
    ticketImage:
      'https://images.unsplash.com/photo-1569934240643-c9bb1a6bae0b?w=400&h=550&fit=crop',
    exhibitionName: 'ピカソ展',
    museumName: '上野の森美術館',
    visitDate: '2024-02-10',
    rating: 5.0,
  },
  {
    id: '4',
    ticketImage:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=700&fit=crop',
    exhibitionName: '浮世絵の世界',
    museumName: '東京国立博物館',
    visitDate: '2024-01-20',
    rating: 4.5,
  },
  {
    id: '5',
    ticketImage:
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=500&fit=crop',
    exhibitionName: 'ゴッホ展',
    museumName: '国立新美術館',
    visitDate: '2024-01-05',
    rating: 5.0,
  },
  {
    id: '6',
    ticketImage:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=650&fit=crop',
    exhibitionName: '印象派の巨匠たち',
    museumName: '横浜美術館',
    visitDate: '2023-12-20',
    rating: 4.0,
  },
  {
    id: '7',
    ticketImage:
      'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=400&h=750&fit=crop',
    exhibitionName: '日本画の美',
    museumName: '山種美術館',
    visitDate: '2023-12-01',
    rating: 4.5,
  },
  {
    id: '8',
    ticketImage:
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=450&fit=crop',
    exhibitionName: 'ルノワール展',
    museumName: 'Bunkamura ザ・ミュージアム',
    visitDate: '2023-11-15',
    rating: 4.0,
  },
  {
    id: '9',
    ticketImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=900&fit=crop',
    exhibitionName: 'バンクシー展',
    museumName: '寺田倉庫G1',
    visitDate: '2023-10-28',
    rating: 4.5,
  },
  {
    id: '10',
    ticketImage:
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop',
    exhibitionName: '北斎展',
    museumName: 'すみだ北斎美術館',
    visitDate: '2023-10-15',
    rating: 5.0,
  },
];

export default function Tickets() {
  const navigate = useNavigate();

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleAddTicket = () => {
    // TODO: navigate('/tickets/new');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div
        style={{
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <TicketGrid tickets={mockTickets} onTicketClick={handleTicketClick} />
      </div>
      <FloatingButton onClick={handleAddTicket} />
    </div>
  );
}
