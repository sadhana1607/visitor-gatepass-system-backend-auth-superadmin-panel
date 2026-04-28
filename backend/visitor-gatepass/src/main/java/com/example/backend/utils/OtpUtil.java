package com.example.backend.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpUtil{

    // SecureRandom is better than Random (more secure OTP generation)
    private static final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate 6-digit OTP
     * @return String OTP
     */
    public String generateOtp() {

        int otp = 100000 + secureRandom.nextInt(900000);

        return String.valueOf(otp);
    }
}