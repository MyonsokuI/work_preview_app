-- =====================================
-- DB Initialization Script
-- PostgreSQL / NOT NULL強化版
-- =====================================
CREATE DATABASE work_db;
CREATE ROLE "user" LOGIN PASSWORD 'password';
GRANT CONNECT ON DATABASE work_db TO "user";
\c work_db
GRANT USAGE ON SCHEMA public TO "user";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO "user";


DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS pdfs;
DROP TABLE IF EXISTS users;

-- =====================================
-- 1. users
-- =====================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    employee_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    roles VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- =====================================
-- 2. pdfs
-- =====================================
CREATE TABLE pdfs (
    pdf_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    path VARCHAR,
    uploader INTEGER,
    open_at TIMESTAMP,
    close_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_pdfs_uploader
        FOREIGN KEY (uploader)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_pdfs_uploader ON pdfs(uploader);

-- =====================================
-- 3. questions
-- =====================================
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    pdf_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    image_path VARCHAR,
    open_at TIMESTAMP,
    close_at TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_questions_pdf
        FOREIGN KEY (pdf_id)
        REFERENCES pdfs(pdf_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_questions_pdf_id ON questions(pdf_id);

-- =====================================
-- 4. answers
-- =====================================
CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    question_id INTEGER NOT NULL,
    answer_content TEXT,
    image_path VARCHAR,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_answers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions(question_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_question
        UNIQUE (user_id, question_id)
);

CREATE INDEX idx_answers_submitted_at ON answers(submitted_at);
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- =====================================
-- 5. reviews
-- =====================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    answer_id INTEGER NOT NULL,
    reviewer_id INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

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

-- =====================================
-- seed users
-- =====================================
INSERT INTO users (user_id, employee_id, name, password, status, roles) VALUES
(1, 10000001, 'admin', 'password', 'ACTIVE', 'ADMIN'),
(2, 10000002, 'user1', 'pass123', 'ACTIVE', 'USER'),
(3, 10000003, 'user2', 'pass123', 'ACTIVE', 'USER'),
(4, 10000004, 'user3', 'pass123', 'ACTIVE', 'USER'),
(5, 10000005, 'user4', 'pass123', 'ACTIVE', 'USER'),
(6, 10000006, 'user5', 'pass123', 'ACTIVE', 'USER'),
(7, 10000007, 'user6', 'pass123', 'ACTIVE', 'USER'),
(8, 10000008, 'user7', 'pass123', 'ACTIVE', 'USER'),
(9, 10000009, 'user8', 'pass123', 'INACTIVE', 'USER'),
(10, 10000010, 'user9', 'pass123', 'ACTIVE', 'USER');

SELECT setval('users_user_id_seq',
    COALESCE((SELECT MAX(user_id) FROM users), 1)
);

-- =====================================
-- seed pdfs
-- =====================================
INSERT INTO pdfs (pdf_id, title, path, uploader, status) VALUES
(1, 'Java基礎', '/files/java_basic.pdf', 1, 'PUBLISHED'),
(2, 'SQL基礎', '/files/sql_basic.pdf', 1, 'PUBLISHED'),
(3, 'データベース設計', '/files/db_design.pdf', 1, 'PUBLISHED'),
(4, 'Spring Boot基礎', '/files/springboot_basic.pdf', 1, 'PUBLISHED'),
(5, 'React基礎', '/files/react_basic.pdf', 1, 'PUBLISHED');

SELECT setval('pdfs_pdf_id_seq',
    COALESCE((SELECT MAX(pdf_id) FROM pdfs), 1)
);

-- =====================================
-- seed questions
-- =====================================
INSERT INTO questions (pdf_id, question_text, correct_answer, image_path, status, open_at, close_at) VALUES
(1, 'Javaとは何か？', 'プログラミング言語', NULL, 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'クラスとは何か？', 'オブジェクトの設計図', NULL, 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, '継承とは何か？', '既存クラスを引き継ぐ仕組み', NULL, 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
(1, 'ポリモーフィズムとは何か？', '同じ操作で異なる振る舞い', NULL, 'PUBLISHED', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),

(2, 'SELECT文の役割は？', 'データ取得', NULL, 'PUBLISHED', NULL, NULL),
(2, 'WHERE句の役割は？', '条件指定', NULL, 'PUBLISHED', NULL, NULL),
(2, 'ORDER BY句の役割は？', '並び替え', NULL, 'PUBLISHED', NULL, NULL),

(3, '主キーとは？', '行を一意に識別するキー', NULL, 'PUBLISHED', NULL, NULL),
(3, '外部キーとは？', '他テーブルを参照するキー', NULL, 'PUBLISHED', NULL, NULL),
(3, '正規化とは？', 'データ重複を減らすこと', NULL, 'PUBLISHED', NULL, NULL),

(4, 'Controllerの役割は？', 'リクエスト処理', NULL, 'PUBLISHED', NULL, NULL),
(4, 'Serviceの役割は？', '業務ロジック', NULL, 'PUBLISHED', NULL, NULL),
(4, 'Repositoryの役割は？', 'DBアクセス', NULL, 'PUBLISHED', NULL, NULL),

(5, 'Componentとは？', 'UI部品', NULL, 'PUBLISHED', NULL, NULL),
(5, 'Stateとは？', '状態管理', NULL, 'PUBLISHED', NULL, NULL),
(5, 'Propsとは？', '親から渡される値', NULL, 'PUBLISHED', NULL, NULL);

SELECT setval('questions_question_id_seq',
    COALESCE((SELECT MAX(question_id) FROM questions), 1)
);

-- =====================================
-- seed answers
-- =====================================
INSERT INTO answers (user_id, question_id, answer_content, image_path, submitted_at)
SELECT
    ((q.question_id + s.n) % 8) + 2,
    q.question_id,
    '回答サンプル Question=' || q.question_id,
    NULL,
    NOW() - (s.n || ' days')::INTERVAL
FROM questions q
CROSS JOIN (
    SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
) s;

SELECT setval('answers_answer_id_seq',
    COALESCE((SELECT MAX(answer_id) FROM answers), 1)
);

-- =====================================
-- seed reviews
-- =====================================
INSERT INTO reviews (answer_id, reviewer_id, comment)
SELECT
    answer_id,
    1,
    'よく書けています。'
FROM answers
WHERE answer_id % 3 = 0;

SELECT setval('reviews_review_id_seq',
    COALESCE((SELECT MAX(review_id) FROM reviews), 1)
);