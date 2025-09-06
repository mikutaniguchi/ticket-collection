import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketService } from '../services/ticketService';
import Header from '../components/layout/Header';
import TicketGrid from '../components/features/ticket/TicketGrid';
import FloatingButton from '../components/ui/FloatingButton';
import type { TicketCardData } from '../types/ticket';

export default function Tickets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        const userTickets = await ticketService.getUserTickets(user.uid);

        // Ticket型をTicketCardData型に変換
        const ticketCards: TicketCardData[] = userTickets.map((ticket) => ({
          id: ticket.id,
          ticketImage: ticket.ticketImage,
          title: ticket.title,
          location: ticket.location,
          visitDate: ticket.visitDate.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          rating: ticket.rating,
        }));

        setTickets(ticketCards);
      } catch (error) {
        console.error('チケット一覧の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleAddTicket = () => {
    navigate('/tickets/new');
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div
        style={{
          padding: '2rem',
          paddingTop: '1rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {tickets.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666',
            }}
          >
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              まだチケットがありません
            </p>
            <p>右下のボタンから最初のチケットを追加してみてください！</p>
          </div>
        ) : (
          <TicketGrid tickets={tickets} onTicketClick={handleTicketClick} />
        )}
      </div>
      <FloatingButton onClick={handleAddTicket} />
    </div>
  );
}
