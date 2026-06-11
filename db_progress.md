# ■ バックエンド引き継ぎ資料（2人目用）

## ■ プロジェクト概要

Spring Boot を用いた学習管理システム（LMS風アプリ）のバックエンド開発。

既に以下は完成済み：
- Entity設計
- Service層（基本ロジック）
- Repository層（JPA）
- DBリレーション設計



## ■ 現在の開発フェーズ

👉 「API化フェーズ（Controller実装段階）」

バックエンドは内部ロジックはほぼ完成しており、
外部（React）と接続するためのAPI作成がメインタスク。



## ■ 技術スタック

- Spring Boot 3.5.14
- Spring Data JPA
- PostgreSQL
- Lombok
- REST API（未完成）
- JWT（未実装）



## ■ 既存アーキテクチャ

```

controller/   ← 未実装（今回の担当）
service/      ← 実装済み
repository/   ← 実装済み
entity/       ← 完成
dto/          ← 未実装（重要）
security/     ← 未実装

```



## ■ Entity構成

### User
- userId: Long
- name: String
- password: String
- status: String



### Question
- questionId: Long
- pdf: Pdf (ManyToOne)
- questionText: String
- correctAnswer: String



### Answer
- answerId: Long
- user: User (ManyToOne)
- question: Question (ManyToOne)
- answerContent: String
- submittedAt: LocalDateTime



### Pdf
- テーマ管理用エンティティ



## ■ 主要API一覧（実装対象）

### ■ Auth
- POST /api/auth/login
- POST /api/auth/logout（簡易）


### ■ Answer
- POST /api/answers
- PUT /api/answers/{id}
- GET /api/answers/my
- GET /api/questions/{id}/answers


### ■ Question
- GET /api/themes/{themeId}/questions
- GET /api/questions/{id}
- POST /api/questions
- PUT /api/questions/{id}
- DELETE /api/questions/{id}

### ■ Pdf
- GET /api/themes
- POST /api/themes
- PUT /api/themes/{id}
- DELETE /api/themes/{id}


## ■ あなたの担当範囲（2人目）

### ■ ① Controller実装（最優先）
- REST API作成
- Service呼び出し
- HTTPレスポンス設計

対象：
- AuthController
- QuestionController
- AnswerController
- PdfController


### ■ ② API接続確認
- Postmanテスト
- 動作確認
- エラーハンドリング


### ■ ③ DTO接続（必要に応じて）
※まだ未整備のため最初はEntity直でも可（後で修正）


## ■ 設計ルール（必須）

- DBアクセスはService経由
- Controllerはロジックを書かない
- Entity直操作は禁止（将来的にDTOへ移行）
- URL設計は統一する
- HTTPメソッド厳守（GET/POST/PUT/DELETE）



## ■ NGルール

- Controllerにビジネスロジックを書く
- Repositoryを直接Controllerから呼ぶ
- ID型を勝手に変更する
- 命名ルールを変える



## ■ 開発優先順位

### ① QuestionController
（最も使用頻度が高い）

### ② AnswerController
（学習ログの中核）

### ③ PdfController
（テーマ管理）

### ④ AuthController
（後回しでもOK）



## ■ 期待する成果

- Reactと接続可能なREST API完成
- CRUD一通り動作
- フロントから呼べる状態



## ■ 一言まとめ

バックエンドは内部ロジックは完成済みで、
今回の作業は「APIとして外部公開する作業」です。



# ■ ■ 補足（重要）

この2人目の人は👇

👉 **「設計は触らない」
👉 「APIを作るだけ」**

にすると事故が起きません。

