package order.message.type;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import order.message.type.RPCReplyProductVariantType;

import java.util.List;

@Data
@JsonSerialize
public class RPCResult {
    private String status;
    private String message;
    private List<RPCReplyProductVariantType> productVariantList;
}
