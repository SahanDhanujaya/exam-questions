package com.onesapro.exam.employee.service;

import com.onesapro.exam.employee.dto.EmployeeRequest;
import com.onesapro.exam.employee.dto.EmployeeResponse;
import com.onesapro.exam.employee.entity.Designation;
import com.onesapro.exam.employee.entity.Employee;
import com.onesapro.exam.employee.exception.ResourceNotFoundException;
import com.onesapro.exam.employee.repository.DesignationRepository;
import com.onesapro.exam.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DesignationRepository designationRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DesignationRepository designationRepository) {
        this.employeeRepository = employeeRepository;
        this.designationRepository = designationRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAllWithDesignation().stream()
                .map(EmployeeResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return EmployeeResponse.from(getOrThrow(id));
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest req) {
        Employee employee = new Employee();
        apply(employee, req);
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest req) {
        Employee employee = getOrThrow(id);
        apply(employee, req);
        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public void delete(Long id) {
        employeeRepository.delete(getOrThrow(id));
    }

    // ---- helpers ----

    private Employee getOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    private void apply(Employee employee, EmployeeRequest req) {
        Designation designation = designationRepository.findById(req.designationId())
                .orElseThrow(() -> new ResourceNotFoundException("Designation not found: " + req.designationId()));

        // Full name -> first space එකෙන් බෙදනවා
        String[] parts = req.fullName().trim().split(" ", 2);
        employee.setFirstName(parts[0]);
        employee.setLastName(parts.length > 1 ? parts[1].trim() : null);

        employee.setDesignation(designation);
        employee.setDateOfJoin(req.dateOfJoin());
        employee.setManager(req.manager());
    }
}
