package order.message;

import lombok.AllArgsConstructor;
import order.message.type.RPCPayload;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RequestRPC {

    private final RabbitTemplate rabbitTemplate;

    public void send(String queue, RPCPayload payload, String correlationId) {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setCorrelationId(correlationId);

        rabbitTemplate.convertAndSend(queue, "payload", message -> {
            message.getMessageProperties().setCorrelationId(correlationId);
//            message.getMessageProperties().setReplyTo("ORDER_RPC_REPLY");
            System.out.println(rabbitTemplate.getDefaultReceiveQueue());
            return message;
        });
    }

    @RabbitListener(queues = "ORDER_RPC_REPLY")
    @RabbitHandler
    public String observeRPC(String message) {
        System.out.println("Message received: " + message);
        return message;
    }
}
