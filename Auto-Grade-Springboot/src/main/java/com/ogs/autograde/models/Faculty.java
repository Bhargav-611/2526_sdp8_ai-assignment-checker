package com.ogs.autograde.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Faculty extends BaseModel{

    private String name;

    @OneToMany(mappedBy = "faculty",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FacultyQuesAns> facultyQuesAnsList;

    public void addFacultyQuesAns(FacultyQuesAns facultyQuesAns)
    {
        facultyQuesAnsList.add(facultyQuesAns);
        facultyQuesAns.setFaculty(this);
    }
}
