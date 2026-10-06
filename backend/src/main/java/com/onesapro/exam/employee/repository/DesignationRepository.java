package com.onesapro.exam.employee.repository;

import com.onesapro.exam.employee.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository<Designation, Long> {
    boolean existsByNameIgnoreCase(String name);
}
