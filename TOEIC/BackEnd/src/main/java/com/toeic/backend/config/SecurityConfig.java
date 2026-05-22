package com.toeic.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                // CORS
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                .authorizeHttpRequests(auth -> auth

                                                // uploads
                                                .requestMatchers("/uploads/**").permitAll()

                                                // Swagger
                                                .requestMatchers(
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs",
                                                                "/swagger-resources/**",
                                                                "/webjars/**")
                                                .permitAll()

                                                // API
                                                .requestMatchers("/api/**").permitAll()

                                                .anyRequest().authenticated())

                                .formLogin(f -> f.disable())
                                .httpBasic(b -> b.disable());

                return http.build();
        }

        // ================= CORS =================
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOriginPatterns(List.of(
                                "http://localhost:5173",
                                "http://localhost:5174"));

                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of("*"));

                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return source;
        }
}