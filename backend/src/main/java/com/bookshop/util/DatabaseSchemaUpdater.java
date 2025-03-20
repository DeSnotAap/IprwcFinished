package com.bookshop.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.core.annotation.Order;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * This utility class executes the schema-update.sql script to update the database schema
 * It runs automatically when the application starts
 */
@Component
@Order(1)
public class DatabaseSchemaUpdater implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseSchemaUpdater(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        executeSchemaUpdate();
    }

    private void executeSchemaUpdate() {
        try {
            // Load SQL script from classpath
            ClassPathResource resource = new ClassPathResource("schema-update.sql");
            String sql = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Split the SQL script into individual statements
            String[] statements = sql.split(";");
            
            // Execute each statement
            for (String statement : statements) {
                if (!statement.trim().isEmpty()) {
                    System.out.println("Executing SQL: " + statement);
                    jdbcTemplate.execute(statement.trim());
                }
            }
            
            System.out.println("Database schema updated successfully");
        } catch (IOException e) {
            System.err.println("Error reading schema-update.sql: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error executing schema update script: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 