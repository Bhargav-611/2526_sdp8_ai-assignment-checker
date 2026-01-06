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
public class FacultyQuesAns extends BaseModel{

    private String answer;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private int max_mark;

    @ManyToOne
    @JoinColumn(name = "fqa_fclt_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "facultyQuesAns",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<StudentQuesAns> studentQuesAnsList;

}
