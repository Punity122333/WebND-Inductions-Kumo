export default function errorHandler(err, req, res, next) {
  const code = err.statusCode || err.status || 500;
  let msg = err.message || "Something went wrong";
  if (code === 404) {
    msg = err.message || "Anime not found";
  }
  if (code === 429) {
    msg = "Too many requests, try again in a moment";
  }
  if (code === 502) {
    msg = "Upstream service failed, try again later";
  }
  if (code === 504) {
    msg = "Upstream request timed out, try again";
  }
  const body = {
    error: true,
    message: msg,
    status: code
  };
  res.status(code).json(body);
}

export function toHttpError(e) {
  if (e && e.statusCode) {
    return e;
  }
  const err = new Error("Request failed");
  if (e.code === "ECONNABORTED") {
    err.statusCode = 504;
    err.message = "Upstream request timed out, try again";
    return err;
  }
  if (!e.response) {
    err.statusCode = 502;
    err.message = "Upstream service failed, try again later";
    return err;
  }
  const s = e.response.status;
  if (s === 404) {
    err.statusCode = 404;
    err.message = "Anime not found";
    return err;
  }
  if (s === 429) {
    err.statusCode = 429;
    err.message = "Too many requests, try again in a moment";
    return err;
  }
  err.statusCode = s >= 500 ? 502 : s;
  const apiMsg = e.response.data && e.response.data.message;
  err.message = apiMsg || "Failed to fetch anime data";
  return err;
}
