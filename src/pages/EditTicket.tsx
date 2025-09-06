import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketService } from '../services/ticketService';
import type { Ticket, TicketFormData } from '../types/ticket';
import TicketForm from '../components/features/ticket/TicketForm';

export default function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      try {
        const foundTicket = await ticketService.getTicket(id);
        setTicket(foundTicket);
      } catch (error) {
        console.error('チケットの取得に失敗しました:', error);
        setError('チケットの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmit = async (data: TicketFormData) => {
    if (!ticket || !user || !id) return;

    setSaving(true);
    setError('');

    try {
      await ticketService.updateTicket(id, user.uid, data);

      // 成功時は詳細ページに戻る
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error('チケット更新に失敗しました:', error);
      setError('チケットの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tickets/${id}`);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>{error || 'チケットが見つかりません'}</p>
        <button
          onClick={() => navigate('/tickets')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  const initialData: Partial<TicketFormData> = {
    ticketImage: ticket.ticketImage,
    title: ticket.title,
    location: ticket.location,
    websiteUrl: ticket.websiteUrl,
    visitDate: ticket.visitDate,
    rating: ticket.rating,
    review: ticket.review,
    gallery: ticket.gallery,
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: 'var(--background-light)' }}
    >
      <div style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              color: 'var(--text-dark)',
              textAlign: 'center',
            }}
          >
            チケットの編集
          </h1>

          {error && (
            <div
              style={{
                background: '#fee',
                color: '#c53030',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                border: '1px solid #fed7d7',
              }}
            >
              {error}
            </div>
          )}

          <TicketForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
