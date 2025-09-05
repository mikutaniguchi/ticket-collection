import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Pencil, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import '../styles/TicketDetail.css';

interface Ticket {
  id: string;
  exhibitionName: string;
  museumName: string;
  exhibitionUrl?: string;
  visitDate: Date;
  rating: number;
  review: string;
  ticketImage: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

    // モックデータ
    const mockTickets = [
      {
        id: '1',
        exhibitionName: 'モネとその時代',
        museumName: '国立西洋美術館',
        exhibitionUrl: 'https://example.com/monet',
        visitDate: new Date('2024-03-15'),
        rating: 4.5,
        review:
          'モネの作品を間近で見ることができて感動しました。特に睡蓮の連作は圧巻でした。光の表現が本当に美しく、時間を忘れて見入ってしまいました。',
        ticketImage:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
        ],
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
      },
      {
        id: '2',
        exhibitionName: '現代アートの新潮流',
        museumName: '東京都現代美術館',
        exhibitionUrl: 'https://example.com/modern',
        visitDate: new Date('2024-02-28'),
        rating: 4.0,
        review:
          '現代アートの多様性を感じられる展覧会でした。特にインスタレーション作品が印象的でした。',
        ticketImage:
          'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=800&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1569934240643-c9bb1a6bae0b?w=400&h=400&fit=crop',
        ],
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28'),
      },
      {
        id: '3',
        exhibitionName: 'ピカソ展',
        museumName: '上野の森美術館',
        visitDate: new Date('2024-02-10'),
        rating: 5.0,
        review:
          'ピカソの青の時代からキュビスムまで、幅広い作品を見ることができました。天才の軌跡を辿る素晴らしい展覧会でした。',
        ticketImage:
          'https://images.unsplash.com/photo-1569934240643-c9bb1a6bae0b?w=400&h=550&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop',
        ],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
      },
      {
        id: '4',
        exhibitionName: '浮世絵の世界',
        museumName: '東京国立博物館',
        visitDate: new Date('2024-01-20'),
        rating: 4.5,
        review:
          '江戸時代の生活や文化が浮世絵を通して身近に感じられました。技術の高さに驚きました。',
        ticketImage:
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=700&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
    ];

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
          <button className="edit-button">
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
