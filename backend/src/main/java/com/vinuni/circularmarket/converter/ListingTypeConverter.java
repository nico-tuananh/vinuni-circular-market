package com.vinuni.circularmarket.converter;

import com.vinuni.circularmarket.model.ListingType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ListingTypeConverter implements AttributeConverter<ListingType, String> {

    @Override
    public String convertToDatabaseColumn(ListingType attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase();
    }

    @Override
    public ListingType convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return ListingType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle database values
            switch (dbData.toLowerCase()) {
                case "sell": return ListingType.SELL;
                case "lend": return ListingType.LEND;
                default: throw new IllegalArgumentException("Unknown database value: " + dbData);
            }
        }
    }
}
