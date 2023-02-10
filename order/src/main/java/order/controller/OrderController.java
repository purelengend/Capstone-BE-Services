package order.controller;

import order.dto.OrderDTO;
import order.entity.Order;
import order.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/order")
public class OrderController {

    private final IOrderService orderService;

    @Autowired
    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok().body(orderService.findAll());
    }

    @GetMapping(value = "/getAllByUserId/{userId}")
    public ResponseEntity<List<Order>> getAllByUserId(@PathVariable String userId) {
        return ResponseEntity.ok().body(orderService.findAllOrdersByUserId(userId));
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Order> getById(@PathVariable String id) {
        return ResponseEntity.ok().body(orderService.findById(id).get());
    }

    @PostMapping("/create")
    public ResponseEntity<Order> create(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok().body(orderService.save(orderDTO));
    }
}
