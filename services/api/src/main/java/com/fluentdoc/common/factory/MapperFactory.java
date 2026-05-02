package com.fluentdoc.common.factory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fluentdoc.user.dto.UserDTO;
import com.fluentdoc.user.model.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MapperFactory {

    public <T> T map(Object source, Class<T> destinationClass) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return mapper.convertValue(source, destinationClass);
    }

    public <T> List<T> map(Iterable<?> source, Class<T> destinationClass) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return mapper.convertValue(source, mapper.getTypeFactory().constructCollectionType(List.class, destinationClass));
    }
}
