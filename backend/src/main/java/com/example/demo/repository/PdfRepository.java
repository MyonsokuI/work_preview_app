package com.example.demo.repository;

import com.example.demo.entity.Pdf;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfRepository extends JpaRepository<Pdf, Long> {
}