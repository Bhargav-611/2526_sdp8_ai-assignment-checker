package com.ogs.autograde.services;

import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.models.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServicesImp implements IStudentServices{

    final private StudentRepo studentRepo;

    public StudentServicesImp(@Autowired StudentRepo studentRepo) {
        this.studentRepo = studentRepo;
    }

    @Override
    public Student createStudent(String name) {
        System.out.println(name);
        Student student = Student.builder().name(name).build();
        return studentRepo.save(student);
    }
}
