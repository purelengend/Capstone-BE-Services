package order.entity;

import jakarta.persistence.*;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    private Long orderId;
    private String productId;
    private String productName;
    private String productPhotoUrl;
    private float sellingPrice;
    private int quantity;
    private String color;
    private String size;
}
