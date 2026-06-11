package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.review.ReviewRequest;
import com.example.demo.dto.review.ReviewResponse;
import com.example.demo.entity.Answer;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.repository.AnswerRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

        private final ReviewRepository reviewRepository;
        private final AnswerRepository answerRepository;
        private final UserRepository userRepository;

        /**
         * レビュー登録
         */
        public ReviewResponse createReview(
                        Integer reviewerId,
                        ReviewRequest request) {

                Answer answer = answerRepository.findById(request.getAnswerId())
                                .orElseThrow(() -> new RuntimeException("回答が存在しません"));

                User reviewer = userRepository.findById(reviewerId)
                                .orElseThrow(() -> new RuntimeException("ユーザーが存在しません"));

                Review review = new Review();

                review.setAnswer(answer);
                review.setReviewer(reviewer);
                review.setComment(request.getComment());

                return toResponse(reviewRepository.save(review));
        }

        /**
         * 回答ごとのレビュー一覧
         */
        @Transactional(readOnly = true)
        public List<ReviewResponse> getReviewsByAnswer(Integer answerId) {

                return reviewRepository.findByAnswer_AnswerId(answerId)
                                .stream()
                                .map(this::toResponse)
                                .toList();
        }

        public void deleteReview(Integer reviewId) {
                reviewRepository.deleteById(reviewId);
        }

        /**
         * Entity → Response変換
         */
        private ReviewResponse toResponse(Review review) {

                ReviewResponse response = new ReviewResponse();

                response.setReviewId(review.getReviewId());
                response.setAnswerId(review.getAnswer().getAnswerId());
                response.setReviewerId(review.getReviewer().getUserId());
                response.setReviewerName(review.getReviewer().getName());
                response.setComment(review.getComment());
                response.setCreatedAt(review.getCreatedAt());

                return response;
        }
}