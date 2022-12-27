package order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private String userId;

    private String deliveryAddress;

    private String phone;

    private float deliveryFee;

    private String paymentMethod;

    private List<OrderItemDTO> OrderItemDTOList;
}
