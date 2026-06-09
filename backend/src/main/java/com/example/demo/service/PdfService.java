package com.example.demo.service;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.entity.Pdf;
import com.example.demo.repository.PdfRepository;
import com.example.demo.exception.BusinessException;
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
    // 🔥 一般ユーザー：公開テーマのみ取得
    // =========================================
    @Transactional(readOnly = true)
    public List<ThemeResponse> getAllThemes() {

        LocalDateTime now = LocalDateTime.now();

        return pdfRepository.findAll()
                .stream()
                // 🔥 公開制御フィルタ（最重要）
                .filter(pdf -> isPublic(pdf, now))
                .map(this::toResponse)
                .toList();
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

        // 🔥 ステータス決定
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            pdf.setStatus("draft");
        } else {
            LocalDateTime now = LocalDateTime.now();

            if (request.getOpenAt() != null && request.getOpenAt().isAfter(now)) {
                pdf.setStatus("scheduled");
            } else {
                pdf.setStatus("published");
            }
        }

        Pdf saved = pdfRepository.save(pdf);
        return toResponse(saved);
    }

    // =========================================
    // 🔥 テーマ更新
    // =========================================
    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {

        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());
        existing.setOpenAt(updated.getOpenAt());
        existing.setCloseAt(updated.getCloseAt());

        if ("draft".equalsIgnoreCase(updated.getStatus())) {
            existing.setStatus("draft");
        } else {
            LocalDateTime now = LocalDateTime.now();

            if (updated.getCloseAt() != null && updated.getCloseAt().isBefore(now)) {
                existing.setStatus("closed");
            } else if (updated.getOpenAt() != null && updated.getOpenAt().isAfter(now)) {
                existing.setStatus("scheduled");
            } else {
                existing.setStatus("published");
            }
        }

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