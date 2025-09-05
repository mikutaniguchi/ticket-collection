# Claude Code Project Settings

## プロジェクト概要
チケットコレクション管理アプリケーション

## 開発ルール

### コスト管理
- 有料のサービスやAPIは使用しない
- 無料枠内でのみ動作するよう実装
- Firebase: 無料プラン（Sparkプラン）の範囲内で実装

### Git操作
- コミット時に署名は不要（Co-Authored-By: Claude の署名なし）
- シンプルなコミットメッセージのみ
- コミットメッセージは日本語で記述

### コード品質
- lint実行: `pnpm run lint`
- 型チェック: `pnpm run type-check`
- フォーマット: `pnpm run format`

### UI実装ルール
- 絵文字は使用しない（アクセシビリティとデザイン統一のため）
- アイコンは lucide-react を使用する

### 開発コマンド
- 開発サーバー起動: `pnpm run dev`
- ビルド: `pnpm run build`

## テクノロジースタック
- React + TypeScript
- Vite
- Firebase (Auth + Firestore)
- pnpm (パッケージマネージャー)