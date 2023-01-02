package order.message.mapper;

import order.entity.OrderItem;
import order.message.type.RPCRequestProductVariantType;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;

import java.util.List;

import static org.mapstruct.factory.Mappers.getMapper;

@Mapper
public interface RPCRequestProductVariantTypeMapper {
    RPCRequestProductVariantTypeMapper INSTANCE = getMapper(RPCRequestProductVariantTypeMapper.class);

    RPCRequestProductVariantType map(OrderItem orderItem);
//    @IterableMapping(elementTargetType = RPCRequestProductVariantType.class)
    List<RPCRequestProductVariantType> map(List<OrderItem> orderItemList);
}
