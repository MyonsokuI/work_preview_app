// dbdiagram.io系のDBML（制限あり）

Table users {
  user_id serial [pk]
  employee_id int(8) UNIQUE
  name varchar(100)
  password varchar(255)
  status ENUM('active','inactive','suspended')
  roles ENUM('admin','user')
  created_at timestamp
  updated_at timestamp
}

// users → pdfs        : SET NULL
Table pdfs {
  pdf_id serial [pk]
  title varchar(255)
  path varchar
  uploader int [ref: >users.user_id]
  open_at timestamp
  close_at timestamp
  status ENUM('draft','scheduled','published','closed')
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp
}

// pdf → questions : CASCADE
Table questions {
  question_id serial [pk]
  pdf_id int [ref: > pdfs.pdf_id]
  question_text text
  correct_answer text
  open_at timestamp
  close_at timestamp
  status ENUM('draft','scheduled','published','closed')
  created_at timestamp
  updated_at timestamp

  Indexes {
    (pdf_id)
  }
}

// users → answers : SET NULL（設計意図）
// questions → answers　: CASCADE
// ※answers:上書き型
Table answers {
  answer_id serial [pk]
  user_id int [ref: > users.user_id]
  question_id int [ref: > questions.question_id]
  answer_content text
  submitted_at timestamp
  created_at timestamp
  updated_at timestamp
  Indexes {
    (user_id, question_id) [unique]
    (submitted_at)
  }

}

// answers → reviews   : CASCADE
// ※reviews:履歴型
Table reviews {
  review_id serial [pk]
  answer_id int [ref: > answers.answer_id]
  reviewer_id int [ref: > users.user_id]
  comment text
  created_at timestamp

  Indexes {
    (answer_id)
  }
}