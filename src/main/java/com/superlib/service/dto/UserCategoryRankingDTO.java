package com.superlib.service.dto;

import com.superlib.domain.Category;

public class UserCategoryRankingDTO {

    private Category category;
    private Long points;
    private Integer books;

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
}
