package com.ogs.autograde.services;


import com.ogs.autograde.models.Student;
import java.util.List;

public interface StudentServices {
    Student createStudent(String name);
    List<Student> getAllStudents();
}
