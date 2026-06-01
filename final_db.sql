
-- =====================================
-- DB Initialization Script (Final ER)
-- PostgreSQL
-- =====================================

-- Drop tables
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS pdf;
DROP TABLE IF EXISTS users;

-- =====================================
-- users
-- =====================================
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20)
);

-- =====================================
-- pdf
-- =====================================
CREATE TABLE pdf (
    pdf_id SERIAL PRIMARY KEY,
    title VARCHAR(25)
);

-- =====================================
-- questions
-- =====================================
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    pdf_id INTEGER,
    question_text TEXT,
    correct_answer TEXT,
    CONSTRAINT fk_questions_pdf
        FOREIGN KEY (pdf_id)
        REFERENCES pdf(pdf_id)
        ON DELETE CASCADE
);

-- =====================================
-- answers
-- =====================================
CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    question_id INTEGER,
    answer_content TEXT,
    submitted_at TIMESTAMP,
    CONSTRAINT fk_answers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions(question_id)
        ON DELETE CASCADE
);

-- =====================================
-- seed (optional)
-- =====================================
INSERT INTO users (user_id, name, password, status) VALUES
(1, 'admin', 'admin123', 'ADMIN'),
(2, 'user1', 'user123', 'USER');

INSERT INTO pdf (title) VALUES
('Java基礎');

INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(1, 'Javaとは何か？', 'プログラミング言語');

