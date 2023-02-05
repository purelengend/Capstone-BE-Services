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
    private String firstName;
    private String lastName;
    private String companyName;
    private String country;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String phone;

    private float deliveryFee;

    private String paymentMethod;

    private List<OrderItemDTO> orderItemDTOList;
}
