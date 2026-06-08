package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.review.ReviewRequest;
import com.example.demo.dto.review.ReviewResponse;
import com.example.demo.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * レビュー登録
     * POST /api/reviews?reviewerId=1
     */
    @PostMapping("/reviews")
    public ReviewResponse createReview(
            @RequestParam Integer reviewerId,
            @RequestBody ReviewRequest request) {

        return reviewService.createReview(reviewerId, request);
    }

    /**
     * 回答ごとのレビュー一覧取得
     * GET /api/answers/{answerId}/reviews
     */
    @GetMapping("/answers/{answerId}/reviews")
    public List<ReviewResponse> getReviewsByAnswer(
            @PathVariable Integer answerId) {

        return reviewService.getReviewsByAnswer(answerId);
    }

    /**
     * レビュー削除
     * DELETE /api/reviews/{reviewId}
     */
    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(
            @PathVariable Integer reviewId) {

        reviewService.deleteReview(reviewId);
    }
}