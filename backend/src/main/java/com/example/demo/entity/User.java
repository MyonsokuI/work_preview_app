package com.example.demo.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.example.demo.entity.enums.Role;
import com.example.demo.entity.enums.UserStatus;

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
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private UserStatus status; // ACTIVE, INACTIVE, SUSPENDED

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Role roles;

    @Column(name = "created_at") // ★追加：ER図の新しい列にゃ
    private LocalDateTime createdAt;

    @Column(name = "updated_at") // ★追加：ER図の新しい列にゃ
    private LocalDateTime updatedAt;
}