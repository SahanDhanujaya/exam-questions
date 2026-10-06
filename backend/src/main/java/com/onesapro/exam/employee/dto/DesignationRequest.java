package com.onesapro.exam.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DesignationRequest(
        @NotBlank(message = "Designation name is required")
        @Size(min = 2, max = 100, message = "Name must be 2 to 100 characters")
        String name,

        @Size(max = 255, message = "Remark must be 255 characters or less")
        String remark
) {}
