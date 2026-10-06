package com.onesapro.exam.employee.repository;

import com.onesapro.exam.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("select e from Employee e join fetch e.designation order by e.id")
    List<Employee> findAllWithDesignation();
}