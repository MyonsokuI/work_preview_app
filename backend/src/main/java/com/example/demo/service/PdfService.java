package com.example.demo.service;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.entity.Pdf;
import com.example.demo.repository.PdfRepository;
import com.example.demo.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PdfService {

    private final PdfRepository pdfRepository;

    public PdfService(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    @Transactional(readOnly = true)
    public List<ThemeResponse> getAllThemes() {

        return pdfRepository.findAll()
                .stream()
                .map(pdf -> {
                    ThemeResponse res = new ThemeResponse();
                    res.setPdfId(pdf.getPdfId());
                    res.setTitle(pdf.getTitle());
                    return res;
                })
                .toList();
    }

    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {

        Pdf pdf = new Pdf();
        pdf.setTitle(request.getTitle());

        Pdf saved = pdfRepository.save(pdf);

        ThemeResponse response = new ThemeResponse();
        response.setPdfId(saved.getPdfId());
        response.setTitle(saved.getTitle());

        return response;
    }
    
    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {

        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());

        Pdf saved = pdfRepository.save(existing);

        ThemeResponse response = new ThemeResponse();
        response.setPdfId(saved.getPdfId());
        response.setTitle(saved.getTitle());

        return response;
    }

    @Transactional
    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }
}