package com.superlib.service.dto;

import java.util.Map;

public class UserRankingDTO {

    private String userName;
    private String email;
    private Long points;

    private Map<Long, Long> categories;

    // TODO: for demonstration purposes only this KPIs has been calculated on frontend
    //private Integer trophies;

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

    public Map<Long, Long> getCategories() {
        return categories;
    }

    public void setCategories(Map<Long, Long> categories) {
        this.categories = categories;
    }
}
