package order.message.type;

import lombok.Data;

@Data
public class RPCRequestProductVariantType {
    private String productId;
    private String color;
    private String size;
    private int quantity;
}
