package com.example.xllent_ecommerce.dto.response;

import com.example.xllent_ecommerce.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

}