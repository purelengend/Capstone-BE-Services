package order.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class RabbitMQConfig {
//    @Value("${order.rpc.request.queue}")
//    public String requestQueue;
//
//    @Value("${order.rpc.reply.queue}")
//    public String replyQueue;
//
//    @Value("${order.rpc.exchange}")
//    public String exchange;
//
//    @Value("${order.rpc.routing.key}")
//    public String routingKey;
//
//    @Bean
//    public Queue requestQueue() {
//        return new Queue(requestQueue, true);
//    }
////
////    @Bean
////    public Queue replyQueue() {
////        return new Queue(replyQueue, true);
////    }
//
//    @Bean
//    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
//        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
//        rabbitTemplate.setReplyTimeout(6000);
////        rabbitTemplate.setReceiveTimeout(60000);
//        return rabbitTemplate;
//    }
}
