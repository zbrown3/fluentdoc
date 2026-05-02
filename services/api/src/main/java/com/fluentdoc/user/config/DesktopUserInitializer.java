package com.fluentdoc.user.config;

import com.fluentdoc.user.service.UserService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DesktopUserInitializer {

    private final UserService userService;

    public DesktopUserInitializer(UserService userService) {
        this.userService = userService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void ensureDesktopUserExists() {
        userService.ensureDesktopLocalUser();
    }
}
