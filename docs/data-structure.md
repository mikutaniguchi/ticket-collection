# 美術館記録アプリ - データ構造設計書

## 概要
美術館や展示会に行った記録を保存・管理するアプリのデータ構造定義

## Firestore コレクション設計

### users コレクション
```
users/{userId}  // Googleのuidをそのまま使用
├── email: string            // Googleアカウントのメールアドレス
├── displayName: string      // 表示名（編集可能）
├── photoURL: string         // プロフィール画像URL（編集可能）
└── createdAt: timestamp     // アカウント作成日時
```

### tickets コレクション
```
tickets/{ticketId}           // 自動生成ID
├── userId: string           // 作成者のGoogle UID
├── ticketImage: string      // メインのチケット画像URL
├── exhibitionName: string   // 展示会名
├── museumName: string       // 美術館名
├── exhibitionUrl?: string   // 展示会公式URL（任意）
├── visitDate: timestamp     // 展示会に行った日付
├── rating: number           // 評価（0.5〜5.0の★評価）
├── review: string           // 感想（Markdown形式対応）
├── gallery: string[]        // 追加画像URLの配列（最大5枚）
├── createdAt: timestamp     // レコード作成日時
└── updatedAt: timestamp     // レコード更新日時
```

## Firebase Storage 構造

```
images/
└── {userId}/
    └── tickets/
        └── {ticketId}/
            ├── ticket.jpg           // メインのチケット画像
            └── gallery/
                ├── 1.jpg            // 追加画像1
                ├── 2.jpg            // 追加画像2
                ├── 3.jpg            // 追加画像3
                ├── 4.jpg            // 追加画像4
                └── 5.jpg            // 追加画像5
```

## データ型詳細

### rating（評価）
- 型: `number`
- 範囲: 0.5 〜 5.0
- 刻み: 0.5
- 例: 3.5 → ★★★☆☆（半分の星あり）

### review（感想）
- 型: `string`
- 形式: Markdown
- 対応機能:
  - リンク: `[テキスト](URL)`
  - 箇条書き: `- 項目1`、`- 項目2`
  - 改行対応

### gallery（追加画像）
- 型: `string[]`（URL配列）
- 最大枚数: 5枚
- 表示: 正方形グリッド、クリックで拡大・スライダー表示

## 特殊機能

### 美術館名のGoogleマップ連携
- `museumName`を使用してGoogleマップ検索リンクを自動生成
- URL形式: `https://www.google.com/maps/search/${museumName}`
- 表示時にクリック可能なリンクとして表示

## セキュリティルール（Firestore）
```javascript
// 各ユーザーは自分のデータのみアクセス可能
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // users: 自分のドキュメントのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // tickets: 自分が作成したチケットのみ読み書き可能
    match /tickets/{ticketId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 実装メモ
- 認証: Firebase Auth（Googleログイン）
- 画像アップロード: Firebase Storage
- データベース: Firestore
- フロントエンド: React + TypeScript + Vite
- スタイリング: Tailwind CSS