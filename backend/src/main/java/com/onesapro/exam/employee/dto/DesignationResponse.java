package com.onesapro.exam.employee.dto;

import com.onesapro.exam.employee.entity.Designation;

public record DesignationResponse(Long id, String name, String remark) {
    public static DesignationResponse from(Designation d) {
        return new DesignationResponse(d.getId(), d.getName(), d.getRemark());
    }
}
