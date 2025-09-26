import { ArrowLeft, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../components/ui/ConfirmModal';
import TicketNavigation from '../components/ui/TicketNavigation';
import { useAuth } from '../hooks/useAuth';
import { useKeyboardNavigation, useSwipe } from '../hooks/useSwipe';
import { ticketService } from '../services/ticketService';
import type { Ticket } from '../types/ticket';
import { isMobile } from '../utils/deviceUtils';
import { renderMarkdown } from '../utils/markdown';
import { resetPageTitle, setPageTitle } from '../utils/seo';
import NotFound from './NotFound';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;

      try {
        // まず現在のチケットのみ取得
        const currentTicket = await ticketService.getTicket(id);
        setTicket(currentTicket);

        // SEO用のタイトル設定
        if (currentTicket) {
          setPageTitle(currentTicket.title);
        }

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

    // クリーンアップ：コンポーネントがアンマウントされる時にタイトルをリセット
    return () => {
      resetPageTitle();
      document.body.classList.remove('modal-open'); // クラスも確実に削除

      // viewportも元に戻す
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    };
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
    setDisplayIndex(index + 1); // クローンを考慮して+1
    document.body.classList.add('modal-open'); // クラス追加

    // モーダル表示時はピンチズーム有効化
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, viewport-fit=cover'
      );
    }
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
    setDisplayIndex(0);
    document.body.classList.remove('modal-open'); // クラス削除

    // モーダル閉じる時はズーム無効化に戻す
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
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

  const nextImage = () => {
    if (selectedImageIndex !== null && ticket && !isSwipeAnimating) {
      setIsSwipeAnimating(true);
      setSwipeOffset(0); // 即座にオフセットをリセット
      const totalImages = 1 + ticket.gallery.length;
      const nextIndex = (selectedImageIndex + 1) % totalImages;

      setDisplayIndex(displayIndex + 1);
      setSelectedImageIndex(nextIndex);

      // 最後から最初に戻る時の処理
      if (selectedImageIndex === totalImages - 1) {
        setTimeout(() => {
          setIsSwipeAnimating(false);
          setDisplayIndex(1); // 最初のクローンにリセット
        }, 300);
      } else {
        setTimeout(() => {
          setIsSwipeAnimating(false);
        }, 300);
      }
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && ticket && !isSwipeAnimating) {
      setIsSwipeAnimating(true);
      setSwipeOffset(0); // 即座にオフセットをリセット
      const totalImages = 1 + ticket.gallery.length;
      const prevIndex = (selectedImageIndex - 1 + totalImages) % totalImages;

      setDisplayIndex(displayIndex - 1);
      setSelectedImageIndex(prevIndex);

      // 最初から最後に戻る時の処理
      if (selectedImageIndex === 0) {
        setTimeout(() => {
          setIsSwipeAnimating(false);
          setDisplayIndex(totalImages); // 最後のクローンにリセット
        }, 300);
      } else {
        setTimeout(() => {
          setIsSwipeAnimating(false);
        }, 300);
      }
    }
  };

  // スワイプ対応（モバイルのみ、かつモーダル表示中は無効）
  const swipeHandlers = useSwipe({
    onSwipeStart: () => {
      if (selectedImageIndex !== null) {
        setSwipeOffset(0);
      }
    },
    onSwipeMove: (deltaX: number) => {
      if (selectedImageIndex !== null && !isSwipeAnimating) {
        // スワイプ量を制限（画面幅の40%まで）
        const maxSwipe = window.innerWidth * 0.4;
        const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
        setSwipeOffset(limitedDelta);
      }
    },
    onSwipeEnd: () => {
      if (selectedImageIndex !== null && !isSwipeAnimating) {
        const threshold = window.innerWidth * 0.15; // 画面幅の15%以上スワイプで切り替え

        if (Math.abs(swipeOffset) > threshold) {
          // 閾値を超えたら画像を切り替え
          if (swipeOffset > 0) {
            prevImage();
          } else {
            nextImage();
          }
        } else {
          // 閾値未満なら元に戻す
          setIsSwipeAnimating(true);
          setTimeout(() => {
            setSwipeOffset(0);
            setIsSwipeAnimating(false);
          }, 200);
        }
      }
    },
    onSwipeLeft:
      isMobile() && !showDeleteConfirm && selectedImageIndex === null
        ? goToNext
        : undefined,
    onSwipeRight:
      isMobile() && !showDeleteConfirm && selectedImageIndex === null
        ? goToPrevious
        : undefined,
  });

  useKeyboardNavigation({
    onPrevious:
      selectedImageIndex === null && !showDeleteConfirm
        ? goToPrevious
        : undefined,
    onNext:
      selectedImageIndex === null && !showDeleteConfirm ? goToNext : undefined,
  });

  const handleDelete = async () => {
    if (!id || !ticket) return;

    try {
      await ticketService.deleteTicket(id);
      document.body.classList.remove('modal-open'); // クラス削除
      // 削除成功後、一覧に戻る
      navigate('/tickets');
    } catch (error) {
      console.error('削除に失敗しました:', error);
      alert('チケットの削除に失敗しました');
      document.body.classList.remove('modal-open'); // エラー時もクラス削除
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
    return <NotFound type="ticket" />;
  }

  const allImages = [ticket.ticketImage, ...ticket.gallery];
  // 無限ループ用: 最後に最初の画像、最初に最後の画像をクローンとして追加
  const loopImages = [
    allImages[allImages.length - 1], // 最後の画像のクローン
    ...allImages,
    allImages[0], // 最初の画像のクローン
  ];
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
            <div
              className="review-content markdown-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(ticket.review),
              }}
            />
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

        {/* 削除ボタン（右端配置） */}
        <div
          style={{
            marginTop: '15rem',
            marginBottom: '3rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            className="edit-button"
            onClick={() => {
              setShowDeleteConfirm(true);
              document.body.classList.add('modal-open');
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {selectedImageIndex !== null && (
        <div className="image-modal" onClick={closeImageModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            {...swipeHandlers}
          >
            <button className="modal-close" onClick={closeImageModal}>
              ×
            </button>
            <button className="modal-prev" onClick={prevImage}>
              ‹
            </button>
            <div className="modal-image-container">
              <div
                className="modal-images-wrapper"
                style={{
                  transform: `translateX(calc(-${displayIndex * 100}% + ${swipeOffset}px))`,
                  transition: isSwipeAnimating
                    ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                    : 'none',
                }}
              >
                {loopImages.map((imageUrl, index) => (
                  <div key={index} className="modal-image-slide">
                    <img
                      src={imageUrl}
                      alt={`画像 ${index}`}
                      className="modal-image"
                    />
                  </div>
                ))}
              </div>
              {!isMobile() && (
                <>
                  <div
                    className="modal-touch-area modal-touch-left"
                    onClick={prevImage}
                  ></div>
                  <div
                    className="modal-touch-area modal-touch-right"
                    onClick={nextImage}
                  ></div>
                </>
              )}
            </div>
            <button className="modal-next" onClick={nextImage}>
              ›
            </button>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          document.body.classList.remove('modal-open');
        }}
        onConfirm={handleDelete}
        title="チケットを削除"
        message={`「${ticket?.title}」を本当に削除しますか？この操作は取り消せません。`}
        confirmText="削除する"
        cancelText="キャンセル"
        type="danger"
      />

      {/* ナビゲーション（2枚以上の時のみ表示） */}
      {totalTickets >= 2 && (
        <TicketNavigation
          currentIndex={currentIndex}
          totalTickets={totalTickets}
          onPrevious={goToPrevious}
          onNext={goToNext}
          isTransitioning={isTransitioning}
        />
      )}
    </div>
  );
}
