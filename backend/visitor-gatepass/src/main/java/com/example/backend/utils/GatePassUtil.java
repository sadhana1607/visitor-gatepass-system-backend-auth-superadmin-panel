package com.example.backend.utils;

import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.UUID;

@Component
public class GatePassUtil {

    public String generateGatePass() {
        return "GP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public String generateOTP() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}