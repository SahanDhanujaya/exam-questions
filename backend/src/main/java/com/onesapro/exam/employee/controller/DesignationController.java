package com.onesapro.exam.employee.controller;

import com.onesapro.exam.employee.dto.DesignationRequest;
import com.onesapro.exam.employee.dto.DesignationResponse;
import com.onesapro.exam.employee.service.DesignationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
public class DesignationController {

    private final DesignationService service;

    public DesignationController(DesignationService service) {
        this.service = service;
    }

    @GetMapping
    public List<DesignationResponse> getAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DesignationResponse create(@Valid @RequestBody DesignationRequest request) {
        return service.create(request);
    }
}
