# Ticket Collection - コンポーネント設計書

## 設計原則

### 責任分離
- **Presentational Components**: UIの見た目のみ担当
- **Container Components**: ロジック・状態管理を担当
- **Custom Hooks**: データ取得・状態管理を分離

### 再利用性
- 汎用的なUIコンポーネントは`components/ui/`に配置
- 機能特化したコンポーネントは`components/features/`に配置

### TypeScript
- すべてのPropsに型定義
- 必須・任意プロパティを明確に定義

## ディレクトリ構成

```
src/components/
├── ui/                    # 汎用UIコンポーネント
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── LoadingSpinner.tsx
│   └── FloatingButton.tsx
├── layout/                # レイアウト関連
│   ├── Header.tsx
│   ├── Layout.tsx
└── features/              # 機能特化コンポーネント
    ├── ticket/
    │   ├── TicketCard.tsx
    │   ├── TicketGrid.tsx
    │   ├── TicketForm.tsx
    │   └── TicketDetail.tsx
    ├── image/
    │   ├── ImageUpload.tsx
    │   ├── ImageGallery.tsx
    │   └── ImagePreview.tsx
    ├── rating/
    │   ├── RatingDisplay.tsx
    │   └── RatingInput.tsx
    └── markdown/
        ├── MarkdownEditor.tsx
        └── MarkdownPreview.tsx
```

## 主要コンポーネント詳細

### 1. Layout Components

#### Header
```typescript
interface HeaderProps {
  user?: User;
  onProfileClick: () => void;
}
```
**責任:**
- ロゴ表示
- プロフィールアイコン表示・クリック処理
- レスポンシブ対応

#### Layout
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}
```
**責任:**
- 全体レイアウトの枠組み提供
- ヘッダーの表示制御

### 2. Ticket Components

#### TicketCard
```typescript
interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticketId: string) => void;
  loading?: boolean;
}
```
**責任:**
- チケット情報の要約表示（画像、タイトル）
- カード形式のレイアウト
- クリックイベント処理
- ローディング状態表示

#### TicketGrid
```typescript
interface TicketGridProps {
  tickets: Ticket[];
  loading?: boolean;
  onTicketClick: (ticketId: string) => void;
}
```
**責任:**
- Pinterest風レスポンシブグリッドレイアウト
- 複数のTicketCardを管理
- ローディング状態管理

#### TicketForm
```typescript
interface TicketFormProps {
  initialData?: Partial<Ticket>;
  onSubmit: (data: TicketFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface TicketFormData {
  ticketImage: File | string;
  exhibitionName: string;
  museumName: string;
  exhibitionUrl?: string;
  visitDate: Date;
  rating: number;
  review: string;
  gallery: File[] | string[];
}
```
**責任:**
- フォーム入力制御
- バリデーション
- 画像アップロード連携
- 新規作成・編集両対応

#### TicketDetail
```typescript
interface TicketDetailProps {
  ticket: Ticket;
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}
```
**責任:**
- チケット詳細情報表示
- 編集・削除ボタン配置
- 画像ギャラリー表示

### 3. Image Components

#### ImageUpload
```typescript
interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles: number;
  maxSizeMB: number;
  accept?: string;
  loading?: boolean;
  error?: string;
}
```
**責任:**
- ドラッグ&ドロップファイル選択
- 画像圧縮処理
- プレビュー表示
- エラーハンドリング

#### ImageGallery
```typescript
interface ImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
}
```
**責任:**
- 画像グリッド表示
- 画像拡大モーダル連携

#### ImagePreview
```typescript
interface ImagePreviewProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}
```
**責任:**
- フルスクリーン画像表示
- スライダー機能
- キーボードナビゲーション

### 4. Rating Components

#### RatingDisplay
```typescript
interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}
```
**責任:**
- ★評価の表示（半分の★対応）
- サイズバリエーション

#### RatingInput
```typescript
interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```
**責任:**
- ★評価の入力（0.5刻み）
- ホバー効果
- キーボード操作対応

### 5. Markdown Components

#### MarkdownEditor
```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPreview?: boolean;
}
```
**責任:**
- Markdownテキスト入力
- プレビュー切り替え
- ツールバー（太字、リンクなど）

#### MarkdownPreview
```typescript
interface MarkdownPreviewProps {
  content: string;
  className?: string;
}
```
**責任:**
- Markdownのレンダリング
- リンクの安全な処理

### 6. UI Components

#### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### FloatingButton
```typescript
interface FloatingButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left';
}
```

#### Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### LoadingSpinner
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

## Custom Hooks設計

### useAuth
```typescript
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}
```

### useTickets
```typescript
interface UseTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  createTicket: (data: CreateTicketData) => Promise<void>;
  updateTicket: (id: string, data: UpdateTicketData) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
}
```

### useImageUpload
```typescript
interface UseImageUploadReturn {
  uploadImage: (file: File, path: string) => Promise<string>;
  uploadImages: (files: File[], basePath: string) => Promise<string[]>;
  loading: boolean;
  progress: number;
  error: string | null;
}
```

## 状態管理戦略

### Local State
- コンポーネント内の一時的な状態（フォーム入力、モーダル開閉など）
- React Hook Form（フォーム状態）

### Global State
- ユーザー認証状態
- チケットデータ
- アプリケーション設定

### Server State
- Firebase Firestoreからのデータ
- リアルタイム更新対応

## エラーハンドリング

### ErrorBoundary
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: Error}>;
}
```

### エラー表示パターン
- **Toast通知**: 一時的なエラー（アップロード失敗など）
- **インライン表示**: フォームバリデーションエラー
- **ページレベル**: 致命的なエラー（ネットワークエラーなど）

## パフォーマンス最適化

### 画像最適化
- 遅延読み込み（Intersection Observer）
- サムネイル生成
- WebP形式対応

### コンポーネント最適化
- React.memo（不要な再レンダリング防止）
- useMemo、useCallback（重い計算の最適化）
- 仮想化（大量データ表示）

## アクセシビリティ

### 必須対応
- キーボードナビゲーション
- スクリーンリーダー対応
- 適切なARIAラベル
- カラーコントラスト確保
- フォーカス管理

### 画像関連
- alt属性の適切な設定
- 画像読み込み失敗時の代替表示