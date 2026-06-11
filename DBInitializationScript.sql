-- =====================================
-- DB Initialization Script (Latest ER Structure)
-- PostgreSQL
-- =====================================

-- テーブル削除（依存関係の下から順番に削除します）
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS pdf;
DROP TABLE IF EXISTS pdfs;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;

-- =====================================
-- 1. users テーブル
-- =====================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    employee_id INTEGER UNIQUE, -- 8桁などの一意な社員ID
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    roles VARCHAR(20) DEFAULT 'user',    -- admin, user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- =====================================
-- 2. pdfs テーブル（旧: pdf から変更）
-- =====================================
CREATE TABLE pdfs (
    pdf_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR(500),
    uploader INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_pdfs_uploader
        FOREIGN KEY (uploader)
        REFERENCES users(user_id)
        ON DELETE SET NULL -- アップローダーが消えてもPDFデータは残す
);

-- =====================================
-- 3. questions テーブル
-- =====================================
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    pdf_id INTEGER,
    question_text TEXT,
    correct_answer TEXT,
    open_at TIMESTAMP,
    close_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, published, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_questions_pdfs
        FOREIGN KEY (pdf_id)
        REFERENCES pdfs(pdf_id)
        ON DELETE CASCADE -- PDFが消えたら問題もまとめて削除
);

-- インデックス追加
CREATE INDEX idx_questions_pdf_id ON questions(pdf_id);

-- =====================================
-- 4. answers テーブル
-- =====================================
CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    question_id INTEGER,
    answer_content TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_answers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL, -- ユーザーが消えても回答履歴は残す（設計意図）
    CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions(question_id)
        ON DELETE CASCADE -- 問題が消えたら回答もまとめて削除
);

-- インデックスと一意制約（ユーザー×問題の重複回答を防ぐ上書き型設定）
CREATE UNIQUE INDEX idx_answers_user_question ON answers(user_id, question_id);
CREATE INDEX idx_answers_submitted_at ON answers(submitted_at);

-- =====================================
-- 5. reviews テーブル（新設）
-- =====================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    answer_id INTEGER,
    reviewer_id INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_answer
        FOREIGN KEY (answer_id)
        REFERENCES answers(answer_id)
        ON DELETE CASCADE, -- 回答が消えたらレビューも削除
    CONSTRAINT fk_reviews_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL -- レビュワーが消えてもコメントは残す
);

CREATE INDEX idx_reviews_answer_id ON reviews(answer_id);


-- =====================================
-- 🚀 データ挿入 (SEED)
-- =====================================

-- 1. usersデータ追加 (パスワード、status、rolesはJavaの動作用に調整)
INSERT INTO users (user_id, employee_id, name, password, status, roles) VALUES
(1, 10000001, 'admin', 'password', 'active', 'ADMIN'),
(2, 10000002, 'user1', 'hashed_user', 'active', 'USER'),
(3, 10000003, 'user2', 'pass123', 'active', 'USER'),
(4, 10000004, 'user3', 'pass123', 'active', 'USER'),
(5, 10000005, 'user4', 'pass123', 'active', 'USER'),
(6, 10000006, 'user5', 'pass123', 'active', 'USER'),
(7, 10000007, 'user6', 'pass123', 'active', 'USER'),
(8, 10000008, 'user7', 'pass123', 'active', 'USER'),
(9, 10000009, 'user8', 'pass123', 'inactive', 'USER'),
(10, 10000010, 'user9', 'pass123', 'active', 'USER');

-- SERIAL値を現在の最大値に同期させる（users用）
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));

-- 2. pdfsデータ追加（アップローダーはすべてadmin:1に設定）
INSERT INTO pdfs (pdf_id, title, path, uploader) VALUES
(1, 'Java基礎', '/files/java_basic.pdf', 1),
(2, 'SQL基礎', '/files/sql_basic.pdf', 1),
(3, 'データベース設計', '/files/db_design.pdf', 1),
(4, 'Spring Boot基礎', '/files/springboot_basic.pdf', 1),
(5, 'React基礎', '/files/react_basic.pdf', 1);

SELECT setval('pdfs_pdf_id_seq', (SELECT MAX(pdf_id) FROM pdfs));

-- 3. questionsデータ追加（ステータスは公開「published」に設定）
-- pdf1(Java基礎)
INSERT INTO questions (pdf_id, question_text, correct_answer, status, open_at, close_at) VALUES
(1, 'Javaとは何か？', 'プログラミング言語', 'published', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'クラスとは何か？', 'オブジェクトの設計図', 'published', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, '継承とは何か？', '既存クラスを引き継ぐ仕組み', 'published', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'ポリモーフィズムとは何か？', '同じ操作で異なる振る舞い', 'published', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days');

-- pdf2(SQL基礎)
INSERT INTO questions (pdf_id, question_text, correct_answer, status) VALUES
(2, 'SELECT文の役割は？', 'データ取得', 'published'),
(2, 'WHERE句の役割は？', '条件指定', 'published'),
(2, 'ORDER BY句の役割は？', '並び替え', 'published');

-- pdf3(DB設計)
INSERT INTO questions (pdf_id, question_text, correct_answer, status) VALUES
(3, '主キーとは？', '行を一意に識別するキー', 'published'),
(3, '外部キーとは？', '他テーブルを参照するキー', 'published'),
(3, '正規化とは？', 'データ重複を減らすこと', 'published');

-- pdf4(Spring Boot)
INSERT INTO questions (pdf_id, question_text, correct_answer, status) VALUES
(4, 'Controllerの役割は？', 'リクエスト処理', 'published'),
(4, 'Serviceの役割は？', '業務ロジック', 'published'),
(4, 'Repositoryの役割は？', 'DBアクセス', 'published');

-- pdf5(React)
INSERT INTO questions (pdf_id, question_text, correct_answer, status) VALUES
(5, 'Componentとは？', 'UI部品', 'published'),
(5, 'Stateとは？', '状態管理', 'published'),
(5, 'Propsとは？', '親から渡される値', 'published');

-- 4. answersデータ自動追加（各問題に5件ずつの回答を自動生成）
INSERT INTO answers (user_id, question_id, answer_content, submitted_at)
SELECT 
    ((q.question_id + s.n) % 8) + 2, -- user_id 2 から 9 までの間で動的に割り当て
    q.question_id,
    '回答サンプル Question=' || q.question_id || ' User=' || (((q.question_id + s.n) % 8) + 2),
    NOW() - (s.n || ' days')::INTERVAL
FROM questions q
CROSS JOIN (
    SELECT 1 AS n
    UNION SELECT 2
    UNION SELECT 3
    UNION SELECT 4
    UNION SELECT 5
) s;

-- 5. reviewsデータ追加 (テスト用にいくつかの回答にレビューを付与)
INSERT INTO reviews (answer_id, reviewer_id, comment)
SELECT 
    answer_id,
    1, -- レビュワーはadmin(1)
    'よく書けています。素晴らしい解答です。'
FROM answers
WHERE answer_id % 3 = 0; -- 3つに1つの割合でレビューを自動生成
