package com.superlib.service.dto;

import com.superlib.domain.Category;

public class UserCategoryRankingDTO {

    private Category category;
    private Long points;
    private Integer books;

    private boolean trophy;

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Long getPoints() {
        return points;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public Integer getBooks() {
        return books;
    }

    public void setBooks(Integer books) {
        this.books = books;
    }

    public boolean isTrophy() {
        return trophy;
    }

    public void setTrophy(boolean trophy) {
        this.trophy = trophy;
    }
}
