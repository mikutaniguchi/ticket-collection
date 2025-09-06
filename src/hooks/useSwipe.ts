import { useRef, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}

export const useSwipe = (handlers: SwipeHandlers, threshold: number = 50) => {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.startX) return;

    const touch = e.touches[0];
    touchState.current.deltaX = touch.clientX - touchState.current.startX;
    touchState.current.deltaY = touch.clientY - touchState.current.startY;
  };

  const handleTouchEnd = () => {
    const { deltaX, deltaY } = touchState.current;

    // 縦方向のスワイプが水平方向より大きい場合は無視（スクロール）
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // スワイプの閾値チェック
    if (Math.abs(deltaX) < threshold) return;

    if (deltaX > 0) {
      // 右にスワイプ（前へ）
      handlers.onSwipeRight?.();
    } else {
      // 左にスワイプ（次へ）
      handlers.onSwipeLeft?.();
    }

    // リセット
    touchState.current = {
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
    };
  };

  // マウス対応（デスクトップ）
  const handleMouseDown = (e: React.MouseEvent) => {
    touchState.current = {
      startX: e.clientX,
      startY: e.clientY,
      deltaX: 0,
      deltaY: 0,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchState.current.startX) return;

    touchState.current.deltaX = e.clientX - touchState.current.startX;
    touchState.current.deltaY = e.clientY - touchState.current.startY;
  };

  const handleMouseUp = () => {
    const { deltaX, deltaY } = touchState.current;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < threshold) return;

    if (deltaX > 0) {
      handlers.onSwipeRight?.();
    } else {
      handlers.onSwipeLeft?.();
    }

    touchState.current = {
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
    };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };
};

// キーボードナビゲーション用フック
export const useKeyboardNavigation = (handlers: {
  onPrevious: () => void;
  onNext: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlers.onPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlers.onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
