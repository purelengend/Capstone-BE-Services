package order.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private String id;
    private String productId;
    private String productName;
    private String productPhotoUrl;
    private int quantity;
    private String color;
    private String size;
    private String sellingPrice;
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
