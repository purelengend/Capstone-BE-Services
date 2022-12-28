package order.message;

import lombok.Data;

@Data
public class ReserveProductMessage {
    private String productId;
    private String color;
    private String size;
    private int quantity;
}
