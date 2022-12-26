package order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;

    private String userId;

    private String status;

    private String deliveryAddress;

    private String phone;

    private float deliveryFee;

    private String paymentMethod;


}
