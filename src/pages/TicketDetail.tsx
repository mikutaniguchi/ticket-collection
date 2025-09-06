import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  MapPin,
  ExternalLink,
  Pencil,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ticketService } from '../services/ticketService';
import { useSwipe, useKeyboardNavigation } from '../hooks/useSwipe';
import type { Ticket } from '../types/ticket';
import './TicketDetail.css';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;

      try {
        // まず現在のチケットのみ取得
        const currentTicket = await ticketService.getTicket(id);
        setTicket(currentTicket);

        // ユーザーの全チケットを取得（ナビゲーション用）
        try {
          const userTickets = await ticketService.getUserTickets(user.uid);
          setAllTickets(userTickets);
        } catch (ticketsError) {
          console.error('全チケット取得エラー（無視して続行）:', ticketsError);
          // エラーでも現在のチケットは表示する
          setAllTickets(currentTicket ? [currentTicket] : []);
        }
      } catch (error) {
        console.error('チケットの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

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

  // ナビゲーション機能
  const goToPrevious = () => {
    if (isTransitioning || !id || allTickets.length === 0) return;

    const currentIndex = allTickets.findIndex((t) => t.id === id);
    if (currentIndex === -1) return;

    // 無限ループ: 最初の場合は最後に
    const previousIndex =
      currentIndex === 0 ? allTickets.length - 1 : currentIndex - 1;
    const previousTicket = allTickets[previousIndex];

    setIsTransitioning(true);
    setTimeout(() => {
      navigate(`/tickets/${previousTicket.id}`, { replace: true });
      setIsTransitioning(false);
    }, 150);
  };

  const goToNext = () => {
    if (isTransitioning || !id || allTickets.length === 0) return;

    const currentIndex = allTickets.findIndex((t) => t.id === id);
    if (currentIndex === -1) return;

    // 無限ループ: 最後の場合は最初に
    const nextIndex =
      currentIndex === allTickets.length - 1 ? 0 : currentIndex + 1;
    const nextTicket = allTickets[nextIndex];

    setIsTransitioning(true);
    setTimeout(() => {
      navigate(`/tickets/${nextTicket.id}`, { replace: true });
      setIsTransitioning(false);
    }, 150);
  };

  // スワイプとキーボード対応
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  useKeyboardNavigation({
    onPrevious: goToPrevious,
    onNext: goToNext,
  });

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
  const currentIndex = allTickets.findIndex((t) => t.id === id);
  const totalTickets = allTickets.length;

  return (
    <div
      className={`ticket-detail ${isTransitioning ? 'transitioning' : ''}`}
      {...swipeHandlers}
    >
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

        <h1 className="detail-title">{ticket.title}</h1>

        {ticket.location && (
          <div className="detail-museum">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(ticket.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="museum-link"
            >
              <MapPin size={16} />
              {ticket.location}
            </a>
          </div>
        )}

        {ticket.websiteUrl && (
          <div className="detail-website">
            <a
              href={ticket.websiteUrl}
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

        {/* チケットナビゲーション */}
        <div className="ticket-navigation">
          <button
            className="nav-button nav-previous"
            onClick={goToPrevious}
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
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="次のチケット"
          >
            <ChevronRight size={48} />
          </button>
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
