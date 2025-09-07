import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { TicketCardData } from '../../../types/ticket';
import './TicketCard.css';

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
            // 画像をプリロード
            const img = new Image();
            img.onload = () => {
              setImageLoaded(true);
              setIsVisible(true);
              if (imgRef.current) {
                imgRef.current.src = ticket.ticketImage;
              }
            };
            img.onerror = () => {
              setImageLoaded(true);
              setIsVisible(true);
              if (imgRef.current) {
                imgRef.current.src = ticket.ticketImage;
              }
            };
            img.src = ticket.ticketImage;

            // observerを解除
            if (cardRef.current) {
              observer.unobserve(cardRef.current);
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
      className={`ticket-card ${imageLoaded && isVisible ? 'show' : ''}`}
      onClick={() => onClick(ticket.id)}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      <div className="ticket-card-image-container">
        {!imageLoaded && isVisible && <div className="ticket-card-skeleton" />}
        <img
          ref={imgRef}
          alt={ticket.title}
          className={`ticket-card-image ${imageLoaded ? 'loaded' : ''}`}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.minHeight = '300px';
            target.style.objectFit = 'cover';
          }}
        />
        <div className="ticket-card-overlay">
          <h3 className="ticket-card-title">{ticket.title}</h3>
          {ticket.location && (
            <p className="ticket-card-museum">{ticket.location}</p>
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
