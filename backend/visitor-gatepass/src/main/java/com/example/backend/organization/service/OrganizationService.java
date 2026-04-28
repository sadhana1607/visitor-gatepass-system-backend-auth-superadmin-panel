package com.example.backend.organization.service;

import com.example.backend.Org_Req.dto.request.OrgRequest;
import com.example.backend.employee.model.Employee;
import com.example.backend.employee.repository.EmployeeRepository;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.organization.model.Organization;
import com.example.backend.organization.repository.OrganizationRepository;
import com.example.backend.user.model.Role;
import com.example.backend.user.model.User;
import com.example.backend.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // ✅ GET ALL
    public List<OrgResponse> getAllOrganizations() {
        return organizationRepository.findAll()
                .stream()
                .map(org -> {
                    OrgResponse res = new OrgResponse();

                    res.setId(org.getId());
                    res.setName(org.getName());
                    res.setEmail(org.getEmail());
                    res.setAddress(org.getAddress());
                    res.setCity(org.getCity());
                    res.setType(org.getType());
                    res.setStatus(org.getStatus());
                    res.setWebsite(org.getWebsite());

                    return res;
                })
                .collect(Collectors.toList());
    }

    // ✅ APPROVE
    @Transactional
    public OrgResponse approveOrganization(Long id) {

        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + id));

        if ("APPROVED".equalsIgnoreCase(org.getStatus())) {
            throw new IllegalStateException("Organization already approved");
        }

        org.setStatus("APPROVED");

        // 🔹 Activate admin (User)
        User admin = userRepository.findByOrganizationAndRole(org, Role.ORG_ADMIN);

        if (admin != null) {
            admin.setStatus("ACTIVE");
            userRepository.save(admin);

            // 🔥 ALSO ACTIVATE EMPLOYEE
            Employee emp = employeeRepository.findByUser(admin);
            if (emp != null) {
                emp.setStatus("ACTIVE");
                employeeRepository.save(emp);
            }
        }

        Organization saved = organizationRepository.save(org);

        return new OrgResponse(
                saved.getName(),
                admin != null ? admin.getEmail() : null,
                saved.getStatus(),
                "Organization approved successfully"
        );
    }

    //Reject
    @Transactional
    public OrgResponse rejectOrganization(Long id) {

        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with id: " + id));

        if ("REJECTED".equalsIgnoreCase(org.getStatus())) {
            throw new IllegalStateException("Organization already rejected");
        }

        org.setStatus("REJECTED");

        // 🔹 Deactivate admin (User)
        User admin = userRepository.findByOrganizationAndRole(org, Role.ORG_ADMIN);

        if (admin != null) {
            admin.setStatus("INACTIVE");
            userRepository.save(admin);

            // 🔥 ALSO DEACTIVATE EMPLOYEE
            Employee emp = employeeRepository.findByUser(admin);
            if (emp != null) {
                emp.setStatus("INACTIVE");
                employeeRepository.save(emp);
            }
        }

        Organization saved = organizationRepository.save(org);

        return new OrgResponse(
                saved.getName(),
                admin != null ? admin.getEmail() : null,
                saved.getStatus(),
                "Organization rejected successfully"
        );
    }

    @Transactional
    public OrgResponse updateOrganization(Long id, OrgRequest request) {

        // 🔴 Find org
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Organization not found with id: " + id)
                );

        // 🔴 Optional: Prevent update if rejected
        if ("REJECTED".equalsIgnoreCase(org.getStatus())) {
            throw new IllegalStateException("Cannot update rejected organization");
        }

        // ✅ Update fields
        org.setName(request.getName());
        org.setAddress(request.getAddress());
        org.setCity(request.getCity());
        org.setType(request.getType());
        org.setWebsite(request.getWebsite());

        Organization saved = organizationRepository.save(org);

        // ✅ Response
        return new OrgResponse(
                saved.getName(),
                null,
                saved.getStatus(),
                "Organization updated successfully"
        );
    }
}