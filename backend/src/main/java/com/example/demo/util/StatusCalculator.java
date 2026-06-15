package com.example.demo.util;

import com.example.demo.entity.enums.ContentsStatus;
import java.time.LocalDateTime;

public class StatusCalculator {

    public static ContentsStatus calculateStatus(
            ContentsStatus status,
            LocalDateTime openAt,
            LocalDateTime closeAt
    ) {

        LocalDateTime now = LocalDateTime.now();

        if (openAt != null && openAt.isAfter(now)) {
            return ContentsStatus.SCHEDULED;
        }

        if (closeAt != null && closeAt.isBefore(now)) {
            return ContentsStatus.CLOSED;
        }

        if (status == ContentsStatus.DRAFT) {
            return ContentsStatus.DRAFT;
        }

        return ContentsStatus.PUBLISHED;
    }
}