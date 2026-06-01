# work_preview_app



## ■ バックエンド進捗（ヤスタケ）

### ■ 完了済み

#### ■ Entity設計
- User
- Question
- Answer
- Pdf

リレーション設計（JPA）
- User 1 → N Answer
- Question 1 → N Answer
- Pdf 1 → N Question

---

#### ■ Service層

### QuestionService
- 問題CRUD処理実装済み
- テーマ（Pdf）単位の問題取得
- DB全件取得を廃止しRepositoryベースに最適化済み

### AnswerService
- 回答作成処理
- 回答更新処理
- ユーザー別回答取得
- 問題別回答取得

---

#### ■ Repository層

### QuestionRepository
```java
List<Question> findByPdf_PdfId(Long pdfId);
````

### AnswerRepository

```java
List<Answer> findByUser_UserId(Long userId);
List<Answer> findByQuestion_QuestionId(Long questionId);
```

---

### ■ 設計ルール（重要）

* DB操作は必ずRepositoryで実施
* Serviceで全件取得してフィルタしない
* Entity構造にServiceを完全一致させる
* ID型はLongで統一
* リレーションは@ManyToOneで管理

---

### ■ 現在の状態まとめ

バックエンドは基盤部分（Entity / Service / Repository）がほぼ完成しており、
現在はAPI公開（Controller層）に移行する段階。

---

### ■ 未実装

* Controller層（APIエンドポイント）
* DTO設計（Entity直返しの改善）
* JWT認証（ログイン機能）
* 例外ハンドリング（GlobalExceptionHandler）
* React連携（フロントエンド接続）

---

### ■ 次の開発ステップ

1. Controller層の作成（REST API公開）
2. DTO導入（設計の安定化）
3. JWT認証の実装
4. React連携
5. 画面UI開発

---

### ■ 一言まとめ

バックエンドは「データ設計とビジネスロジック」は完成しており、
現在は「API化・フロント接続フェーズ」に移行している状態。