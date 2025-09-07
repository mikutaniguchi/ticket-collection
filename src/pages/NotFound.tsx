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

interface NotFoundProps {
  type?: 'page' | 'ticket';
}

export default function NotFound({ type = 'page' }: NotFoundProps) {
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRandomArtwork = async () => {
      try {
        // 厳選アーティスト（バランス良く）
        const artists = [
          { search: 'Monet', display: 'モネ' },
          { search: 'Renoir', display: 'ルノワール' },
          { search: 'Manet', display: 'マネ' },
          { search: 'Pissarro', display: 'ピサロ' },
          { search: 'Cézanne', display: 'セザンヌ' },
          { search: 'Van Gogh', display: 'ゴッホ' },
          { search: 'Gauguin', display: 'ゴーギャン' },
          { search: 'Berthe Morisot', display: 'ベルト・モリゾ' },
          { search: 'Mucha', display: 'ミュシャ' },
          { search: 'Vuillard', display: 'ヴュイヤール' },
          { search: 'Vermeer', display: 'フェルメール' },
          { search: 'Matisse', display: 'マティス' },
          { search: 'Sonia Delaunay', display: 'ソニア・ドローネー' },
          { search: 'Raoul Dufy', display: 'ラウル・デュフィ' },
          { search: 'Joan Miró', display: 'ジョアン・ミロ' },
          { search: 'Salvador Dalí', display: 'サルバドール・ダリ' },
          { search: 'Pablo Picasso', display: 'パブロ・ピカソ' },
        ];

        const selectedArtist =
          artists[Math.floor(Math.random() * artists.length)];

        // APIで検索
        const searchUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(selectedArtist.search)}&limit=20&fields=id`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.data || searchData.data.length === 0) {
          throw new Error('No artworks found');
        }

        // ランダムに1つ選択
        const randomArtwork =
          searchData.data[Math.floor(Math.random() * searchData.data.length)];

        // 詳細情報を取得
        const detailResponse = await fetch(
          `https://api.artic.edu/api/v1/artworks/${randomArtwork.id}`
        );
        const detailData = await detailResponse.json();

        if (isMounted && detailData.data && detailData.data.image_id) {
          const art = detailData.data;
          setArtwork({
            title: art.title || '無題',
            artist: art.artist_display || selectedArtist.display,
            imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
            date: art.date_display || '',
            style: art.style_title || '',
            description:
              art.short_description ||
              art.thumbnail?.alt_text ||
              `${selectedArtist.display}の作品`,
          });
        } else {
          // フォールバック：確実な名作
          const fallbackIds = [27992, 20684, 16568]; // 北斎、モネ、ゴッホ
          const fallbackId =
            fallbackIds[Math.floor(Math.random() * fallbackIds.length)];

          const fallbackResponse = await fetch(
            `https://api.artic.edu/api/v1/artworks/${fallbackId}`
          );
          const fallbackData = await fallbackResponse.json();

          if (isMounted && fallbackData.data && fallbackData.data.image_id) {
            const art = fallbackData.data;
            setArtwork({
              title: art.title || '無題',
              artist: art.artist_display || '作者不明',
              imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
              date: art.date_display || '',
              style: art.style_title || '名作',
              description:
                art.short_description ||
                art.thumbnail?.alt_text ||
                '世界的名作',
            });
          }
        }
      } catch (err) {
        console.error('Artwork fetch error:', err);
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
        <h2 className="not-found-title">
          {type === 'ticket'
            ? 'チケットが見つかりません'
            : 'ページが見つかりません'}
        </h2>
        <p className="not-found-message">
          {type === 'ticket'
            ? 'お探しのチケットは存在しないか、削除された可能性があります。'
            : 'お探しのページは存在しないか、移動した可能性があります。'}
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
