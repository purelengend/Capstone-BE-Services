package order.mapper;

import order.dto.OrderDTO;
import order.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    Order toEntity(OrderDTO orderDTO);

    OrderDTO toDTO(Order order);
}
