/**
 * Standardized API Response Helper
 */
export function successResponse(res, data = {}, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
}

export function errorResponse(res, error = "Something went wrong.", statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}
