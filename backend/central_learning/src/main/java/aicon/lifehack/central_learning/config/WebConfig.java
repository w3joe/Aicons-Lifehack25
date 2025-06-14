package aicon.lifehack.central_learning.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")  // Allow CORS for all endpoints
                        .allowedOrigins("*")  // For development: allow all origins; for production, specify your frontend URL here
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");  // Allowed HTTP methods
            }
        };
    }
}
