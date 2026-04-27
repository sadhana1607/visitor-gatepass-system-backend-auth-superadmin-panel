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

        String orgEmail = request.getEmail().toLowerCase();
        String adminEmail = request.getAdminEmail().toLowerCase();

        if (orgRepo.existsByEmail(orgEmail)) {
            throw new BadRequestException("Organization email already exists");
        }

        if (userRepo.existsByEmail(adminEmail)) {
            throw new BadRequestException("Admin email already exists");
        }

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

        // ✅ 1. Create Organization (DO NOT SAVE YET)
        Organization org = new Organization();
        org.setName(request.getName());
        org.setEmail(orgEmail);
        org.setAddress(request.getAddress());
        org.setCity(request.getCity());
        org.setType(request.getType());
        org.setWebsite(request.getWebsite());
        org.setStatus("PENDING");

        // ✅ 2. Create User
        User user = new User();
        user.setName(request.getAdminName());
        user.setEmail(adminEmail);
        user.setPassword(encoder.encode(password));
        user.setRole(Role.ORG_ADMIN);
        user.setStatus("INACTIVE");

        // ✅ 3. SET RELATION (CRITICAL 🔥)
        user.setOrganization(org);
        org.setUser(user);

        // ✅ 4. SAVE USER FIRST (so user_id exists)
        userRepo.save(user);

        // ✅ 5. NOW SAVE ORG (user_id is available)
        Organization savedOrg = orgRepo.save(org);

        return new OrgResponse(
                savedOrg.getName(),
                user.getEmail(),
                savedOrg.getStatus(),
                "Waiting for SuperAdmin approval"
        );
    }
}