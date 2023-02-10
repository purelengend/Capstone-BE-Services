package order.service.implement;

import lombok.RequiredArgsConstructor;
import order.dto.OrderDTO;
import order.dto.OrderItemDTO;
import order.entity.Order;
import order.entity.OrderItem;
import order.mapper.OrderMapper;
import order.message.CustomerOrderSuccessMessage;
import order.message.mapper.RPCRequestProductVariantTypeMapper;
import order.message.type.*;
import order.repository.IOrderRepository;
import order.service.IOrderItemService;
import order.service.IOrderService;
import order.type.OrderStatus;
import order.type.RPCReverseReplyResultType;
import org.springframework.amqp.rabbit.AsyncRabbitTemplate;
import org.springframework.amqp.rabbit.RabbitConverterFuture;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final IOrderRepository orderRepository;
    private final IOrderItemService orderItemService;
//    private final RabbitMQConfig rabbitMQConfig;
//    private final RequestRPC requestRPC;
    private final RabbitTemplate rabbitTemplate;
    private final AsyncRabbitTemplate asyncRabbitTemplate;
    private final ParameterizedTypeReference<RPCResult> typeReference = new ParameterizedTypeReference<>() {};

    @Value("${order.rpc.request.queue}")
    private String requestQueue;

    @Value("${order.rpc.reply.queue}")
    private String replyQueue;

    @Override
    public Order save(OrderDTO orderDTO) {
//        Order order = OrderMapper.INSTANCE.toEntity(orderDTO);
//        List<OrderItemDTO> orderItemDTOList = orderDTO.getOrderItemDTOList();
        return processOrder(orderDTO);
//        requestRPC.send(requestQueue, new RPCPayload(RPCEventType.RESERVE_PRODUCT.getValue(), orderItemDTOList), UUID.randomUUID().toString());
//        System.out.println(order);
//        return null;
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> findAllOrdersByUserId(String userId) {
        return this.orderRepository.findAllByUserId(userId);
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

    public Order processOrder(OrderDTO orderDTO) {
        Order order = saveOrderAsProcessingOrder(orderDTO);
        validateOrderByRPC(order);
        return order;
    }

    private void validateOrderByRPC(Order order) {
        // Create a new message payload
        List<RPCRequestProductVariantType> productVariantList = RPCRequestProductVariantTypeMapper.INSTANCE.map(order.getOrderItemList());
        RPCPayload requestPayload = RPCPayload.builder()
                .type(RPCEventType.RESERVE_PRODUCT_VARIANT.getValue())
                .data(Map.of("productVariantList", productVariantList))
                .build();

        RabbitConverterFuture<RPCResult> future = asyncRabbitTemplate.convertSendAndReceiveAsType("INVENTORY_RPC", requestPayload, typeReference);
        future.whenComplete((response, throwable) -> {
            if (throwable != null) {
                System.out.println("Error: " + throwable.getMessage());
                order.setStatus(OrderStatus.FAILED.getValue());
                order.setMessage(throwable.getMessage());
                save(order);
            } else {
                postProcessReceiveRPCReply(response, order);
                publishCustomerOrderSuccessMessage(order, "REVIEW_SERVICE");
            }
        });
    }

    private void publishCustomerOrderSuccessMessage(Order order, String routingKey) {
        CustomerOrderSuccessMessage message = CustomerOrderSuccessMessage.builder()
                .userId(order.getUserId())
                .productIdList(order.getOrderItemList().stream().map(OrderItem::getProductId).collect(Collectors.toList()))
                .build();
        PublishMessagePayload payload = PublishMessagePayload.builder()
                .event(MessageEventType.CUSTOMER_ORDER_SUCCESS.getValue())
                .data(message)
                .build();
        rabbitTemplate.convertAndSend("CAPSTONE_EXCHANGE", routingKey, payload);
    }

    private void postProcessReceiveRPCReply(RPCResult response, Order order) {
        String status = response.getStatus();
        if (status.equals(RPCReverseReplyResultType.SUCCESS.getValue())) {
            List<OrderItem> updatedOrderItemsList = updateOrderItemsSellingPrice(response.getProductVariantList(), order);
            order.setOrderItemList(updatedOrderItemsList);
            order.setStatus(OrderStatus.SUCCESS.getValue());
        } else {
            order.setStatus(OrderStatus.FAILED.getValue());
        }
        order.setMessage(response.getMessage());
        save(order);
    }

    private List<OrderItem> updateOrderItemsSellingPrice(List<RPCReplyProductVariantType> productVariantList, Order order) {
        Map<String, OrderItem> orderItemMap = order.getOrderItemList().stream()
                .collect(Collectors.toMap(item -> item.getProductId() + item.getColor() + item.getSize(), item -> item));

        for (RPCReplyProductVariantType productVariant : productVariantList) {
            OrderItem orderItem = orderItemMap.get(productVariant.getProductId() + productVariant.getColor() + productVariant.getSize());
            orderItem.setSellingPrice(productVariant.getSellingPrice());
        }
        return orderItemService.updateSellingPriceOfOrderItems(order.getOrderItemList());
    }

    public Order saveOrderAsProcessingOrder(OrderDTO orderDTO) {
        Order order = OrderMapper.INSTANCE.toEntity(orderDTO);
        List<OrderItemDTO> orderItemDTOList = orderDTO.getOrderItemDTOList();
        order.setStatus(OrderStatus.PROCESSING.getValue());
        order = orderRepository.save(order);
        List<OrderItem> orderItemList = orderItemService.saveOrderItemsOfOrder(orderItemDTOList, order);
        order.setOrderItemList(orderItemList);
        return order;
    }
}
