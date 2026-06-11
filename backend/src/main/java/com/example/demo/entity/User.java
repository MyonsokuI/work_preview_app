package com.example.demo.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@EntityListeners(org.springframework.data.jpa.domain.support.AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    private String status; // active / inactive / admin など

    @Column(length = 20)
    private String roles;

    @CreatedDate
    @Column(name = "created_at") // ★追加：ER図の新しい列にゃ
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at") // ★追加：ER図の新しい列にゃ
    private LocalDateTime updatedAt;
}