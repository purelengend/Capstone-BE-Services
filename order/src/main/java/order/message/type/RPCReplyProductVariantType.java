package order.message.type;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

@Data
@JsonSerialize
public class RPCReplyProductVariantType {
    private String productId;
    private String color;
    private String size;
    private int quantity;
    private float sellingPrice;
}
