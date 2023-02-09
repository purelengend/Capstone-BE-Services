package order.message.type;

public enum MessageEventType {
    CUSTOMER_ORDER_SUCCESS("CUSTOMER_ORDER_SUCCESS");

    MessageEventType(String value) {
        this.value = value;
    }

    private final String value;

    public String getValue() {
        return value;
    }
}
