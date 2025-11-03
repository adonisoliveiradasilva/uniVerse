package br.com.my_universe.api.application.ports;

public interface StudentPasswordRepository {
    void saveOrUpdate(String email, String passwordHash);
}