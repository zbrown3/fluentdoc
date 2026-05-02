package com.fluentdoc.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsWebConfig implements WebMvcConfigurer {

    @Value("${ORIGIN_URL}")
    private String clientOriginUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> origins = new ArrayList<>();
        if (clientOriginUrl != null && !clientOriginUrl.isBlank()) {
            origins.add(clientOriginUrl);
        }
        if (!origins.contains("http://localhost:4200")) {
            origins.add("http://localhost:4200");
        }
        if (!origins.contains("http://127.0.0.1:4200")) {
            origins.add("http://127.0.0.1:4200");
        }
        registry.addMapping("/**")
                .allowedOrigins(origins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
