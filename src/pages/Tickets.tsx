import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import TicketGrid from '../components/features/ticket/TicketGrid';
import FloatingButton from '../components/ui/FloatingButton';
import { mockTicketCards } from '../data/mockTickets';
import '../styles/TicketGrid.css';

export default function Tickets() {
  const navigate = useNavigate();

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleAddTicket = () => {
    navigate('/tickets/new');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div
        style={{
          padding: '2rem',
          paddingTop: '5rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <TicketGrid
          tickets={mockTicketCards}
          onTicketClick={handleTicketClick}
        />
      </div>
      <FloatingButton onClick={handleAddTicket} />
    </div>
  );
}
