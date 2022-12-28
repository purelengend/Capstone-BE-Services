package order.message;

import lombok.AllArgsConstructor;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RequestRPC {
    private final RabbitTemplate rabbitTemplate;

    public void send(String queue, RPCPayload payload, String correlationId) {
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setCorrelationId(correlationId);

        rabbitTemplate.setUseTemporaryReplyQueues(true);
        rabbitTemplate.convertAndSend(queue, "payload", message -> {
            message.getMessageProperties().setCorrelationId(correlationId);
            System.out.println(message.getMessageProperties());
            return message;
        });
    }
}
