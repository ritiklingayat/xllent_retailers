package com.example.xllent_ecommerce.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    private String description;

    @NotNull
    private Long categoryId;

    @NotBlank(message = "Brand is required")
    private String brand;

    /**
     * Product Image
     */
    private MultipartFile image;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal superAdminPrice;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal adminPrice;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal superStockistPrice;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal distributorPrice;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal wholesellerPrice;
}