package com.ogs.autograde.models;


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
public class Student extends BaseModel{

    private String name;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    private String department;
    private String semester;
    private String section;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String admissionYear;

    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @Builder.Default
    private List<StudentQuesAns> studentQuesAnsList = new ArrayList<>();

    public void AddstudentQuesAnsList(StudentQuesAns studentQuesAns)
    {
        studentQuesAnsList.add(studentQuesAns);
        studentQuesAns.setStudent(this);
    }

}
