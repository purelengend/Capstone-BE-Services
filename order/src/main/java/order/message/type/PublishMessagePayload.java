package order.message.type;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@Data
public class PublishMessagePayload {
    private String event;
    private Object data;
}
