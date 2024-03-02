package com.superlib.service.dto;

import java.util.List;

public class UserRankingDTO {

    private Long userId;
    private String userName;
    private String email;
    private Long points;
    private Integer books;

    private List<UserCategoryRankingDTO> categories;

    // TODO: for demonstration purposes only this KPIs has been calculated on frontend

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public List<UserCategoryRankingDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<UserCategoryRankingDTO> categories) {
        this.categories = categories;
    }
}
