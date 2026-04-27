package com.example.backend.Logs.Repository;

import com.example.backend.Logs.model.Logs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogsRepository extends JpaRepository<Logs, Long> {
}
