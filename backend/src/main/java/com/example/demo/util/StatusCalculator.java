package com.example.demo.util;

import java.time.LocalDateTime;

public class StatusCalculator {
    public static String calculateStatus(String currentStatus, LocalDateTime openAt, LocalDateTime closeAt) {
        if ("draft".equalsIgnoreCase(currentStatus))
            return "draft";

        LocalDateTime now = LocalDateTime.now();
        if (closeAt != null && closeAt.isBefore(now))
            return "closed";
        if (openAt != null && openAt.isAfter(now))
            return "scheduled";

        return "published";
    }
}
