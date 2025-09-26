package com.example.fundapp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class StartupConfigLogger {
    private static final Logger log = LoggerFactory.getLogger(StartupConfigLogger.class);

    @Bean
    ApplicationRunner logResolvedConfig(Environment env) {
        return args -> {
            String resolvedUri = env.getProperty("spring.data.mongodb.uri");
            String db = env.getProperty("spring.data.mongodb.database");
            boolean hasSpringEnv = env.containsProperty("SPRING_DATA_MONGODB_URI");
            boolean hasMongoDbUriEnv = env.containsProperty("MONGODB_URI");
            String source = hasSpringEnv ? "SPRING_DATA_MONGODB_URI" : (hasMongoDbUriEnv ? "MONGODB_URI" : "DEFAULT");

            if (resolvedUri != null) {
                // Mask credentials if present and extract hosts for safe logging
                String masked = resolvedUri.replaceAll("(//)([^:/@]+):([^@]+)@", "$1****:****@");
                String hostPart = masked;
                // strip scheme and credentials
                hostPart = hostPart.replaceFirst("^mongodb(\\+srv)?:\\/\\/(?:\\*\\*\\*\\*:\\*\\*\\*\\*@)?", "");
                // keep only hosts (before first '/' or '?')
                int slash = hostPart.indexOf('/');
                if (slash >= 0) hostPart = hostPart.substring(0, slash);
                int q = hostPart.indexOf('?');
                if (q >= 0) hostPart = hostPart.substring(0, q);

                log.info("MongoDB config: hosts={}, database={}, source={}", hostPart, db, source);
            } else {
                log.warn("MongoDB config: no spring.data.mongodb.uri resolved; defaulting to localhost:27017 (source={})", source);
            }
        };
    }
}
