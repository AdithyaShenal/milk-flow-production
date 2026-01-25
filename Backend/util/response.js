export function successResponse(res, data, status = 200) {
  return res.status(status).json(data);
}
