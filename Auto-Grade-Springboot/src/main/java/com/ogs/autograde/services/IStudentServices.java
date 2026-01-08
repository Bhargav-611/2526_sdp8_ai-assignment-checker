package com.ogs.autograde.services;


import com.ogs.autograde.models.Student;
import org.springframework.stereotype.Service;

public interface IStudentServices {
    Student createStudent(String name);
}
