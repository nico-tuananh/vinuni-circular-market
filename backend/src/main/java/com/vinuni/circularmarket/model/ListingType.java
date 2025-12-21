package com.vinuni.circularmarket.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingType {
    SELL,
    LEND;

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }

    @JsonCreator
    public static ListingType fromValue(String value) {
        if (value == null) return null;
        try {
            return ListingType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Try manual mapping
            switch (value.toLowerCase()) {
                case "sell": return SELL;
                case "lend": return LEND;
                default: throw new IllegalArgumentException("Unknown enum value: " + value);
            }
        }
    }
}