package com.example.backend.Org_Req.controller;

import com.example.backend.Org_Req.dto.request.OrgRequest;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.Org_Req.service.OrgReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/org-req")

public class OrgReqController {

    @Autowired
    private OrgReqService service;

    // CREATE ORGANIZATION REQUEST (NO LOGIN)
    @PostMapping("/create")
    public OrgResponse create(@RequestBody OrgRequest request) {

            return service.createRequest(request);

    }
}