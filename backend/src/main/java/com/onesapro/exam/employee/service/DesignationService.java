package com.onesapro.exam.employee.service;

import com.onesapro.exam.employee.dto.DesignationRequest;
import com.onesapro.exam.employee.dto.DesignationResponse;
import com.onesapro.exam.employee.entity.Designation;
import com.onesapro.exam.employee.exception.DuplicateResourceException;
import com.onesapro.exam.employee.repository.DesignationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DesignationService {

    private final DesignationRepository repository;

    public DesignationService(DesignationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<DesignationResponse> findAll() {
        return repository.findAll().stream().map(DesignationResponse::from).toList();
    }

    @Transactional
    public DesignationResponse create(DesignationRequest req) {
        String name = req.name().trim();
        if (repository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Designation '" + name + "' already exists");
        }
        String remark = req.remark() == null || req.remark().isBlank() ? null : req.remark().trim();
        return DesignationResponse.from(repository.save(new Designation(name, remark)));
    }
}