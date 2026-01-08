package com.ogs.autograde.models;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Student extends BaseModel{

    private String name;

    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<StudentQuesAns> studentQuesAnsList;

    public void AddstudentQuesAnsList(StudentQuesAns studentQuesAns)
    {
        studentQuesAnsList.add(studentQuesAns);
        studentQuesAns.setStudent(this);
    }

}
