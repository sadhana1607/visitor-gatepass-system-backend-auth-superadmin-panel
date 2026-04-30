package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VisitorGatepassApplication {

    public static void main(String[] args) {
        SpringApplication.run(VisitorGatepassApplication.class, args);
    }

}
