FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係インストール
RUN npm ci --only=production

# ソースコードをコピー
COPY . .

# TypeScriptビルド
RUN npm run build

# ポート公開
EXPOSE 3001

# 起動コマンド
CMD ["npm", "start"]