import { Calendar } from 'lucide-react';
import type { TicketCardData } from '../../../types/ticket';

interface TicketCardProps {
  ticket: TicketCardData;
  onClick: (ticketId: string) => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <div
      onClick={() => onClick(ticket.id)}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        marginBottom: '1rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
        }}
      >
        <img
          src={ticket.ticketImage}
          alt={ticket.exhibitionName}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.minHeight = '300px';
            target.style.objectFit = 'cover';
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            padding: '2rem 1rem 1rem',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '0.25rem',
              lineHeight: '1.3',
            }}
          >
            {ticket.exhibitionName}
          </h3>
          {ticket.museumName && (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                marginBottom: '0.25rem',
              }}
            >
              {ticket.museumName}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
            }}
          >
            <Calendar size={14} />
            <span>{ticket.visitDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
