package order.message;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@Data
public class CustomerOrderSuccessMessage {
    private String userId;
    private List<String> productIdList;
}
