package com.example.backend.organization.controller;

import com.example.backend.Org_Req.dto.request.OrgRequest;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.organization.service.OrganizationService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/org")

public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    // ✅ 1. Get all organizations
    @GetMapping("/all")
    public ResponseEntity<List<OrgResponse>> getAllOrganizations() {
        return ResponseEntity.ok(organizationService.getAllOrganizations());
    }

    // ✅ 2. Approve organization
    @PutMapping("/approve/{id}")
    public ResponseEntity<OrgResponse> approveOrganization(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(organizationService.approveOrganization(id));
    }

    // ✅ 3. Reject organization
    @PutMapping("/reject/{id}")
    public ResponseEntity<OrgResponse> rejectOrganization(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(organizationService.rejectOrganization(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrgResponse> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrgRequest request
    ) {
        return ResponseEntity.ok(organizationService.updateOrganization(id, request));
    }
}