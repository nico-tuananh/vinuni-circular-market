package com.vinuni.circularmarket.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingStatus {
    AVAILABLE,
    RESERVED,
    SOLD,
    BORROWED;

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }

    @JsonCreator
    public static ListingStatus fromValue(String value) {
        if (value == null) return null;
        try {
            return ListingStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Try manual mapping
            switch (value.toLowerCase()) {
                case "available": return AVAILABLE;
                case "reserved": return RESERVED;
                case "sold": return SOLD;
                case "borrowed": return BORROWED;
                default: throw new IllegalArgumentException("Unknown enum value: " + value);
            }
        }
    }
}