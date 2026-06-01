-- =====================================
-- users�ǉ�
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
-- pdf�ǉ�
-- =====================================
INSERT INTO pdf (title) VALUES
('SQL��b'),
('�f�[�^�x�[�X�݌v'),
('Spring Boot��b'),
('React��b');

-- =====================================
-- questions
-- pdf1(Java��b)
-- =====================================
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(1, '�N���X�Ƃ͉����H', '�I�u�W�F�N�g�̐݌v�}'),
(1, '�p���Ƃ͉����H', '�����N���X�������p���d�g��'),
(1, '�|�����[�t�B�Y���Ƃ͉����H', '��������ňقȂ�U�镑��');

-- pdf2(SQL��b)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(2, 'SELECT���̖����́H', '�f�[�^�擾'),
(2, 'WHERE��̖����́H', '�����w��'),
(2, 'ORDER BY��̖����́H', '���ёւ�');

-- pdf3(DB�݌v)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(3, '��L�[�Ƃ́H', '�s����ӂɎ��ʂ���L�['),
(3, '�O���L�[�Ƃ́H', '���e�[�u�����Q�Ƃ���L�['),
(3, '���K���Ƃ́H', '�f�[�^�d�������炷����');

-- pdf4(Spring Boot)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(4, 'Controller�̖����́H', '���N�G�X�g����'),
(4, 'Service�̖����́H', '�Ɩ����W�b�N'),
(4, 'Repository�̖����́H', 'DB�A�N�Z�X');

-- pdf5(React)
INSERT INTO questions (pdf_id, question_text, correct_answer) VALUES
(5, 'Component�Ƃ́H', 'UI���i'),
(5, 'State�Ƃ́H', '��ԊǗ�'),
(5, 'Props�Ƃ́H', '�e����n�����l');

-- =====================================
-- answers
-- �e���5������
-- =====================================

INSERT INTO answers (user_id, question_id, answer_content, submitted_at)
SELECT
((q.question_id + s.n) % 9) + 2,
q.question_id,
'�񓚃T���v�� Question=' || q.question_id || ' User=' || (((q.question_id + s.n) % 9) + 2),
NOW() - (s.n || ' days')::INTERVAL
FROM questions q
CROSS JOIN (
SELECT 1 AS n
UNION SELECT 2
UNION SELECT 3
UNION SELECT 4
UNION SELECT 5
) s;
