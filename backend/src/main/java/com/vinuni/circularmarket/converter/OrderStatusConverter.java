package com.vinuni.circularmarket.converter;

import com.vinuni.circularmarket.model.OrderStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(OrderStatus attribute) {
        if (attribute == null) return null;
        return attribute.name().toUpperCase();
    }

    @Override
    public OrderStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        // Convert to uppercase if needed and try enum valueOf
        String upperCase = dbData.toUpperCase().trim();
        try {
            return OrderStatus.valueOf(upperCase);
        } catch (IllegalArgumentException e) {
            // Fallback: handle any case variations
            switch (upperCase) {
                case "REQUESTED": return OrderStatus.REQUESTED;
                case "CONFIRMED": return OrderStatus.CONFIRMED;
                case "REJECTED": return OrderStatus.REJECTED;
                case "CANCELLED": return OrderStatus.CANCELLED;
                case "COMPLETED": return OrderStatus.COMPLETED;
                default: 
                    throw new IllegalArgumentException("Unknown OrderStatus database value: '" + dbData + "'. Valid values are: REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED");
            }
        }
    }
}

