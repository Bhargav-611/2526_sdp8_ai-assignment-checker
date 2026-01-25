package com.ogs.autograde.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Faculty extends BaseModel{

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String department;
    private String designation; // Professor, Assistant Professor

    private String qualification; // PhD, M.Tech
    private int experienceYears;

    @Column(length = 1000)
    private String bio;

    @OneToMany(mappedBy = "faculty",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<FacultyQuesAns> facultyQuesAnsList = new ArrayList<>();

    public void addFacultyQuesAns(FacultyQuesAns facultyQuesAns)
    {
        facultyQuesAnsList.add(facultyQuesAns);
        facultyQuesAns.setFaculty(this);
    }
}
