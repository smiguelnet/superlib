package com.superlib.repository;

import com.superlib.domain.Book;
import com.superlib.domain.History;
import com.superlib.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the History entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByUserAndBook(User user, Book book);
}
