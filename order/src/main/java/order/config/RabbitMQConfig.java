package order.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.AsyncRabbitTemplate;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Value("${order.rpc.request.queue}")
    public String requestQueue;
    @Value("${order.rpc.reply.queue}")
    public String replyQueue;
    @Value("${order.rpc.exchange}")
    public String exchangeName;
    @Value("${spring.rabbitmq.addresses}")
    public String addressUrl;
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setUri(addressUrl);
        return factory;
    }
    @Bean
    public MessageConverter producerJackson2MessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    @Bean
    public Queue replyQueue() {
        return new Queue(replyQueue, true);
    }
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchangeName, true, false);
    }
    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setReplyTimeout(6000);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());
        rabbitTemplate.setUseTemporaryReplyQueues(true);
        rabbitTemplate.setExchange(exchange().getName());
//        rabbitTemplate.setReceiveTimeout(60000);
        return rabbitTemplate;
    }

    @Bean
    public AsyncRabbitTemplate asyncRabbitTemplate(RabbitTemplate rabbitTemplate) {
        AsyncRabbitTemplate asyncRabbitTemplate = new AsyncRabbitTemplate(rabbitTemplate);

        return asyncRabbitTemplate;
    }
    @Bean
    public Binding bindingRPCReplyQueue(final Queue queue, final DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("<routing-key>");
    }

    @Bean
    public RabbitAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }
}
