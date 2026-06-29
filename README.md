実行手順
アプリケーションを起動するには、以下の手順で進めてください。

1. データベースの初期化
PostgreSQLにログインした状態で、初期化スクリプトを実行してテーブルを作成します。

Bash
# PostgreSQLに接続後
\i DBinitializationScript.sql

2. バックエンド（Spring Boot）の起動
VS Code を使用してバックエンドを起動します。

VS Code の Spring Boot 拡張機能を使用し、プロジェクト内の DemoApplication（メインクラス）を実行して起動してください。

3. フロントエンド（React）の起動
ターミナルでフロントエンドのディレクトリに移動し、必要なパッケージをインストールした後に開発用サーバーを起動します。

Bash
# パッケージのインストール
npm install

# 開発用サーバーの起動
npm run dev