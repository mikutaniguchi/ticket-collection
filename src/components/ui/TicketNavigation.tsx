import { ChevronLeft, ChevronRight } from 'lucide-react';
import './TicketNavigation.css';

interface TicketNavigationProps {
  currentIndex: number;
  totalTickets: number;
  onPrevious: () => void;
  onNext: () => void;
  isTransitioning: boolean;
}

export default function TicketNavigation({
  currentIndex,
  totalTickets,
  onPrevious,
  onNext,
  isTransitioning,
}: TicketNavigationProps) {
  return (
    <div className="ticket-navigation">
      <button
        className="nav-button nav-previous"
        onClick={onPrevious}
        disabled={isTransitioning}
        aria-label="前のチケット"
      >
        <ChevronLeft size={48} />
      </button>

      <div className="nav-indicator">
        <span className="nav-current">{currentIndex + 1}</span>
        <span className="nav-separator">/</span>
        <span className="nav-total">{totalTickets}</span>
      </div>

      <button
        className="nav-button nav-next"
        onClick={onNext}
        disabled={isTransitioning}
        aria-label="次のチケット"
      >
        <ChevronRight size={48} />
      </button>
    </div>
  );
}
