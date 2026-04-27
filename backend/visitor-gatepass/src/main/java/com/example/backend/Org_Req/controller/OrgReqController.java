package com.example.backend.Org_Req.controller;

import com.example.backend.Org_Req.dto.request.OrgRequest;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.Org_Req.service.OrgReqService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/org-req")
@CrossOrigin("*")
public class OrgReqController {

    @Autowired
    private OrgReqService service;

    @PostMapping("/create")
    public ResponseEntity<OrgResponse> create(
            @Valid @RequestBody OrgRequest request   // 🔥 IMPORTANT
    ) {
        return ResponseEntity.ok(service.createRequest(request));
    }
}