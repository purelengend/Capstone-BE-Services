package order.mapper;

import order.dto.OrderItemDTO;
import order.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderItemMapper {

    OrderItemMapper INSTANCE = Mappers.getMapper(OrderItemMapper.class);

    OrderItem toEntity(OrderItemDTO orderItemDTO);

    OrderItemDTO toDTO(OrderItem orderItem);


}
