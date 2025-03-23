package com.bookshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import javax.annotation.PostConstruct;

@SpringBootApplication
public class BookShopApplication {
 
    @Autowired
    private Environment environment;
    
    @PostConstruct
    public void showDatabaseInfo() {
        String dbUrl = environment.getProperty("spring.datasource.url");
        System.out.println("Database URL: " + dbUrl);
        
        // Get the raw Railway URL
        String railwayUrl = System.getenv("Postgres.DATABASE_URL");
        System.out.println("Railway Database URL: " + railwayUrl);

    }

    public static void main(String[] args) {
        SpringApplication.run(BookShopApplication.class, args);
    }
} 
