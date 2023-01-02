package order.message.type;

public enum RPCEventType {
    RESERVE_PRODUCT_VARIANT("RESERVE_PRODUCT_VARIANT");

    RPCEventType(String value) {
        this.value = value;
    }

    private final String value;

    public String getValue() {
        return value;
    }
}
