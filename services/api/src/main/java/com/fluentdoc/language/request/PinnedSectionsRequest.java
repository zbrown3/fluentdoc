package com.fluentdoc.language.request;

import com.fluentdoc.language.dto.PinnedSectionDTO;
import lombok.Data;

import java.util.List;

@Data
public class PinnedSectionsRequest {
    private List<PinnedSectionDTO> pinnedSections;
}
