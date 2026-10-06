package com.onesapro.exam.employee.exception;

import java.util.Map;

public record ApiError(int status, String message, Map<String, String> fieldErrors) {}