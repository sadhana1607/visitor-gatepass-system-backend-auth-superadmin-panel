package com.example.backend.Org_Req.controller;


import com.example.backend.org_req.dto.request.OrgRequest;
import com.example.backend.Org_Req.dto.response.OrgResponse;
import com.example.backend.Org_Req.service.OrgReqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/org-req")
@CrossOrigin("*")
public class OrgReqController {

    @Autowired
    private OrgReqService service;

    // CREATE ORGANIZATION REQUEST (NO LOGIN)
    @PostMapping("/create")
    public OrgResponse create(@RequestBody OrgRequest req) {
        return service.createRequest(req);
    }
}