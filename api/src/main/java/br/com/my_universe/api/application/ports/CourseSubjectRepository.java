package br.com.my_universe.api.application.ports;

import java.util.List;

public interface CourseSubjectRepository {
    void linkSubjectsToCourse(String institutionAcronym, String courseCode, List<String> subjectCodes);
    void unlinkAllSubjectsFromCourse(String institutionAcronym, String courseCode);
    List<String> findSubjectCodesByCourse(String institutionAcronym, String courseCode);
}