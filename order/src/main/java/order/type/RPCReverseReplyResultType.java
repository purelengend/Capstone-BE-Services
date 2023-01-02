package order.type;

public enum RPCReverseReplyResultType {
    SUCCESS("SUCCESS"),
    FAILED("FAILED");

    private final String value;

    RPCReverseReplyResultType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

}
