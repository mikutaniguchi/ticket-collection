import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

interface Artwork {
  title: string;
  artist: string;
  imageUrl: string;
  date: string;
  style: string;
  description: string;
}

export default function NotFound() {
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRandomArtwork = async () => {
      try {
        // シンプルな検索で画像付き作品を取得
        const searchUrl = `https://api.artic.edu/api/v1/artworks?page=${Math.floor(Math.random() * 50) + 1}&limit=1&fields=id,title,artist_display,date_display,style_title,short_description,image_id,thumbnail`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!isMounted || !data.data || data.data.length === 0) {
          return;
        }

        const art = data.data[0];

        // 画像がない場合はスキップ
        if (!art.image_id) {
          fetchRandomArtwork();
          return;
        }

        if (isMounted) {
          setArtwork({
            title: art.title || '無題',
            artist: art.artist_display || '作者不明',
            imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
            date: art.date_display || '',
            style: art.style_title || '',
            description: art.short_description || art.thumbnail?.alt_text || '',
          });
        }
      } catch (err) {
        console.error('Artwork fetch error:', err);
        // エラー時は元の固定リストにフォールバック
        const fallbackIds = [27992, 20684, 16568];
        const randomId =
          fallbackIds[Math.floor(Math.random() * fallbackIds.length)];

        try {
          const fallbackResponse = await fetch(
            `https://api.artic.edu/api/v1/artworks/${randomId}`
          );
          const fallbackData = await fallbackResponse.json();

          if (isMounted && fallbackData.data) {
            const art = fallbackData.data;
            setArtwork({
              title: art.title || '無題',
              artist: art.artist_display || '作者不明',
              imageUrl: art.image_id
                ? `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`
                : '',
              date: art.date_display || '',
              style: art.style_title || '',
              description:
                art.short_description || art.thumbnail?.alt_text || '',
            });
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch error:', fallbackErr);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRandomArtwork();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">ページが見つかりません</h2>
        <p className="not-found-message">
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <div className="not-found-actions">
          <button
            onClick={() => navigate('/tickets')}
            className="not-found-button not-found-button-home"
          >
            <Home size={20} />
            ホームへ
          </button>
        </div>

        {/* アートワーク表示エリア（常に表示してスペース確保） */}
        <div className="not-found-artwork">
          {isLoading ? (
            <div className="artwork-loading">
              <div className="loading-placeholder">
                <div className="loading-spinner"></div>
                <p className="loading-text">読み込み中...</p>
              </div>
            </div>
          ) : artwork && artwork.imageUrl ? (
            <>
              <img src={artwork.imageUrl} alt={artwork.title} />
              <div className="artwork-info">
                <div className="artwork-title">{artwork.title}</div>
                <div className="artwork-artist">{artwork.artist}</div>
                <div className="artwork-meta">
                  {artwork.style && (
                    <span className="artwork-style">{artwork.style}</span>
                  )}
                  {artwork.style && artwork.date && <span> • </span>}
                  {artwork.date && (
                    <span className="artwork-date">{artwork.date}</span>
                  )}
                </div>
                {artwork.description && (
                  <div className="artwork-description">
                    {artwork.description}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="artwork-error">
              <p>読み込みに失敗しました</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
