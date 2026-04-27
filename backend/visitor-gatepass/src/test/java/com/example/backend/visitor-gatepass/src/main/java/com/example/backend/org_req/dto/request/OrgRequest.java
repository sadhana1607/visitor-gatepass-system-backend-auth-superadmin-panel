package com.example.backend.org_req.dto.request;

import lombok.Data;

@Data
public class OrgRequest {

    private String name;
    private String email;
    private String address;
    private String city;
    private String type;
    private String website;
    private String adminName;
    private String adminEmail;
    private String adminPassword;
    private String Status;

}