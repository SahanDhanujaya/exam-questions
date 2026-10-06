package com.onesapro.exam.employee.dto;

import com.onesapro.exam.employee.entity.Employee;
import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        Long designationId,
        String designationName,
        String firstName,
        String lastName,
        String fullName,
        LocalDate dateOfJoin,
        boolean manager
) {
    public static EmployeeResponse from(Employee e) {
        String last = e.getLastName() == null ? "" : e.getLastName();
        String full = last.isEmpty() ? e.getFirstName() : e.getFirstName() + " " + last;
        return new EmployeeResponse(
                e.getId(),
                e.getDesignation().getId(),
                e.getDesignation().getName(),
                e.getFirstName(),
                last,
                full,
                e.getDateOfJoin(),
                e.isManager());
    }
}
