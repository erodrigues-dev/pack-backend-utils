const getRequestIp = (req) => {
  const forwardedForIp = req.headers['x-forwarded-for']?.split(',')[0].trim();

  if (forwardedForIp) return forwardedForIp;

  const IP_MIN_LENGTH = 7;
  if (req.ip?.length >= IP_MIN_LENGTH) return req.ip;

  if (req.connection?.remoteAddress?.length >= IP_MIN_LENGTH)
    return req.connection.remoteAddress;

  return null;
};
