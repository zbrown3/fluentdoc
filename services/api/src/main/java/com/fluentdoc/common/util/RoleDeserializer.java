package com.fluentdoc.common.util;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Deserializes role names from either a JSON string array or Spring Security's {@code {"authority":"ROLE_x"}} objects.
 */
public class RoleDeserializer extends StdDeserializer<List<String>> {

    public RoleDeserializer() {
        super(List.class);
    }

    @Override
    public List<String> deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException, JacksonException {
        List<String> roles = new ArrayList<>();
        JsonNode root = jsonParser.getCodec().readTree(jsonParser);
        if (!root.isArray()) {
            return roles;
        }
        for (JsonNode node : root) {
            if (node.isTextual()) {
                roles.add(node.asText());
            } else if (node.isObject() && node.has("authority")) {
                roles.add(node.get("authority").asText());
            }
        }
        return roles;
    }
}
