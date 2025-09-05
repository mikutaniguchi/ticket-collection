# 美術館記録アプリ - 技術スタック・ライブラリリスト

## コア技術スタック

### フロントエンド
- **Vite** - 高速ビルドツール
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング

### バックエンド・インフラ
- **Firebase Auth** - 認証（Googleログイン）
- **Firestore** - NoSQLデータベース
- **Firebase Storage** - 画像保存
- **Firebase Hosting** - ホスティング（PWA対応）

## 必要なライブラリ

### 基本セットアップ
```bash
npm create vite@latest museum-app -- --template react-ts
cd museum-app
npm install
```

### Firebase関連
```bash
npm install firebase
```

### ルーティング
```bash
npm install react-router-dom
# React Router v6では @types/react-router-dom は不要
```

### UI・スタイリング
```bash
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react  # モーダル・ドロップダウン用
npm install lucide-react       # アイコン（軽量で美しい）
```

### 機能ライブラリ
```bash
npm install react-markdown        # Markdown表示
npm install react-dropzone        # ファイルアップロード
npm install react-hook-form       # フォーム管理
npm install date-fns              # 日付操作
npm install uuid                  # ID生成
npm install @types/uuid
```

### 画像・UI拡張
```bash
npm install react-image-gallery   # 画像スライダー
npm install react-masonry-css     # Pinterest風レイアウト
```

### 開発・型定義
```bash
npm install -D @types/react
npm install -D @types/react-dom
```

## プロジェクト構成

```
src/
├── components/           # 再利用可能コンポーネント
│   ├── ui/              # 基本UIコンポーネント
│   ├── layout/          # レイアウト関連
│   └── forms/           # フォーム関連
├── pages/
│   ├── index.tsx            # / (ランディング・ログイン)
│   └── tickets/
│       ├── index.tsx        # /tickets (一覧)
│       ├── new.tsx          # /tickets/new (新規作成)
│       └── [id].tsx         # /tickets/:id (詳細)
├── hooks/               # カスタムフック
│   ├── useAuth.ts       # 認証管理
│   ├── useTickets.ts    # チケットデータ管理
│   └── useFirestore.ts  # Firestore操作
├── lib/                 # ユーティリティ・設定
│   ├── firebase.ts      # Firebase設定
│   ├── types.ts         # 型定義
│   └── utils.ts         # ヘルパー関数
├── styles/              # スタイル関連
│   └── globals.css
├── App.tsx
└── main.tsx
```

## Firebaseプロジェクト設定

### 1. Firebase Console設定
- 新規プロジェクト作成
- Authentication > Sign-in method > Google 有効化
- Firestore Database 作成
- Storage 作成

### 2. 環境変数（.env）
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase設定ファイル
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## PWA設定

### Vite PWA Plugin
```bash
npm install -D vite-plugin-pwa
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
```

## 型定義例

```typescript
// src/lib/types.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  ticketImage: string;
  exhibitionName: string;
  museumName: string;
  exhibitionUrl?: string;
  visitDate: Date;
  rating: number;
  review: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 画像圧縮設定

### browser-image-compression 使用例
```typescript
import imageCompression from 'browser-image-compression';

// チケット画像用
const compressTicketImage = async (file: File) => {
  const options = {
    maxSizeMB: 2,           // 最大2MB
    maxWidthOrHeight: 1920, // 最大幅・高さ
    useWebWorker: true,     // バックグラウンド処理
    quality: 0.8           // 品質 0-1
  };
  return await imageCompression(file, options);
};

// ギャラリー画像用
const compressGalleryImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,           // 最大1MB
    maxWidthOrHeight: 1280, // 最大幅・高さ
    useWebWorker: true,
    quality: 0.8
  };
  return await imageCompression(file, options);
};
```

## フォントスタック設定

### Tailwind CSS設定
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          '"Yu Gothic Medium"', '"游ゴシック Medium"',
          '"Yu Gothic"', '"游ゴシック"',
          '"Hiragino Sans"', '"ヒラギノ角ゴシック Pro"',
          '"Noto Sans JP"',
          '-apple-system', 'BlinkMacSystemFont',
          '"Segoe UI"', 'Roboto', 'sans-serif'
        ]
      }
    }
  }
}
```