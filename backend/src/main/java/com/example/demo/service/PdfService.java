package com.example.demo.service;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.exception.BusinessException;
import com.example.demo.entity.Pdf;
import com.example.demo.repository.PdfRepository;
import com.example.demo.util.StatusCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PdfService {

    private final PdfRepository pdfRepository;

    public PdfService(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    // =========================================
    // 🔥 管理者：全テーマ取得
    // =========================================
    @Transactional
    public List<ThemeResponse> getAllThemesForAdmin() {
        List<Pdf> all = refreshStatuses();
        return all.stream().map(this::toResponse).toList();
    }

    // =========================================
    // 🔥 一般ユーザー：公開テーマのみ取得
    // =========================================
    @Transactional
    public List<ThemeResponse> getPublicThemes() {
        List<Pdf> all = refreshStatuses();
        LocalDateTime now = LocalDateTime.now();

        return all.stream()
                .filter(pdf -> isPublic(pdf, now))
                .map(this::toResponse)
                .toList();
    }

    private List<Pdf> refreshStatuses() {
        List<Pdf> all = pdfRepository.findAll();
        boolean needsUpdate = false;

        for (Pdf pdf : all) {
            String correctStatus = StatusCalculator.calculateStatus(
                    pdf.getStatus(), pdf.getOpenAt(), pdf.getCloseAt());
            if (!correctStatus.equals(pdf.getStatus())) {
                pdf.setStatus(correctStatus);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            pdfRepository.saveAll(all);
        }

        return all;
    }

    // =========================================
    // 🔥 テーマ作成
    // =========================================
    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {

        Pdf pdf = new Pdf();
        pdf.setTitle(request.getTitle());
        pdf.setOpenAt(request.getOpenAt());
        pdf.setCloseAt(request.getCloseAt());
        pdf.setStatus(StatusCalculator.calculateStatus(request.getStatus(), request.getOpenAt(), request.getCloseAt()));

        Pdf saved = pdfRepository.save(pdf);
        return toResponse(saved);
    }

    // =========================================
    // 🔥 テーマ更新
    // =========================================
    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {

        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());
        existing.setOpenAt(updated.getOpenAt());
        existing.setCloseAt(updated.getCloseAt());
        existing.setStatus(
                StatusCalculator.calculateStatus(updated.getStatus(), updated.getOpenAt(), updated.getCloseAt()));

        Pdf saved = pdfRepository.save(existing);
        return toResponse(saved);
    }

    // =========================================
    // 🔥 管理者：ステータス更新
    // =========================================
    @Transactional
    public ThemeResponse updateStatus(Integer id, String status) {

        Pdf pdf = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        pdf.setStatus(status);

        Pdf saved = pdfRepository.save(pdf);
        return toResponse(saved);
    }

    // =========================================
    // 🔥 削除
    // =========================================
    @Transactional
    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }

    // =========================================
    // 🔥 公開判定ロジック（超重要）
    // =========================================
    private boolean isPublic(Pdf pdf, LocalDateTime now) {

        if (pdf.getStatus() == null) return false;

        // 非公開系
        if ("draft".equals(pdf.getStatus())) return false;
        if ("closed".equals(pdf.getStatus())) return false;

        // 公開前
        if (pdf.getOpenAt() != null && pdf.getOpenAt().isAfter(now)) {
            return false;
        }

        // 公開終了
        if (pdf.getCloseAt() != null && pdf.getCloseAt().isBefore(now)) {
            return false;
        }

        return true;
    }

    // =========================================
    // 🔥 DTO変換
    // =========================================
    private ThemeResponse toResponse(Pdf pdf) {

        ThemeResponse res = new ThemeResponse();
        res.setPdfId(pdf.getPdfId());
        res.setTitle(pdf.getTitle());
        res.setStatus(pdf.getStatus());
        res.setOpenAt(pdf.getOpenAt());
        res.setCloseAt(pdf.getCloseAt());

        return res;
    }
}
