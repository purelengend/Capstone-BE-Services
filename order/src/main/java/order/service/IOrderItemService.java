package order.service;

import order.dto.OrderItemDTO;
import order.entity.Order;
import order.entity.OrderItem;

import java.util.List;

public interface IOrderItemService extends IService<OrderItem, String> {
    List<OrderItem> saveOrderItemsOfOrder(List<OrderItemDTO> orderItemDTOList, Order order);
    List<OrderItem> updateSellingPriceOfOrderItems(List<OrderItem> orderItemList);
}
