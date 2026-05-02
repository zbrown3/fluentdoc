package com.fluentdoc.export.util;

import java.io.ByteArrayOutputStream;

// CODE HIGHLIGHT: EXPORTED DOCUMENT CLASS AS RECORD
// The ExportedDocument record is a lightweight, immutable data holder
// used to store the file name and content stream for a generated PDF or document.
// Since it has no behavior and only carries data, using a record makes sense here.
public record ExportedDocument(String fileName, ByteArrayOutputStream content) {}
