import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { TicketFormData } from '../types/ticket';
import Header from '../components/layout/Header';
import TicketForm from '../components/features/ticket/TicketForm';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: TicketFormData) => {
    if (!user) {
      alert('ログインが必要です');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const ticketId = await ticketService.createTicket(user.uid, data);
      navigate(`/tickets/${ticketId}`);
    } catch (error) {
      console.error('チケット作成に失敗しました:', error);
      alert('チケットの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
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
            新しいチケットを追加
          </h1>
          <TicketForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
