package order.service.implement;

import lombok.RequiredArgsConstructor;
import order.dto.OrderItemDTO;
import order.entity.Order;
import order.entity.OrderItem;
import order.mapper.OrderItemMapper;
import order.repository.IOrderItemRepository;
import order.service.IOrderItemService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemService implements IOrderItemService {

    private final IOrderItemRepository orderItemRepository;

    @Override
    public List<OrderItem> findAll() {
        return null;
    }

    @Override
    public Optional<OrderItem> findById(String id) {
        return Optional.empty();
    }

    @Override
    public OrderItem save(OrderItem entity) {
        return null;
    }

    @Override
    public Optional<OrderItem> deleteById(String id) {
        return Optional.empty();
    }

    @Override
    public List<OrderItem> saveOrderItemsOfOrder(List<OrderItemDTO> orderItemDTOList, Order order) {
        List<OrderItem> orderItemList = orderItemDTOList.stream().map(orderItemDTO -> {
            OrderItem orderItem = OrderItemMapper.INSTANCE.toEntity(orderItemDTO);
            orderItem.setOrder(order);
            return orderItem;
        }).toList();
        return orderItemRepository.saveAll(orderItemList);
    }

    public List<OrderItem> updateSellingPriceOfOrderItems(List<OrderItem> orderItemList) {
        return orderItemRepository.saveAll(orderItemList);
    }
}
