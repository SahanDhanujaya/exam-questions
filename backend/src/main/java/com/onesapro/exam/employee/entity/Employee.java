package com.onesapro.exam.employee.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "designation_id", nullable = false)
    private Designation designation;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 150)
    private String lastName;

    @Column(name = "date_of_join", nullable = false)
    private LocalDate dateOfJoin;

    @Column(name = "is_manager", nullable = false, columnDefinition = "tinyint(4) default 0")
    private Byte manager;

    public Long getId() { return id; }
    public Designation getDesignation() { return designation; }
    public void setDesignation(Designation designation) { this.designation = designation; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public LocalDate getDateOfJoin() { return dateOfJoin; }
    public void setDateOfJoin(LocalDate dateOfJoin) { this.dateOfJoin = dateOfJoin; }
    public Byte getManager() { return manager; }
    public void setManager(Byte manager) { this.manager = manager; }
    public boolean isManager() { return manager != null && manager != 0; }
    public void setManager(boolean manager) { this.manager = (byte) (manager ? 1 : 0); }
}