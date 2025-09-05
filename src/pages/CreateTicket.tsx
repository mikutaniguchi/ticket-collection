import { useNavigate } from 'react-router-dom';
import type { TicketFormData } from '../types/ticket';
import Header from '../components/layout/Header';
import TicketForm from '../components/features/ticket/TicketForm';

export default function CreateTicket() {
  const navigate = useNavigate();

  const handleSubmit = async (_data: TicketFormData) => {
    try {
      // TODO: Firebase Storageに画像をアップロード
      // TODO: Firestoreにチケットデータを保存
      // TODO: チケットを作成

      // 成功時は一覧ページに戻る
      navigate('/tickets');
    } catch (error) {
      console.error('チケット作成に失敗しました:', error);
      // TODO: エラーメッセージを表示
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
          <TicketForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
