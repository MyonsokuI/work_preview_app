-- =====================================
-- DB Initialization Script (大文字版)
-- PostgreSQL
-- =====================================

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS pdfs;
DROP TABLE IF EXISTS pdf;
DROP TABLE IF EXISTS users;

-- =====================================
-- 1. users
-- =====================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    employee_id INTEGER UNIQUE,
    name VARCHAR(100),
    password VARCHAR(255),
    status VARCHAR(20),   -- ACTIVE / INACTIVE / SUSPENDED
    roles VARCHAR(20),    -- ADMIN / USER
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- =====================================
-- 2. pdfs
-- =====================================
CREATE TABLE pdfs (
    pdf_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    path VARCHAR(500),
    uploader INTEGER,
    open_at TIMESTAMP,
    close_at TIMESTAMP,

    -- デフォルト値を大文字に変更
    status VARCHAR(20) DEFAULT 'DRAFT', 
    -- DRAFT / SCHEDULED / PUBLISHED / CLOSED

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_pdfs_uploader
        FOREIGN KEY (uploader)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    pdf_id INTEGER,
    question_text TEXT,
    correct_answer TEXT,
    open_at TIMESTAMP,
    close_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'DRAFT', -- 大文字に変更

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_questions_pdf
        FOREIGN KEY (pdf_id)
        REFERENCES pdfs(pdf_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_questions_pdf_id ON questions(pdf_id);

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
        ON DELETE SET NULL,

    CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions(question_id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_answers_user_question
    ON answers(user_id, question_id);

CREATE INDEX idx_answers_submitted_at
    ON answers(submitted_at);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    answer_id INTEGER,
    reviewer_id INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_answer
        FOREIGN KEY (answer_id)
        REFERENCES answers(answer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_reviewer
        FOREIGN KEY (reviewer_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_reviews_answer_id ON reviews(answer_id);

-- =========================
-- users (データを大文字に修正)
-- =========================
INSERT INTO users (user_id, employee_id, name, password, status, roles) VALUES
(1, 10000001, 'admin', 'password', 'ACTIVE', 'ADMIN'),
(2, 10000002, 'user1', 'hashed_user', 'ACTIVE', 'USER'),
(3, 10000003, 'user2', 'pass123', 'ACTIVE', 'USER'),
(4, 10000004, 'user3', 'pass123', 'ACTIVE', 'USER'),
(5, 10000005, 'user4', 'pass123', 'ACTIVE', 'USER'),
(6, 10000006, 'user5', 'pass123', 'ACTIVE', 'USER'),
(7, 10000007, 'user6', 'pass123', 'ACTIVE', 'USER'),
(8, 10000008, 'user7', 'pass123', 'ACTIVE', 'USER'),
(9, 10000009, 'user8', 'pass123', 'INACTIVE', 'USER'),
(10, 10000010, 'user9', 'pass123', 'ACTIVE', 'USER');

SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1));

-- =========================
-- pdfs (データを大文字に修正)
-- =========================
INSERT INTO pdfs (pdf_id, title, path, uploader, status) VALUES
(1, 'Java基礎', '/files/java_basic.pdf', 1, 'PUBLISHED'),
(2, 'SQL基礎', '/files/sql_basic.pdf', 1, 'PUBLISHED'),
(3, 'データベース設計', '/files/db_design.pdf', 1, 'PUBLISHED'),
(4, 'Spring Boot基礎', '/files/springboot_basic.pdf', 1, 'PUBLISHED'),
(5, 'React基礎', '/files/react_basic.pdf', 1, 'PUBLISHED');

SELECT setval('pdfs_pdf_id_seq', COALESCE((SELECT MAX(pdf_id) FROM pdfs), 1));

-- =========================
-- questions (データを大文字に修正)
-- =========================
INSERT INTO questions (pdf_id, question_text, correct_answer, status, open_at, close_at) VALUES
(1, 'Javaとは何か？', 'プログラミング言語', 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'クラスとは何か？', 'オブジェクトの設計図', 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, '継承とは何か？', '既存クラスを引き継ぐ仕組み', 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'ポリモーフィズムとは何か？', '同じ操作で異なる振る舞い', 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),

(2, 'SELECT文の役割は？', 'データ取得', 'PUBLISHED', NULL, NULL),
(2, 'WHERE句の役割は？', '条件指定', 'PUBLISHED', NULL, NULL),
(2, 'ORDER BY句の役割は？', '並び替え', 'PUBLISHED', NULL, NULL),

(3, '主キーとは？', '行を一意に識別するキー', 'PUBLISHED', NULL, NULL),
(3, '外部キーとは？', '他テーブルを参照するキー', 'PUBLISHED', NULL, NULL),
(3, '正規化とは？', 'データ重複を減らすこと', 'PUBLISHED', NULL, NULL),

(4, 'Controllerの役割は？', 'リクエスト処理', 'PUBLISHED', NULL, NULL),
(4, 'Serviceの役割は？', '業務ロジック', 'PUBLISHED', NULL, NULL),
(4, 'Repositoryの役割は？', 'DBアクセス', 'PUBLISHED', NULL, NULL),

(5, 'Componentとは？', 'UI部品', 'PUBLISHED', NULL, NULL),
(5, 'Stateとは？', '状態管理', 'PUBLISHED', NULL, NULL),
(5, 'Propsとは？', '親から渡される値', 'PUBLISHED', NULL, NULL);

SELECT setval('questions_question_id_seq', COALESCE((SELECT MAX(question_id) FROM questions), 1));

-- =========================
-- answers
-- =========================
INSERT INTO answers (user_id, question_id, answer_content, submitted_at)
SELECT
    ((q.question_id + s.n) % 8) + 2,
    q.question_id,
    '回答サンプル Question=' || q.question_id,
    NOW() - (s.n || ' days')::INTERVAL
FROM questions q
CROSS JOIN (
    SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
) s;

SELECT setval('answers_answer_id_seq', COALESCE((SELECT MAX(answer_id) FROM answers), 1));

INSERT INTO reviews (answer_id, reviewer_id, comment)
SELECT
    answer_id,
    1,
    'よく書けています。'
FROM answers
WHERE answer_id % 3 = 0;

SELECT setval('reviews_review_id_seq', COALESCE((SELECT MAX(review_id) FROM reviews), 1));
