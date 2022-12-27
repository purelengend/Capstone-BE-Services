package order.service;

import order.dto.OrderDTO;
import order.dto.OrderItemDTO;
import order.entity.Order;

public interface IOrderService extends IService<Order, String> {
    Order save(OrderDTO orderDTO);
}
