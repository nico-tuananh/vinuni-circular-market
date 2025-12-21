package com.vinuni.circularmarket.converter;

import com.vinuni.circularmarket.model.ListingStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ListingStatusConverter implements AttributeConverter<ListingStatus, String> {

    @Override
    public String convertToDatabaseColumn(ListingStatus attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase();
    }

    @Override
    public ListingStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return ListingStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle database values
            switch (dbData.toLowerCase()) {
                case "available": return ListingStatus.AVAILABLE;
                case "reserved": return ListingStatus.RESERVED;
                case "sold": return ListingStatus.SOLD;
                case "borrowed": return ListingStatus.BORROWED;
                default: throw new IllegalArgumentException("Unknown database value: " + dbData);
            }
        }
    }
}
