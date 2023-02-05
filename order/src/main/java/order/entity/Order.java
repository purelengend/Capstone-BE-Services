package order.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String companyName;
    private String country;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String status;
    private String phone;
    private String deliveryFee;
    private String paymentMethod;
    private String message;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItemList;
}
