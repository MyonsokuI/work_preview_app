package com.example.demo.repository;

import com.example.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // 回答IDからレビュー一覧取得
    List<Review> findByAnswer_AnswerId(Integer answerId);

    // レビューしたユーザーのレビュー一覧取得
    List<Review> findByReviewer_UserId(Integer reviewerId);

    // 最新レビュー取得
    java.util.Optional<Review> findFirstByAnswer_AnswerIdOrderByCreatedAtDesc(Integer answerId);
}