package com.example.demo.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.example.demo.entity.enums.Role;
import com.example.demo.entity.enums.UserStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "名前は必須です")
    @Size(min = 1, max = 20, message = "名前は1文字以上20文字以内で入力してください")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "パスワードは必須です")
    @Size(min = 1, max = 12, message = "パスワードは1桁以上12桁以下で入力してください")
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private UserStatus status; // ACTIVE, INACTIVE, SUSPENDED

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private Role roles;

    @CreatedDate
    @Column(name = "created_at") // ★追加：ER図の新しい列
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at") // ★追加：ER図の新しい列
    private LocalDateTime updatedAt;
}