package com.vinuni.circularmarket.converter;

import com.vinuni.circularmarket.model.ListingCondition;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ListingConditionConverter implements AttributeConverter<ListingCondition, String> {

    @Override
    public String convertToDatabaseColumn(ListingCondition attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase().replace("_", "_");
    }

    @Override
    public ListingCondition convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return ListingCondition.valueOf(dbData.toUpperCase().replace(" ", "_").replace("-", "_"));
        } catch (IllegalArgumentException e) {
            // Handle database values
            switch (dbData.toLowerCase()) {
                case "new": return ListingCondition.NEW;
                case "like_new": return ListingCondition.LIKE_NEW;
                case "used": return ListingCondition.USED;
                default: throw new IllegalArgumentException("Unknown database value: " + dbData);
            }
        }
    }
}
