package com.fluentdoc.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class LocalStorageWebConfig implements WebMvcConfigurer {

    private final String uploadDir = Paths.get(System.getProperty("user.home"), ".fluentdoc", "uploads")
            .toUri().toString();

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/local-files/**")
                .addResourceLocations(uploadDir);
    }
}
