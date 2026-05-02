package com.fluentdoc.user.response;

import com.fluentdoc.user.dto.UserProfileDTO;
import lombok.Data;

import java.util.Map;

@Data
public class DashboardViewResponse {
    private UserProfileDTO user;
    private Map<String, Object> limits;
}
