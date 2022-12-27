package order.service.implement;

import lombok.RequiredArgsConstructor;
import order.dto.OrderDTO;
import order.dto.OrderItemDTO;
import order.entity.Order;
import order.repository.IOrderRepository;
import order.service.IOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final IOrderRepository orderRepository;

    @Override
    public Order save(OrderDTO dto) {
        return null;
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> findById(String id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return order;
    }

    @Override
    public Order save(Order entity) {
        return orderRepository.save(entity);
    }

    @Override
    public Optional<Order> deleteById(String id) {
        Optional<Order> order = this.findById(id);
        order.ifPresent(orderRepository::delete);
        return order;
    }
}
