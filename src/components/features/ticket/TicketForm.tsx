import { useState, useEffect } from 'react';
import { Calendar, Star, Image, X } from 'lucide-react';
import type { TicketFormData } from '../../../types/ticket';
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
    exhibitionName: '',
    museumName: '',
    exhibitionUrl: '',
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

    if (!formData.exhibitionName.trim()) {
      newErrors.exhibitionName = '展示会名は必須です';
    }
    if (!formData.ticketImage) {
      newErrors.ticketImage = 'チケット画像は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof TicketFormData,
    value: string | number | Date | string[]
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
    const newGallery = [...(formData.gallery as File[]), ...files].slice(0, 5);
    handleInputChange('gallery', newGallery);

    // プレビュー更新
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryPreviews((prev) =>
          [...prev, reader.result as string].slice(0, 5)
        );
      };
      reader.readAsDataURL(file);
    });
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
      await onSubmit(formData);
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
          訪問日
        </label>
        <input
          type="date"
          value={formData.visitDate.toISOString().split('T')[0]}
          onChange={(e) =>
            handleInputChange('visitDate', new Date(e.target.value))
          }
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label required">展示会名</label>
        <input
          type="text"
          value={formData.exhibitionName}
          onChange={(e) => handleInputChange('exhibitionName', e.target.value)}
          className="form-input"
          placeholder="例: モネとその時代"
        />
        {errors.exhibitionName && (
          <span className="error-message">{errors.exhibitionName}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">美術館名</label>
        <input
          type="text"
          value={formData.museumName}
          onChange={(e) => handleInputChange('museumName', e.target.value)}
          className="form-input"
          placeholder="例: 国立西洋美術館"
        />
        {errors.museumName && (
          <span className="error-message">{errors.museumName}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">公式サイトURL</label>
        <input
          type="url"
          value={formData.exhibitionUrl}
          onChange={(e) => handleInputChange('exhibitionUrl', e.target.value)}
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
        <textarea
          value={formData.review}
          onChange={(e) => handleInputChange('review', e.target.value)}
          className="form-textarea"
          placeholder="展示の感想を書いてください..."
          rows={4}
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
            <img
              src={ticketImagePreview}
              alt="チケット画像"
              className="image-preview"
            />
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
            <span>画像を追加</span>
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
