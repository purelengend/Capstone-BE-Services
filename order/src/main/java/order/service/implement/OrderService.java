package order.service.implement;

import lombok.RequiredArgsConstructor;
import order.config.RabbitMQConfig;
import order.dto.OrderDTO;
import order.dto.OrderItemDTO;
import order.entity.Order;
import order.mapper.OrderMapper;
import order.message.RPCEventType;
import order.message.RPCPayload;
import order.message.RequestRPC;
import order.message.ResponseReserveProduct;
import order.repository.IOrderRepository;
import order.service.IOrderService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final IOrderRepository orderRepository;
//    private final RabbitMQConfig rabbitMQConfig;
    private final RequestRPC requestRPC;
    private RabbitTemplate rabbitTemplate;

    @Value("${order.rpc.request.queue}")
    private String requestQueue;

    @Value("${order.rpc.reply.queue}")
    private String replyQueue;

    @Override
    public Order save(OrderDTO orderDTO) {
        Order order = OrderMapper.INSTANCE.toEntity(orderDTO);
        List<OrderItemDTO> orderItemDTOList = orderDTO.getOrderItemDTOList();
        requestRPC.send("PRODUCT_VARIANT_RPC", new RPCPayload(RPCEventType.RESERVE_PRODUCT.getValue(), orderItemDTOList), UUID.randomUUID().toString());
//        System.out.println(order);
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

//    public boolean processOrder(OrderDTO orderDTO) {
//        Order order = OrderMapper.INSTANCE.toEntity(orderDTO);
//        List<OrderItemDTO> orderItemDTOList = orderDTO.getOrderItemDTOList();
//
//        // Create request message
//        RPCPayload requestPayload = new RPCPayload();
//        requestPayload.setType(RPCEventType.RESERVE_PRODUCT.getValue());
//        requestPayload.setData(Map.of("productVariantList", orderItemDTOList));
//        String correlationId = UUID.randomUUID().toString();
//        rabbitTemplate.convertSendAndReceive(rabbitMQConfig.exchange, rabbitMQConfig.routingKey, requestPayload, message -> {
//            message.getMessageProperties().setCorrelationId(correlationId);
//            return message;
//        });
//
////        ResponseEntity<String> response = rabbitTemplate.receiveAndConvert(replyQueue, correlationId);
//
//        System.out.println(order);
//        return false;
//    }
}
