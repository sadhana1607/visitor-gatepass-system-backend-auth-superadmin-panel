package com.example.backend.user.repository;


import com.example.backend.organization.model.Organization;
import com.example.backend.user.model.Role;
import com.example.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    User findByOrganizationAndRole(Organization org, Role role);


    boolean existsByEmail(String adminEmail);

    List<User> findByRole(Role role);
}
