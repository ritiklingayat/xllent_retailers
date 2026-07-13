package com.example.xllent_ecommerce.service;

import com.example.xllent_ecommerce.dto.request.LoginRequest;
import com.example.xllent_ecommerce.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}