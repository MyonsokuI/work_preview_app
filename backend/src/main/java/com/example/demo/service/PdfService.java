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

    @Transactional(readOnly = true)
    public List<ThemeResponse> getAllThemes() {
        return pdfRepository.findAll()
                .stream()
                .map(pdf -> {
                    ThemeResponse res = new ThemeResponse();
                    res.setPdfId(pdf.getPdfId());
                    res.setTitle(pdf.getTitle());
                    // 💡 新しいステータス情報をDTOに詰め替えてフロントに返すにゃ
                    res.setStatus(pdf.getStatus());
                    res.setOpenAt(pdf.getOpenAt());
                    res.setCloseAt(pdf.getCloseAt());
                    return res;
                })
                .toList();
    }

    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {
        Pdf pdf = new Pdf();
        pdf.setTitle(request.getTitle());
        pdf.setOpenAt(request.getOpenAt());
        pdf.setCloseAt(request.getCloseAt());

        // 💡 登録時のステータス決定ロジック
        if ("draft".equalsIgnoreCase(request.getStatus())) {
            pdf.setStatus("draft");
        } else {
            // 公開(published)が選ばれた場合、公開予約時間(openAt)をチェックするにゃ
            LocalDateTime now = LocalDateTime.now();
            if (request.getOpenAt() != null && request.getOpenAt().isAfter(now)) {
                // 公開設定時間が未来なら 'scheduled' 状態にするにゃ
                pdf.setStatus("scheduled");
            } else {
                // 時間指定がない、もしくは過去の時間なら即時公開 'published' にゃ
                pdf.setStatus("published");
            }
        }

        Pdf saved = pdfRepository.save(pdf);

        ThemeResponse response = new ThemeResponse();
        response.setPdfId(saved.getPdfId());
        response.setTitle(saved.getTitle());
        response.setStatus(saved.getStatus());
        response.setOpenAt(saved.getOpenAt());
        response.setCloseAt(saved.getCloseAt());

        return response;
    }

    @Transactional
    public ThemeResponse updateTheme(Integer id, ThemeRequest updated) {
        Pdf existing = pdfRepository.findById(id)
                .orElseThrow(() -> new BusinessException("テーマが見つかりません"));

        existing.setTitle(updated.getTitle());
        existing.setOpenAt(updated.getOpenAt());
        existing.setCloseAt(updated.getCloseAt());

        // 💡 更新時のステータス決定ロジック
        if ("draft".equalsIgnoreCase(updated.getStatus())) {
            existing.setStatus("draft");
        } else {
            LocalDateTime now = LocalDateTime.now();

            // すでにクローズ時間を過ぎている、または手動でクローズ状態にしたい場合などのケア
            if (updated.getCloseAt() != null && updated.getCloseAt().isBefore(now)) {
                existing.setStatus("closed");
            } else if (updated.getOpenAt() != null && updated.getOpenAt().isAfter(now)) {
                // 未来の公開時間が設定されたら再度 'scheduled' に戻すにゃ
                existing.setStatus("scheduled");
            } else {
                // それ以外はすべて公開中 'published' にゃ
                existing.setStatus("published");
            }
        }

        Pdf saved = pdfRepository.save(existing);

        ThemeResponse response = new ThemeResponse();
        response.setPdfId(saved.getPdfId());
        response.setTitle(saved.getTitle());
        response.setStatus(saved.getStatus());
        response.setOpenAt(saved.getOpenAt());
        response.setCloseAt(saved.getCloseAt());

        return response;
    }

    @Transactional
    public void deleteTheme(Integer id) {
        pdfRepository.deleteById(id);
    }
}