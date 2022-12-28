package order.message;

public enum RPCEventType {
    RESERVE_PRODUCT("RESERVE_PRODUCT");

    RPCEventType(String value) {
        this.value = value;
    }

    private final String value;

    public String getValue() {
        return value;
    }
}
