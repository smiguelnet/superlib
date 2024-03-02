package com.superlib.service;

import com.superlib.domain.Book;

public class GamificationService {

    private static final int POINTS_PER_BOOK = 1;
    private static final int PAGES_TO_UNLOCK_EXTRA_POINTS = 100;

    public static long calculatePoints(Book book) {
        if (book.getPages() == null) {
            return POINTS_PER_BOOK;
        }

        int totalPages = book.getPages();

        if (totalPages < PAGES_TO_UNLOCK_EXTRA_POINTS) {
            return POINTS_PER_BOOK;
        }

        return Math.round(book.getPages() / PAGES_TO_UNLOCK_EXTRA_POINTS) + POINTS_PER_BOOK;
    }
}
