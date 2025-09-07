import { Plus } from 'lucide-react';
import './FloatingButton.css';

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button onClick={onClick} className="floating-button">
      <Plus size={28} />
    </button>
  );
}
