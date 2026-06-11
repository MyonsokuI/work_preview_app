package com.example.demo.dto.review;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewResponse {

    private Integer reviewId;

    private Integer answerId;

    private Integer reviewerId;

    private String reviewerName;

    private String comment;

    private LocalDateTime createdAt;
}