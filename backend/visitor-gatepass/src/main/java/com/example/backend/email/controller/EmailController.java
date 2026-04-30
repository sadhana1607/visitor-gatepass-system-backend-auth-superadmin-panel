package com.example.backend.email.controller;

import com.example.backend.config.EmailService;
import com.example.backend.email.dto.request.EmailRequest;
import com.example.backend.email.dto.response.EmailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    // 📥 Inbox — only received emails
    @GetMapping("/inbox")
    public List<EmailResponse> getInbox() {
        return emailService.getMyInbox();
    }

    // 📤 Sent — only sent emails
    @GetMapping("/sent")
    public List<EmailResponse> getSent() {
        return emailService.getMySent();
    }

    // ✉️ Send email
    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest req,
                                       Principal principal) {
        String from = principal.getName();
        emailService.sendAndStoreEmail(
                from,
                req.getToEmail(),
                req.getSubject(),
                req.getMessage()
        );
        return ResponseEntity.ok("Email sent successfully");
    }
}