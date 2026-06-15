package com.example.demo.service;

import com.example.demo.dto.theme.ThemeRequest;
import com.example.demo.dto.theme.ThemeResponse;
import com.example.demo.entity.Pdf;
import com.example.demo.entity.enums.ContentsStatus;
import com.example.demo.exception.BusinessException;
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
    // 管理者：全取得
    // =========================================
    @Transactional
    public List<ThemeResponse> getAllThemesForAdmin() {
        List<Pdf> all = refreshStatuses();
        return all.stream().map(this::toResponse).toList();
    }

    // =========================================
    // 一般ユーザー：公開のみ
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

    // =========================================
    // ステータス更新（内部統一）
    // =========================================
    private List<Pdf> refreshStatuses() {
        List<Pdf> all = pdfRepository.findAll();
        boolean needsUpdate = false;

        for (Pdf pdf : all) {

            ContentsStatus correct = StatusCalculator.calculateStatus(
                    pdf.getStatus(),
                    pdf.getOpenAt(),
                    pdf.getCloseAt());

            if (correct != pdf.getStatus()) {
                pdf.setStatus(correct);
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            pdfRepository.saveAll(all);
        }

        return all;
    }

    // =========================================
    // 作成
    // =========================================
    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {

        Pdf pdf = new Pdf();
        pdf.setTitle(request.getTitle());
        pdf.setFilePath(request.getFileUrl());
        pdf.setOpenAt(request.getOpenAt());
        pdf.setCloseAt(request.getCloseAt());

        pdf.setStatus(
                StatusCalculator.calculateStatus(
                        ContentsStatus.valueOf(request.getStatus().toUpperCase()),
                        request.getOpenAt(),
                        request.getCloseAt()));

        return toResponse(pdfRepository.save(pdf));
    }

    // =========================================
    // 更新
    // =========================================
    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {

        Pdf pdf = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        pdf.setTitle(updated.getTitle());
        pdf.setFilePath(updated.getFileUrl());
        pdf.setOpenAt(updated.getOpenAt());
        pdf.setCloseAt(updated.getCloseAt());

        pdf.setStatus(
                StatusCalculator.calculateStatus(
                        ContentsStatus.valueOf(updated.getStatus().toUpperCase()),
                        updated.getOpenAt(),
                        updated.getCloseAt()));

        return toResponse(pdfRepository.save(pdf));
    }

    // =========================================
    // ステータス更新（管理者）
    // =========================================
    @Transactional
    public ThemeResponse updateStatus(Integer id, String status) {

        Pdf pdf = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        pdf.setStatus(ContentsStatus.valueOf(status.toUpperCase()));

        return toResponse(pdfRepository.save(pdf));
    }

    // =========================================
    // 公開判定
    // =========================================
    private boolean isPublic(Pdf pdf, LocalDateTime now) {

        if (pdf.getStatus() == null)
            return false;

        if (pdf.getStatus() == ContentsStatus.DRAFT)
            return false;
        if (pdf.getStatus() == ContentsStatus.CLOSED)
            return false;

        if (pdf.getOpenAt() != null && pdf.getOpenAt().isAfter(now))
            return false;

        if (pdf.getCloseAt() != null && pdf.getCloseAt().isBefore(now))
            return false;

        return true;
    }

    // =========================================
    // DTO変換
    // =========================================
    private ThemeResponse toResponse(Pdf pdf) {

        ThemeResponse res = new ThemeResponse();
        res.setPdfId(pdf.getPdfId());
        res.setTitle(pdf.getTitle());
        res.setFileUrl(pdf.getFilePath());
        res.setStatus(pdf.getStatus());
        res.setOpenAt(pdf.getOpenAt());
        res.setCloseAt(pdf.getCloseAt());

        return res;
    }

    // =========================================
    // 削除
    // =========================================
    @Transactional
    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }
}