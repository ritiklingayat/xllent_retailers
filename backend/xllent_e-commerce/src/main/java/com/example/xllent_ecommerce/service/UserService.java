package com.example.xllent_ecommerce.service;

import com.example.xllent_ecommerce.dto.request.UserRequest;
import com.example.xllent_ecommerce.dto.response.UserResponse;
import com.example.xllent_ecommerce.entity.Role;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    List<UserResponse> getUsersByRole(Role role);

}