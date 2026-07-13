package com.example.xllent_ecommerce.dto.response;

import com.example.xllent_ecommerce.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String productName;

    private String description;

    private String category;

    private String brand;

    private String imageUrl;

    private BigDecimal superAdminPrice;

    private BigDecimal adminPrice;

    private BigDecimal superStockistPrice;

    private BigDecimal distributorPrice;

    private BigDecimal wholesellerPrice;

    /**
     * This field will be used later
     * when returning the role-specific price.
     */
    //remove by ritik
    //private BigDecimal price;

    private Status status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}