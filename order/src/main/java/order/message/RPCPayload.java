package order.message;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RPCPayload {
    String type;
    Object data;
}