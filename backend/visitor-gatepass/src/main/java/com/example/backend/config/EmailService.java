package com.example.backend.config;

import com.example.backend.email.dto.response.EmailResponse;
import com.example.backend.email.model.Email;
import com.example.backend.email.model.EmailStatus;
import com.example.backend.email.repository.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailRepository emailRepository;

    // ================= GET LOGGED-IN USER =================
    private String getLoggedInUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }
        return auth.getName();
    }

    // ================= SEND + SAVE ONE RECORD =================
    public void sendAndStoreEmail(String from, String to,
                                  String subject, String body) {
        // 1. Send via SMTP
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);

        // 2. Save ONE record — both sender and receiver use same row
        // sender queries by fromEmail, receiver queries by toEmail
        Email email = new Email();
        email.setFromEmail(from);
        email.setToEmail(to);
        email.setSubject(subject);
        email.setMessage(body);
        email.setStatus(EmailStatus.SENT);
        emailRepository.save(email);   // ✅ sentAt set by @PrePersist
    }

    // ================= INBOX — emails sent TO me =================
    public List<EmailResponse> getMyInbox() {
        String userEmail = getLoggedInUserEmail();
        // Shows emails where YOU are the receiver
        return emailRepository
                .findByToEmailOrderBySentAtDesc(userEmail)
                .stream()
                .map(e -> toResponse(e, "inbox"))
                .toList();
    }

    // ================= SENT — emails sent BY me =================
    public List<EmailResponse> getMySent() {
        String userEmail = getLoggedInUserEmail();
        // Shows emails where YOU are the sender
        return emailRepository
                .findByFromEmailOrderBySentAtDesc(userEmail)
                .stream()
                .map(e -> toResponse(e, "sent"))
                .toList();
    }

    // ================= MAPPER =================
    private EmailResponse toResponse(Email email, String folder) {
        return EmailResponse.builder()
                .id(email.getId())
                .fromEmail(email.getFromEmail())
                .toEmail(email.getToEmail())
                .subject(email.getSubject())
                .message(email.getMessage())
                .sentAt(email.getSentAt())
                .folder(folder)   // ✅ derived, not stored
                .build();
    }

    // ================= OTP =================
    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Visitor OTP Verification");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
    }

    // ================= ORG CREATED =================
    public void sendOrgCreatedMail(String toEmail, String orgName,
                                   String orgEmail, String orgPhone) {
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

    // ================= SIMPLE SEND (no DB save) =================
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendEmployeeCredentials(String toEmail, String name, String password) {

        String subject = "Your Account Created - Visitor System";

        String body = "Hello " + name + ",\n\n"
                + "Your account has been created successfully.\n\n"
                + "Login Details:\n"
                + "Email: " + toEmail + "\n"
                + "Password: " + password + "\n\n"
                + "Please change your password after login.\n\n"
                + "Regards,\nAdmin Team";

        sendEmail(toEmail, subject, body); // your existing method
    }
}