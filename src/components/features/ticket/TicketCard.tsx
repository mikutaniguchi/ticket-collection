import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { TicketCardData } from '../../../types/ticket';
import '../../../styles/TicketCard.css';

interface TicketCardProps {
  ticket: TicketCardData;
  onClick: (ticketId: string) => void;
  index: number;
}

export default function TicketCard({
  ticket,
  onClick,
  index,
}: TicketCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (imgRef.current) {
              imgRef.current.src = ticket.ticketImage;
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, [ticket.ticketImage]);

  return (
    <div
      ref={cardRef}
      className="ticket-card"
      onClick={() => onClick(ticket.id)}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      <div className="ticket-card-image-container">
        {!imageLoaded && isVisible && <div className="ticket-card-skeleton" />}
        <img
          ref={imgRef}
          alt={ticket.exhibitionName}
          className={`ticket-card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.minHeight = '300px';
            target.style.objectFit = 'cover';
            setImageLoaded(true);
          }}
        />
        <div className="ticket-card-overlay">
          <h3 className="ticket-card-title">{ticket.exhibitionName}</h3>
          {ticket.museumName && (
            <p className="ticket-card-museum">{ticket.museumName}</p>
          )}
          <div className="ticket-card-date">
            <Calendar size={14} />
            <span>{ticket.visitDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
