import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTickets } from '../data/mockTickets';
import type { Ticket, TicketFormData } from '../types/ticket';
import Header from '../components/layout/Header';
import TicketForm from '../components/features/ticket/TicketForm';

export default function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;

      try {
        const foundTicket = mockTickets.find((t) => t.id === id);
        setTicket(foundTicket || null);
      } catch (error) {
        console.error('チケットの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmit = async (_data: TicketFormData) => {
    if (!ticket) return;

    setSaving(true);
    try {
      // TODO: Firebase Storageに新しい画像をアップロード（必要に応じて）
      // TODO: Firestoreのチケットデータを更新
      // TODO: チケットを更新

      // 成功時は詳細ページに戻る
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error('チケット更新に失敗しました:', error);
      // TODO: エラーメッセージを表示
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
        <p>チケットが見つかりません</p>
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
    exhibitionName: ticket.exhibitionName,
    museumName: ticket.museumName,
    exhibitionUrl: ticket.exhibitionUrl,
    visitDate: ticket.visitDate,
    rating: ticket.rating,
    review: ticket.review,
    gallery: ticket.gallery,
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: 'var(--background-light)' }}
    >
      <Header />
      <div style={{ padding: '2rem 1rem', paddingTop: '4rem' }}>
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
            チケットを編集
          </h1>
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
