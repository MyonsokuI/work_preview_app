# 1. Node.js環境をベースにする
FROM node:20-alpine

WORKDIR /app

# 2. パッケージ情報をコピーしてライブラリをインストール
COPY package*.json ./
RUN npm install

# 3. 残りのソースコードをコピー
COPY . .

# 4. Reactの開発用ポート（Viteなら5173、CRAなら3000など環境に合わせて変更）
EXPOSE 5173

# 5. 開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]