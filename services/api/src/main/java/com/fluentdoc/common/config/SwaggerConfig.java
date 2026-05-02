package com.fluentdoc.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${ORIGIN_URL}")
    private String clientOriginUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url(clientOriginUrl))
                .info(
                        new Info()
                                .title("FluentDoc Service")
                                .description("FluentDoc Service API")
                                .contact(
                                        new io.swagger.v3.oas.models.info.Contact()
                                                .email("patrick.e.gaston@gmail.com"))
                                .version("0.0.1")
                );
    }
}
