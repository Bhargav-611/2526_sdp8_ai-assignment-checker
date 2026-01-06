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
public class Faculty extends BaseModel{

    private String name;

    @OneToMany(mappedBy = "faculty",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<FacultyQuesAns> facultyQuesAnsList;

}
