package com.example.xllent_ecommerce.repository;

import com.example.xllent_ecommerce.entity.Role;
import com.example.xllent_ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    boolean existsByGstin(String gstin);

    List<User> findByRole(Role role);

}