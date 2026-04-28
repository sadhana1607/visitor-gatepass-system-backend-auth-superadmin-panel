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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrgReqService {

    @Autowired
    private OrganizationRepository orgRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Transactional
    public OrgResponse createRequest(OrgRequest request) {

        try {
            // 🔹 Normalize
            String orgEmail = request.getEmail().toLowerCase();
            String adminEmail = request.getAdminEmail().toLowerCase();

            // 🔹 Check duplicates
            if (orgRepo.existsByEmail(orgEmail)) {
                throw new BadRequestException("Organization email already exists");
            }

            if (userRepo.existsByEmail(adminEmail)) {
                throw new BadRequestException("Admin email already exists");
            }

            // 🔹 Password validation
            String password = request.getAdminPassword();

            if (password == null || password.length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters");
            }

            if (!password.matches(".*[A-Z].*")) {
                throw new BadRequestException("Password must contain uppercase letter");
            }

            if (!password.matches(".*\\d.*")) {
                throw new BadRequestException("Password must contain number");
            }

            // 🔹 Create User (NOT saved separately)
            User user = new User();
            user.setName(request.getAdminName());
            user.setEmail(adminEmail);
            user.setPassword(encoder.encode(password));
            user.setRole(Role.ORG_ADMIN);
            user.setStatus("INACTIVE");

            // 🔹 Create Organization
            Organization org = new Organization();
            org.setName(request.getName());
            org.setEmail(orgEmail);
            org.setAddress(request.getAddress());
            org.setCity(request.getCity());
            org.setType(request.getType());
            org.setWebsite(request.getWebsite());
            org.setStatus("PENDING");

            // 🔗 ONLY ONE SIDE RELATION
            org.setUser(user);

            // 🔹 Save (cascade will save user automatically)
            Organization savedOrg = orgRepo.save(org);

            return new OrgResponse(
                    savedOrg.getName(),
                    adminEmail,
                    savedOrg.getStatus(),
                    "Waiting for SuperAdmin approval"
            );

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Org request failed: " + e.getMessage());
        }
    }
}