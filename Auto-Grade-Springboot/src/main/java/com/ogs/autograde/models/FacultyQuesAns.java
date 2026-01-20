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
public class FacultyQuesAns extends BaseModel{

    @Column(length = 5000)
    private String answer;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private int max_mark;

    @ManyToOne
    @JoinColumn(name = "fqa_fclt_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "facultyQuesAns",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StudentQuesAns> studentQuesAnsList;

    public void addStudentQuesAns(StudentQuesAns studentQuesAns)
    {
        studentQuesAnsList.add(studentQuesAns);
        studentQuesAns.setFacultyQuesAns(this);
    }
}
