package com.example.demo.service;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.entity.Pdf;
import com.example.demo.repository.PdfRepository;
import com.example.demo.util.StatusCalculator; // 💡 作成した共通クラスをインポート
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PdfService {

    private final PdfRepository pdfRepository;

    public PdfService(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    // 💡 取得時にステータスを評価・自動更新する
    @Transactional
    public List<ThemeResponse> getAllThemes() {
        List<Pdf> all = pdfRepository.findAll();
        boolean needsUpdate = false;

        for (Pdf pdf : all) {
            String correctStatus = StatusCalculator.calculateStatus(pdf.getStatus(), pdf.getOpenAt(), pdf.getCloseAt());
            if (!correctStatus.equals(pdf.getStatus())) {
                pdf.setStatus(correctStatus);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            pdfRepository.saveAll(all);
        }

        return all.stream().map(this::convertToResponse).toList();
    }

    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {
        Pdf pdf = new Pdf();
        pdf.setTitle(request.getTitle());
        pdf.setOpenAt(request.getOpenAt());
        pdf.setCloseAt(request.getCloseAt());
        // 新規作成時も共通ロジックでステータスを決定
        pdf.setStatus(StatusCalculator.calculateStatus(request.getStatus(), request.getOpenAt(), request.getCloseAt()));

        Pdf saved = pdfRepository.save(pdf);
        return convertToResponse(saved);
    }

    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {
        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());
        existing.setOpenAt(updated.getOpenAt());
        existing.setCloseAt(updated.getCloseAt());
        // 更新時も共通ロジックで再計算
        existing.setStatus(
                StatusCalculator.calculateStatus(updated.getStatus(), updated.getOpenAt(), updated.getCloseAt()));

        Pdf saved = pdfRepository.save(existing);
        return convertToResponse(saved);
    }

    // DTOへの変換を共通化
    private ThemeResponse convertToResponse(Pdf pdf) {
        ThemeResponse res = new ThemeResponse();
        res.setPdfId(pdf.getPdfId());
        res.setTitle(pdf.getTitle());
        res.setStatus(pdf.getStatus());
        res.setOpenAt(pdf.getOpenAt());
        res.setCloseAt(pdf.getCloseAt());
        return res;
    }

    @Transactional
    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }
}