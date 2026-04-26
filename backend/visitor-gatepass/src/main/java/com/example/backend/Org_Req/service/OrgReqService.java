package com.example.backend.Org_Req.service;

import com.example.backend.exception.BadRequestException;
import com.example.backend.organization.model.Organization;
import com.example.backend.organization.repository.OrganizationRepository;
import com.example.backend.Org_Req.dto.request.OrgRequest;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.user.model.User;
import com.example.backend.user.model.Role;
import com.example.backend.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrgReqService {

    @Autowired
    private OrganizationRepository orgRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Transactional
    public OrgResponse createRequest(OrgRequest request) {

        // 🔴 Normalize Emails (avoid duplicate case issue)
        String orgEmail = request.getEmail().toLowerCase();
        String adminEmail = request.getAdminEmail().toLowerCase();

        // 🔴 1. Check duplicate organization email
        if (orgRepo.existsByEmail(orgEmail)) {
            throw new BadRequestException("Organization email already exists");
        }

        // 🔴 2. Check duplicate admin email
        if (userRepo.existsByEmail(adminEmail)) {
            throw new BadRequestException("Admin email already exists");
        }

        // 🔴 3. Password Validation
        String password = request.getAdminPassword();

        if (password.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new BadRequestException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new BadRequestException("Password must contain at least one number");
        }

        // ✅ 4. Save Organization
        Organization org = new Organization();
        org.setName(request.getName());
        org.setEmail(orgEmail);
        org.setAddress(request.getAddress());
        org.setCity(request.getCity());
        org.setType(request.getType());
        org.setWebsite(request.getWebsite());
        org.setStatus("PENDING");

        Organization savedOrg = orgRepo.save(org);

        // ✅ 5. Save ORG ADMIN User
        User user = new User();
        user.setName(request.getAdminName());
        user.setEmail(adminEmail);
        user.setPassword(encoder.encode(password));
        user.setRole(Role.ORG_ADMIN);
        user.setStatus("INACTIVE");
        user.setOrganization(savedOrg);

        userRepo.save(user);

        // ✅ 6. Response
        return new OrgResponse(
                savedOrg.getName(),
                user.getEmail(),
                savedOrg.getStatus(),
                "Waiting for SuperAdmin approval"
        );
    }
}