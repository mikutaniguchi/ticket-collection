import { Calendar, Image, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { TicketFormData } from '../../../types/ticket';
import SimpleMarkdownEditor from '../../ui/SimpleMarkdownEditor';
import './TicketForm.css';

interface TicketFormProps {
  initialData?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function TicketForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    ticketImage: '',
    title: '',
    location: '',
    websiteUrl: '',
    visitDate: new Date(),
    rating: 3,
    review: '',
    gallery: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketImagePreview, setTicketImagePreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));

      // 画像プレビューの設定
      if (
        typeof initialData.ticketImage === 'string' &&
        initialData.ticketImage
      ) {
        setTicketImagePreview(initialData.ticketImage);
      }
      if (initialData.gallery && Array.isArray(initialData.gallery)) {
        const previews = initialData.gallery
          .filter((img): img is string => typeof img === 'string')
          .slice(0, 5);
        setGalleryPreviews(previews);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '名称は必須です';
    }
    if (!formData.ticketImage) {
      newErrors.ticketImage = 'チケット画像は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof TicketFormData,
    value: string | number | Date | File | (File | string)[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTicketImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('ticketImage', file);
      const reader = new FileReader();
      reader.onload = () => setTicketImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 現在のギャラリーと新しいファイルを結合（最大5枚まで）
    const currentGallery = formData.gallery as File[];
    const remainingSlots = 5 - currentGallery.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      // すべてのファイルを一度に追加
      const newGallery = [...currentGallery, ...filesToAdd];
      handleInputChange('gallery', newGallery);

      // プレビュー更新
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setGalleryPreviews((prev) =>
            [...prev, reader.result as string].slice(0, 5)
          );
        };
        reader.readAsDataURL(file);
      });
    }

    // inputをリセットして同じファイルも再選択可能にする
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = (formData.gallery as (File | string)[]).filter(
      (_, i) => i !== index
    );
    handleInputChange('gallery', newGallery);
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('送信エラー:', error);
      }
    }
  };

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`star-button ${formData.rating >= value ? 'active' : ''}`}
            onClick={() => handleInputChange('rating', value)}
          >
            <Star
              size={20}
              fill={formData.rating >= value ? '#ffd700' : 'none'}
              color={formData.rating >= value ? '#ffd700' : '#ccc'}
            />
          </button>
        ))}
        <span className="rating-value">{formData.rating}</span>
      </div>
    );
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label required">
          <Calendar size={16} />
          訪問日時
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="date"
            value={formData.visitDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const newDate = new Date(formData.visitDate);
              const selectedDate = new Date(e.target.value);
              newDate.setFullYear(selectedDate.getFullYear());
              newDate.setMonth(selectedDate.getMonth());
              newDate.setDate(selectedDate.getDate());
              handleInputChange('visitDate', newDate);
            }}
            className="form-input"
            style={{ flex: 2 }}
          />
          <select
            value={formData.visitDate.getHours()}
            onChange={(e) => {
              const newDate = new Date(formData.visitDate);
              newDate.setHours(parseInt(e.target.value));
              newDate.setMinutes(0);
              handleInputChange('visitDate', newDate);
            }}
            className="form-input"
            style={{ flex: 1 }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}時
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">名称</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="form-input"
          placeholder="例: モネ展"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">場所</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="form-input"
          placeholder="例: 国立西洋美術館"
        />
        {errors.location && (
          <span className="error-message">{errors.location}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">公式サイトURL</label>
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
          className="form-input"
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">評価</label>
        {renderStarRating()}
      </div>

      <div className="form-group">
        <label className="form-label">感想</label>
        <SimpleMarkdownEditor
          value={formData.review}
          onChange={(value) => handleInputChange('review', value)}
          placeholder="感想を書いてください... (URLや箇条書き「- 」が使えます)"
        />
      </div>

      <div className="form-group">
        <label className="form-label required">
          <Image size={16} />
          チケット画像
        </label>
        <div className="image-upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleTicketImageChange}
            className="image-input"
            id="ticket-image"
          />

          {ticketImagePreview ? (
            <label htmlFor="ticket-image" style={{ cursor: 'pointer' }}>
              <img
                src={ticketImagePreview}
                alt="チケット画像"
                className="image-preview"
                title="クリックして画像を変更"
              />
            </label>
          ) : (
            <label htmlFor="ticket-image" className="image-upload-button">
              <div className="upload-placeholder">
                <Image size={32} />
                <span>画像を選択</span>
              </div>
            </label>
          )}
        </div>
        {errors.ticketImage && (
          <span className="error-message">{errors.ticketImage}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">ギャラリー画像（最大5枚）</label>
        <div className="gallery-upload">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="image-input"
            id="gallery-images"
            disabled={(formData.gallery?.length || 0) >= 5}
          />
          <label
            htmlFor="gallery-images"
            className={`gallery-upload-button ${(formData.gallery?.length || 0) >= 5 ? 'disabled' : ''}`}
          >
            <Image size={24} />
            <span>画像を追加 ({formData.gallery?.length || 0}/5)</span>
          </label>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="gallery-previews">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="gallery-preview-item">
                <img src={preview} alt={`ギャラリー画像 ${index + 1}`} />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => removeGalleryImage(index)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
          disabled={loading}
        >
          キャンセル
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
