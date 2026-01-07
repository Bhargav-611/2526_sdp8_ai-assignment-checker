package com.ogs.autograde.Repository;


import com.ogs.autograde.models.StudentQuesAns;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentQuesAnsRepo extends JpaRepository<StudentQuesAns,Long> {
}
