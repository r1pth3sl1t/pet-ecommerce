package com.asf.ecommerce.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RestControllerConfiguration implements WebMvcConfigurer {

    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Value("${allowed.origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(basePath + "/**").allowedOrigins(allowedOrigins);
    }
}
