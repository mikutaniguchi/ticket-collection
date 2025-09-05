# Ticket Collection - 開発環境設定

## 概要
最小限の設定でTypeScript、ESLint、Prettier、コミット前チェックを実現。
コード品質維持と開発効率のバランスを重視。

## 必要なパッケージ

### 基本開発環境
```bash
# ESLint最小構成
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D eslint-config-prettier

# Prettier
npm install -D prettier

# コミット前チェック
npm install -D husky lint-staged
```

## 設定ファイル

### ESLint設定（.eslintrc.js）
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Prettierとの競合を防ぐ
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  rules: {
    // React設定
    'react/react-in-jsx-scope': 'off', // React 17+では不要
    'react/prop-types': 'off', // TypeScriptで型チェック

    // TypeScript設定
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // 基本ルール
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier設定（.prettierrc）
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### TypeScript設定（tsconfig.json）
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## package.json スクリプト

### 必要なスクリプト
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "type-check": "tsc --noEmit",
    "preview": "vite preview",
    "prepare": "husky install"
  }
}
```

## コミット前チェック設定

### Husky設定
```bash
# huskyの初期化
npx husky install

# pre-commitフック作成
npx husky add .husky/pre-commit "npx lint-staged"
```

### lint-staged設定（package.json）
```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "tsc --noEmit",
      "eslint --max-warnings 0",
      "prettier --write"
    ]
  }
}
```

## VS Code設定

### .vscode/settings.json
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### .vscode/extensions.json
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## セットアップコマンド

### 初回セットアップ
```bash
# 依存関係インストール
npm install

# Git Hooks設定
npm run prepare
```

### 日常開発
```bash
# 開発サーバー起動
npm run dev

# 手動チェック
npm run type-check
npm run lint
npm run format
```

## コミット前に実行されるチェック

1. **TypeScriptコンパイルチェック** - `tsc --noEmit`
2. **ESLintチェック** - `eslint --max-warnings 0`
3. **Prettierフォーマット** - `prettier --write`

エラーがあるとコミットが阻止されます。