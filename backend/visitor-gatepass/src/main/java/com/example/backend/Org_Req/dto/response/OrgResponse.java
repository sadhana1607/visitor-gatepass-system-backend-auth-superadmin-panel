package com.example.backend.Org_Req.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrgResponse {

    private Long id;
    private String name;
    private String email;
    private String city;
    private String address;
    private String type;
    private String website;

    private String adminName;
    private String adminEmail;

    private String status;
    private String message;

    // ✅ Constructor for success response
    public OrgResponse(String name, String adminEmail, String status, String message) {
        this.name = name;
        this.adminEmail = adminEmail;
        this.status = status;
        this.message = message;
    }


}