import Masonry from 'react-masonry-css';
import TicketCard from './TicketCard';

interface Ticket {
  id: string;
  ticketImage: string;
  exhibitionName: string;
  museumName?: string;
  visitDate: string;
  rating?: number;
}

interface TicketGridProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
}

export default function TicketGrid({
  tickets,
  onTicketClick,
}: TicketGridProps) {
  const breakpointColumns = {
    default: 4,
    1200: 3,
    768: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="ticket-grid"
      columnClassName="ticket-grid-column"
    >
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
      ))}
    </Masonry>
  );
}
