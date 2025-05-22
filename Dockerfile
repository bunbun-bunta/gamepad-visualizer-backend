FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 全ての依存関係をインストール（devDependenciesも含む）
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptビルド
RUN npm run build

# 本番用依存関係のみを再インストール
RUN npm ci --only=production && npm cache clean --force

# ポート公開
EXPOSE 3001

# 起動コマンド
CMD ["npm", "start"]