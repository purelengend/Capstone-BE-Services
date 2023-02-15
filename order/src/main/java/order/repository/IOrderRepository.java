package order.repository;

import order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository

public interface IOrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByUserId(String userId);
    @Transactional
    void deleteAllByUserId(String userId);
}
