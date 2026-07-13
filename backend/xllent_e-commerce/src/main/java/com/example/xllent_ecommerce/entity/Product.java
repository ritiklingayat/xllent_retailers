package com.example.xllent_ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String brand;

    /**
     * Cloudinary Image URL
     */
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal superAdminPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal adminPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal superStockistPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal distributorPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal wholesellerPrice;

    @Enumerated(EnumType.STRING)
    private Status status;
}