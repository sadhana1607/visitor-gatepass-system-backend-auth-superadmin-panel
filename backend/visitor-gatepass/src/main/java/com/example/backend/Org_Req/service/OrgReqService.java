package com.example.backend.Org_Req.service;

import com.example.backend.config.EmailService;
import com.example.backend.employee.model.Employee;
import com.example.backend.employee.repository.EmployeeRepository;
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

import java.time.LocalTime;
import java.util.List;

@Service
public class OrgReqService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrganizationRepository orgRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Transactional
    public OrgResponse createRequest(OrgRequest req) {

        // 🔹 Normalize
        String orgEmail = req.getEmail().toLowerCase();
        String adminEmail = req.getAdminEmail().toLowerCase();

        // 🔹 Duplicate checks
        if (orgRepo.existsByEmail(orgEmail)) {
            throw new BadRequestException("Organization email already exists");
        }

        if (userRepo.existsByEmail(adminEmail)) {
            throw new BadRequestException("Admin email already exists");
        }

        // 🔹 Validate password
        String password = req.getAdminPassword();

        if (password == null || password.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new BadRequestException("Password must contain uppercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new BadRequestException("Password must contain number");
        }

        // 🔹 Create User (ORG ADMIN)
        User user = new User();
        user.setName(req.getAdminName());
        user.setEmail(adminEmail);
        user.setPassword(encoder.encode(password));
        user.setRole(Role.ORG_ADMIN);
        user.setStatus("INACTIVE");

        // 🔹 Create Organization
        Organization org = new Organization();
        org.setName(req.getName());
        org.setEmail(orgEmail);
        org.setAddress(req.getAddress());
        org.setCity(req.getCity());
        org.setType(req.getType());
        org.setWebsite(req.getWebsite());
        org.setStatus("PENDING");

        // 🔗 both org ↔ user
        org.setUser(user);
        user.setOrganization(org);
        // 🔹 Save org (user saved via cascade)
        Organization savedOrg = orgRepo.save(org);

        // 🔥 CREATE EMPLOYEE FOR ADMIN
        Employee emp = new Employee();
        emp.setName(user.getName());
        emp.setEmail(user.getEmail());
        emp.setPhone(req.getPhone());
        emp.setStatus("INACTIVE");
        emp.setShiftStart(LocalTime.of(9, 0, 0));
        emp.setShiftEnd(LocalTime.of(18, 0, 0));

        emp.setUser(user);                 // 🔗 link user
        emp.setOrganization(savedOrg);     // 🔗 link org

        Employee savedEmp = employeeRepo.save(emp);
        List<User> superAdmins = userRepo.findByRole(Role.SUPER_ADMIN);

        if (superAdmins.isEmpty()) {
            throw new RuntimeException("No Super Admin found");
        }

        for (User admin : superAdmins) {
            emailService.sendOrgCreatedMail(
                    admin.getEmail(),   // ✅ correct
                    emp.getName(),
                    emp.getEmail(),
                    emp.getPhone()
            );
        }


        return new OrgResponse(
                savedOrg.getName(),
                adminEmail,
                savedOrg.getStatus(),
                "Waiting for SuperAdmin approval"
        );
    }


}