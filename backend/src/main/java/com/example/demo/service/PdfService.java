package com.example.demo.service;

import com.example.demo.entity.Pdf;
import com.example.demo.repository.PdfRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PdfService {

    private final PdfRepository pdfRepository;

    public PdfService(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    public List<Pdf> getAllThemes() {
        return pdfRepository.findAll();
    }

    public Pdf createTheme(Pdf pdf) {
        return pdfRepository.save(pdf);
    }

    public Pdf updateTheme(Integer id, Pdf updated) {

        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());

        return pdfRepository.save(existing);
    }

    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }
}