-- =====================================
-- users追加
-- =====================================
INSERT INTO users (user_id, name, password, status) VALUES
(3, 'user2', 'pass123', 'USER'),
(4, 'user3', 'pass123', 'USER'),
(5, 'user4', 'pass123', 'USER'),
(6, 'user5', 'pass123', 'USER'),
(7, 'user6', 'pass123', 'USER'),
(8, 'user7', 'pass123', 'USER'),
(9, 'user8', 'pass123', 'INACTIVE'),
(10, 'user9', 'pass123', 'USER');

-- =====================================
-- pdf追加
-- =====================================
INSERT INTO pdf (title) VALUES
('SQL基礎'),
('データベース設計'),
('Spring Boot基礎'),
('React基礎');

-- =====================================
-- questions
-- pdf1(Java基礎)
-- =====================================
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(1, 'クラスとは何か？', 'オブジェクトの設計図'),
(1, '継承とは何か？', '既存クラスを引き継ぐ仕組み'),
(1, 'ポリモーフィズムとは何か？', '同じ操作で異なる振る舞い');

-- pdf2(SQL基礎)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(2, 'SELECT文の役割は？', 'データ取得'),
(2, 'WHERE句の役割は？', '条件指定'),
(2, 'ORDER BY句の役割は？', '並び替え');

-- pdf3(DB設計)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(3, '主キーとは？', '行を一意に識別するキー'),
(3, '外部キーとは？', '他テーブルを参照するキー'),
(3, '正規化とは？', 'データ重複を減らすこと');

-- pdf4(Spring Boot)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(4, 'Controllerの役割は？', 'リクエスト処理'),
(4, 'Serviceの役割は？', '業務ロジック'),
(4, 'Repositoryの役割は？', 'DBアクセス');

-- pdf5(React)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(5, 'Componentとは？', 'UI部品'),
(5, 'Stateとは？', '状態管理'),
(5, 'Propsとは？', '親から渡される値');

-- =====================================
-- answers
-- 各問題5件ずつ
-- =====================================

INSERT INTO answers (user_id, question_id, answer_content, submitted_at)
SELECT
((q.question_id + s.n) % 9) + 2,
q.question_id,
'回答サンプル Question=' || q.question_id || ' User=' || (((q.question_id + s.n) % 9) + 2),
NOW() - (s.n || ' days')::INTERVAL
FROM questions q
CROSS JOIN (
SELECT 1 AS n
UNION SELECT 2
UNION SELECT 3
UNION SELECT 4
UNION SELECT 5
) s;
