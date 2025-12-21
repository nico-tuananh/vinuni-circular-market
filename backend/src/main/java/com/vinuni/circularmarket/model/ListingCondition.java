package com.vinuni.circularmarket.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingCondition {
    NEW,
    LIKE_NEW,
    USED;

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase().replace("_", "_");
    }

    @JsonCreator
    public static ListingCondition fromValue(String value) {
        if (value == null) return null;
        try {
            return ListingCondition.valueOf(value.toUpperCase().replace(" ", "_").replace("-", "_"));
        } catch (IllegalArgumentException e) {
            // Try manual mapping for database values
            switch (value.toLowerCase()) {
                case "new": return NEW;
                case "like_new":
                case "like-new": return LIKE_NEW;
                case "used": return USED;
                default: throw new IllegalArgumentException("Unknown enum value: " + value);
            }
        }
    }
}