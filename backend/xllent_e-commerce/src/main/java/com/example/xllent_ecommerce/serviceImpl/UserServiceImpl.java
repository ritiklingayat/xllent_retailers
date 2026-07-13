package com.example.xllent_ecommerce.serviceImpl;

import com.example.xllent_ecommerce.dto.request.UserRequest;
import com.example.xllent_ecommerce.dto.response.UserResponse;
import com.example.xllent_ecommerce.entity.Role;
import com.example.xllent_ecommerce.entity.Status;
import com.example.xllent_ecommerce.entity.User;
import com.example.xllent_ecommerce.repository.UserRepository;
import com.example.xllent_ecommerce.service.CloudinaryService;
import com.example.xllent_ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;

    @Override
    public UserResponse createUser(UserRequest request) {

        try {

            // ==========================
            // Duplicate Email Check
            // ==========================
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists.");
            }

            // ==========================
            // Duplicate Mobile Check
            // ==========================
            if (userRepository.existsByMobile(request.getMobile())) {
                throw new RuntimeException("Mobile number already exists.");
            }

            // ==========================
            // Duplicate GSTIN Check
            // ==========================
            if (request.getGstin() != null &&
                    !request.getGstin().isBlank() &&
                    userRepository.existsByGstin(request.getGstin())) {

                throw new RuntimeException("GSTIN already exists.");
            }

            // ==========================
            // Convert DTO -> Entity
            // ==========================
            User user = modelMapper.map(request, User.class);

            // ==========================
            // Encrypt Password
            // ==========================
            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );

            // ==========================
            // Default Status
            // ==========================
            user.setStatus(Status.ACTIVE);

            // ==========================
            // Upload Profile Image
            // ==========================
            if (request.getProfileImage() != null
                    && !request.getProfileImage().isEmpty()) {

                String imageUrl = cloudinaryService.uploadImage(
                        request.getProfileImage()
                );

                user.setProfileImage(imageUrl);
            }

            // ==========================
            // Set Super Stockist
            // ==========================
            if (request.getSuperStockistId() != null) {

                User superStockist =
                        userRepository.findById(request.getSuperStockistId())
                                .orElseThrow(() ->
                                        new RuntimeException("Super Stockist not found"));

                if (superStockist.getRole() != Role.SUPER_STOCKIST) {
                    throw new RuntimeException("Selected user is not a Super Stockist.");
                }

                user.setSuperStockist(superStockist);
            }

            // ==========================
            // Set Distributor
            // ==========================
            if (request.getDistributorId() != null) {

                User distributor =
                        userRepository.findById(request.getDistributorId())
                                .orElseThrow(() ->
                                        new RuntimeException("Distributor not found"));

                if (distributor.getRole() != Role.DISTRIBUTOR) {
                    throw new RuntimeException("Selected user is not a Distributor.");
                }

                user.setDistributor(distributor);
            }

            // ==========================
            // Save User
            // ==========================
            User savedUser = userRepository.save(user);

            // ==========================
            // Return Response
            // ==========================
            return modelMapper.map(savedUser, UserResponse.class);

        } catch (IOException e) {

            throw new RuntimeException("Image upload failed.", e);

        }

    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // ==========================
            // Duplicate Email Check
            // ==========================
            if (!user.getEmail().equals(request.getEmail())
                    && userRepository.existsByEmail(request.getEmail())) {

                throw new RuntimeException("Email already exists.");
            }

            // ==========================
            // Duplicate Mobile Check
            // ==========================
            if (!user.getMobile().equals(request.getMobile())
                    && userRepository.existsByMobile(request.getMobile())) {

                throw new RuntimeException("Mobile number already exists.");
            }

            // ==========================
            // Duplicate GSTIN Check
            // ==========================
            if (request.getGstin() != null
                    && !request.getGstin().isBlank()
                    && !request.getGstin().equals(user.getGstin())
                    && userRepository.existsByGstin(request.getGstin())) {

                throw new RuntimeException("GSTIN already exists.");
            }

            // ==========================
            // Update Basic Details
            // ==========================

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setCompany(request.getCompany());
            user.setGstin(request.getGstin());
            user.setEmail(request.getEmail());
            user.setMobile(request.getMobile());
            user.setGender(request.getGender());
            user.setRole(request.getRole());
            user.setState(request.getState());
            user.setDistrict(request.getDistrict());
            user.setCity(request.getCity());
            user.setPincode(request.getPincode());
            user.setAddress(request.getAddress());

            // ==========================
            // Update Password
            // ==========================
            if (request.getPassword() != null
                    && !request.getPassword().isBlank()) {

                user.setPassword(
                        passwordEncoder.encode(request.getPassword())
                );
            }

            // ==========================
            // Update Profile Image
            // ==========================
            if (request.getProfileImage() != null
                    && !request.getProfileImage().isEmpty()) {

                // Delete old image
                if (user.getProfileImage() != null) {
                    cloudinaryService.deleteImage(user.getProfileImage());
                }

                // Upload new image
                String imageUrl = cloudinaryService.uploadImage(
                        request.getProfileImage()
                );

                user.setProfileImage(imageUrl);
            }

            // ==========================
            // Update Super Stockist
            // ==========================
            if (request.getSuperStockistId() != null) {

                User superStockist = userRepository
                        .findById(request.getSuperStockistId())
                        .orElseThrow(() ->
                                new RuntimeException("Super Stockist not found"));

                if (superStockist.getRole() != Role.SUPER_STOCKIST) {
                    throw new RuntimeException("Invalid Super Stockist.");
                }

                user.setSuperStockist(superStockist);

            } else {

                user.setSuperStockist(null);
            }

            // ==========================
            // Update Distributor
            // ==========================
            if (request.getDistributorId() != null) {

                User distributor = userRepository
                        .findById(request.getDistributorId())
                        .orElseThrow(() ->
                                new RuntimeException("Distributor not found"));

                if (distributor.getRole() != Role.DISTRIBUTOR) {
                    throw new RuntimeException("Invalid Distributor.");
                }

                user.setDistributor(distributor);

            } else {

                user.setDistributor(null);
            }

            User updatedUser = userRepository.save(user);

            return modelMapper.map(updatedUser, UserResponse.class);

        } catch (IOException e) {

            throw new RuntimeException("Image upload failed.", e);

        }
    }


    @Override
    public void deleteUser(Long id) {

        try {

            User user = userRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            // Delete Cloudinary Image
            if (user.getProfileImage() != null) {

                cloudinaryService.deleteImage(user.getProfileImage());

            }

            userRepository.delete(user);

        } catch (IOException e) {

            throw new RuntimeException("Unable to delete image.", e);

        }

    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .toList();
    }

    @Override
    public List<UserResponse> getUsersByRole(Role role) {

        return userRepository.findByRole(role)
                .stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .toList();
    }

}