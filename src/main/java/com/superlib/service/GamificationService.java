package com.superlib.service;

import com.superlib.domain.Book;
import com.superlib.domain.Category;
import com.superlib.domain.History;
import com.superlib.domain.User;
import com.superlib.service.dto.UserCategoryRankingDTO;
import com.superlib.service.dto.UserRankingDTO;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public static List<UserRankingDTO> getUserRanking(List<History> events, List<User> users) {
        List<UserRankingDTO> usersRanking = new ArrayList<>();

        for (User user : users) {
            // USER EVENTS
            List<History> historyUser = events.stream().filter(e -> e.getUser().getId().equals(user.getId())).collect(Collectors.toList());
            if (historyUser != null) {
                UserRankingDTO userRanking = new UserRankingDTO();
                userRanking.setUserId(user.getId());
                userRanking.setUserName(user.getFirstName());
                userRanking.setEmail(user.getEmail());

                // TOTAL POINTS
                long totalPoints = historyUser.stream().mapToLong(e -> e.getPoints()).sum();
                userRanking.setPoints(totalPoints);

                int totalBooks = historyUser.stream().map(e -> e.getBook().getId()).collect(Collectors.toSet()).size();
                userRanking.setBooks(totalBooks);

                // CATEGORIES
                List<UserCategoryRankingDTO> categories = new ArrayList<>();

                for (History item : historyUser) {
                    if (item.getBook() != null) {
                        Category category = item.getBook().getCategory();
                        int totalCategoryBooks = 1;
                        long totalCategoryPoints = item.getPoints();

                        Optional<UserCategoryRankingDTO> existingCategory = categories
                            .stream()
                            .filter(e -> e.getCategory().getId() == category.getId())
                            .findAny();

                        if (existingCategory.isPresent()) {
                            // UPDATE
                            existingCategory.ifPresent(e -> {
                                e.setPoints(e.getPoints() + item.getPoints());
                                e.setBooks(e.getBooks() + 1);
                            });
                        } else {
                            // ADD
                            UserCategoryRankingDTO userCategoryRanking = new UserCategoryRankingDTO();
                            userCategoryRanking.setCategory(category);
                            userCategoryRanking.setBooks(totalCategoryBooks);
                            userCategoryRanking.setPoints(totalCategoryPoints);
                            categories.add(userCategoryRanking);
                        }
                    }
                }
                userRanking.setCategories(categories);
                // COL
                usersRanking.add(userRanking);
            }
        }
        usersRanking.sort(Comparator.comparing(UserRankingDTO::getPoints, Comparator.reverseOrder()));

        return usersRanking;
    }
}
