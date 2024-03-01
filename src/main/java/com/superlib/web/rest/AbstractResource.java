package com.superlib.web.rest;

import com.superlib.domain.User;
import com.superlib.service.UserService;
import com.superlib.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AbstractResource {

    private final Logger log = LoggerFactory.getLogger(AbstractResource.class);

    protected UserService userService;

    public AbstractResource(UserService userService) {
        this.userService = userService;
    }

    protected User validateLoggedUser(String operation, String entityName) throws BadRequestAlertException {
        return userService
            .getUserWithAuthorities()
            .orElseThrow(() ->
                new BadRequestAlertException(
                    "Operation" + operation + "failed because current logged-in user was not found",
                    entityName,
                    operation + "_FAILED"
                )
            );
    }
}
