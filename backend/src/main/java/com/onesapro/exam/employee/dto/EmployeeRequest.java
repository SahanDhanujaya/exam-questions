package com.onesapro.exam.employee.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must be 2 to 100 characters")
        @Pattern(regexp = "^\\p{L}[\\p{L}\\s.'-]*$", message = "Full name contains invalid characters")
        String fullName,

        @NotNull(message = "Designation is required")
        Long designationId,

        @NotNull(message = "Date of join is required")
        @PastOrPresent(message = "Date of join cannot be in the future")
        LocalDate dateOfJoin,

        boolean manager
) {}
