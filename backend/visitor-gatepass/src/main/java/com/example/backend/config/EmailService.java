package com.example.backend.config;

import com.example.backend.email.dto.response.EmailResponse;
import com.example.backend.email.model.Email;
import com.example.backend.email.model.EmailStatus;
import com.example.backend.email.repository.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailRepository emailRepository;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Visitor OTP Verification");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }


    public void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Async   // ✅ HERE
    public void sendOrgCreatedMail(String toEmail, String orgName, String orgEmail, String orgPhone) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Organization Registered");

        message.setText(
                "A new organization has been created:\n\n" +
                        "Name: " + orgName + "\n" +
                        "Email: " + orgEmail + "\n" +
                        "Phone: " + orgPhone + "\n\n" +
                        "Please review and approve."
        );

        mailSender.send(message);
    }

    // ================= GET LOGGED-IN USER =================
    private String getLoggedInUserEmail() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }

        return auth.getName();
    }

    // ================= SEND EMAIL + SAVE =================
    public void sendAndStoreEmail(String from, String to, String subject, String body) {

        // 1. Send email via SMTP
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        // 2. Save in DB (for inbox feature)
        Email email = new Email();
        email.setFromEmail(from);
        email.setToEmail(to);
        email.setSubject(subject);
        email.setMessage(body);
        email.setStatus(EmailStatus.valueOf("SENT"));

        emailRepository.save(email);
    }
    // ================= INBOX =================
    public List<EmailResponse> getMyInbox() {

        String userEmail = getLoggedInUserEmail();

        return emailRepository.findByToEmail(userEmail)
                .stream()
                .map(email -> EmailResponse.builder()
                        .id(email.getId())
                        .fromEmail(email.getFromEmail())   // ✅ FIXED
                        .toEmail(email.getToEmail())
                        .subject(email.getSubject())
                        .message(email.getMessage())
                        .sentAt(email.getSentAt())
                        .build()
                )
                .toList();
    }
}