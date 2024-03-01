package com.superlib.web.rest;

import com.superlib.domain.Book;
import com.superlib.domain.History;
import com.superlib.domain.User;
import com.superlib.repository.BookRepository;
import com.superlib.repository.CategoryRepository;
import com.superlib.repository.HistoryRepository;
import com.superlib.security.AuthoritiesConstants;
import com.superlib.service.UserService;
import com.superlib.service.dto.BookHistoryDTO;
import com.superlib.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.superlib.domain.History}.
 */
@RestController
@RequestMapping("/api/histories")
//@Transactional
public class HistoryResource extends AbstractResource {

    private final Logger log = LoggerFactory.getLogger(HistoryResource.class);

    private static final String ENTITY_NAME = "history";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoryRepository historyRepository;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public HistoryResource(
        UserService userService,
        HistoryRepository historyRepository,
        BookRepository bookRepository,
        CategoryRepository categoryRepository
    ) {
        super(userService);
        this.historyRepository = historyRepository;
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * {@code POST  /histories} : Create a new history.
     *
     * @param history the history to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new history, or with status {@code 400 (Bad Request)} if the history has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/read")
    public ResponseEntity<History> setBookAsRead(@RequestBody BookHistoryDTO historyEvent) throws URISyntaxException {
        log.debug("REST request to save History : {}", historyEvent);
        if (historyEvent.getBookId() == null) {
            throw new BadRequestAlertException("Livro não informado", ENTITY_NAME, "idnotexists");
        }

        Optional<Book> byId = bookRepository.findById(historyEvent.getBookId());
        if (byId.isEmpty()) {
            throw new BadRequestAlertException("Livro não identificado no sistema", ENTITY_NAME, "idnotexists");
        }

        User user = validateLoggedUser("setBookAsRead", "HistoryEvent");
        History result = null;

        if (historyEvent.isRead()) {
            History history = new History();
            history.setBook(byId.get());
            history.setUser(user);

            history.setPoints(100L); // TODO: calculate it

            history.setCreatedDate(Instant.now());
            history.setCreatedBy(user.getEmail());
            result = historyRepository.save(history);
        } else {
            List<History> byUserAndBook = historyRepository.findByUserAndBook(user, byId.get());
            if (!CollectionUtils.isEmpty(byUserAndBook)) {
                for (History history : byUserAndBook) {
                    Long id = history.getId();
                    if (id != null) {
                        historyRepository.deleteById(id);
                    }
                }
            }
        }

        return ResponseEntity
            .created(new URI("/api/histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /histories} : Create a new history.
     *
     * @param history the history to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new history, or with status {@code 400 (Bad Request)} if the history has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<History> createHistory(@RequestBody History history) throws URISyntaxException {
        log.debug("REST request to save History : {}", history);
        if (history.getId() != null) {
            throw new BadRequestAlertException("A new history cannot already have an ID", ENTITY_NAME, "idexists");
        }
        History result = historyRepository.save(history);
        return ResponseEntity
            .created(new URI("/api/histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /histories/:id} : Updates an existing history.
     *
     * @param id      the id of the history to save.
     * @param history the history to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated history,
     * or with status {@code 400 (Bad Request)} if the history is not valid,
     * or with status {@code 500 (Internal Server Error)} if the history couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<History> updateHistory(@PathVariable(value = "id", required = false) final Long id, @RequestBody History history)
        throws URISyntaxException {
        log.debug("REST request to update History : {}, {}", id, history);
        if (history.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, history.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        History result = historyRepository.save(history);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, history.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /histories/:id} : Partial updates given fields of an existing history, field will ignore if it is null
     *
     * @param id      the id of the history to save.
     * @param history the history to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated history,
     * or with status {@code 400 (Bad Request)} if the history is not valid,
     * or with status {@code 404 (Not Found)} if the history is not found,
     * or with status {@code 500 (Internal Server Error)} if the history couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<History> partialUpdateHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody History history
    ) throws URISyntaxException {
        log.debug("REST request to partial update History partially : {}, {}", id, history);
        if (history.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, history.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // TODO:
        Optional<History> result = historyRepository
            .findById(history.getId())
            .map(existingHistory -> {
                if (history.getPoints() != null) {
                    existingHistory.setPoints(history.getPoints());
                }
                //                if (history.getUser() != null) {
                //                    existingHistory.set);
                //                }
                //                if (history.getRegisteredAt() != null) {
                //                    existingHistory.setRegisteredAt(history.getRegisteredAt());
                //                }
                //                if (history.getRegisteredBy() != null) {
                //                    existingHistory.setRegisteredBy(history.getRegisteredBy());
                //                }

                return existingHistory;
            })
            .map(historyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, history.getId().toString())
        );
    }

    /**
     * {@code GET  /histories} : get all the histories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of histories in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<History> getAllHistories() {
        log.debug("REST request to get all Histories");
        return historyRepository.findAll();
    }

    /**
     * {@code GET  /histories/:id} : get the "id" history.
     *
     * @param id the id of the history to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the history, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<History> getHistory(@PathVariable("id") Long id) {
        log.debug("REST request to get History : {}", id);
        Optional<History> history = historyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(history);
    }

    @GetMapping("/user")
    public List<History> getHistoryByUser() {
        log.debug("REST request to get History");

        User user = validateLoggedUser("setBookAsRead", "HistoryEvent");
        List<History> history = historyRepository.findAll();
        return history.stream().filter(e -> e.getUser().getId().equals(user.getId())).collect(Collectors.toList());
    }

    /**
     * {@code DELETE  /histories/:id} : delete the "id" history.
     *
     * @param id the id of the history to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteHistory(@PathVariable("id") Long id) {
        log.debug("REST request to delete History : {}", id);
        historyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
