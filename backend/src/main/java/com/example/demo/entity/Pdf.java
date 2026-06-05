package com.example.demo.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pdf")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pdf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pdfId;

    @Column(nullable = false, length = 25)
    private String title;

    @OneToMany(mappedBy = "pdf", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;
}