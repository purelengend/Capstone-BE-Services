package order.saga;

import lombok.AllArgsConstructor;
import order.repository.IOrderRepository;
import order.service.IOrderService;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class OrderSaga {
    private final IOrderService orderService;
    private final IOrderRepository orderRepository;

    public void reserveProduct() {
        System.out.println("Reserve product");
    }
}
