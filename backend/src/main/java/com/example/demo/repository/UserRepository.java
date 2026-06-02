package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

<<<<<<< HEAD
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(Integer userId);
=======
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByName(String name);
>>>>>>> ced44aed8460e7fc95b000822d00e4e19edd8e5e
}