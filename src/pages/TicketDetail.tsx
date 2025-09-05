import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Pencil, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import { mockTickets } from '../data/mockTickets';
import type { Ticket } from '../types/ticket';
import '../styles/TicketDetail.css';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!id) return;

    const foundTicket = mockTickets.find((t) => t.id === id);
    setTicket(foundTicket || null);
    setLoading(false);
  }, [id]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star full">
            ★
          </span>
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="star half">
            ☆
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && ticket) {
      const totalImages = 1 + ticket.gallery.length;
      setSelectedImageIndex((selectedImageIndex + 1) % totalImages);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && ticket) {
      const totalImages = 1 + ticket.gallery.length;
      setSelectedImageIndex(
        (selectedImageIndex - 1 + totalImages) % totalImages
      );
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-error">
        <p>チケットが見つかりません</p>
        <button onClick={() => navigate('/tickets')}>一覧に戻る</button>
      </div>
    );
  }

  const allImages = [ticket.ticketImage, ...ticket.gallery];

  return (
    <div className="ticket-detail">
      <Header />
      <div className="detail-content">
        <div className="detail-actions">
          <button className="back-button" onClick={() => navigate('/tickets')}>
            <ArrowLeft size={16} />
            一覧に戻る
          </button>
          <button
            className="edit-button"
            onClick={() => navigate(`/tickets/${id}/edit`)}
          >
            <Pencil size={20} />
          </button>
        </div>

        <div className="detail-date">
          {ticket.visitDate.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <h1 className="detail-title">{ticket.exhibitionName}</h1>

        <div className="detail-museum">
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(ticket.museumName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="museum-link"
          >
            <MapPin size={16} />
            {ticket.museumName}
          </a>
        </div>

        {ticket.exhibitionUrl && (
          <div className="detail-website">
            <a
              href={ticket.exhibitionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="website-link"
            >
              <ExternalLink size={16} />
              公式サイト
            </a>
          </div>
        )}

        <div className="detail-rating">
          <div className="rating-stars">{renderStars(ticket.rating)}</div>
          <span className="rating-value">{ticket.rating}</span>
        </div>

        {ticket.review && (
          <div className="detail-review">
            <h3>感想</h3>
            <div className="review-content">
              {ticket.review.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        <div className="detail-gallery">
          <h3>ギャラリー</h3>
          <div className="gallery-grid">
            <div className="gallery-item" onClick={() => openImageModal(0)}>
              <img src={ticket.ticketImage} alt="チケット画像" />
            </div>
            {ticket.gallery.map((imageUrl, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => openImageModal(index + 1)}
              >
                <img src={imageUrl} alt={`ギャラリー画像 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>
              ×
            </button>
            <button className="modal-prev" onClick={prevImage}>
              ‹
            </button>
            <img
              src={allImages[selectedImageIndex]}
              alt={`画像 ${selectedImageIndex + 1}`}
              className="modal-image"
            />
            <button className="modal-next" onClick={nextImage}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
