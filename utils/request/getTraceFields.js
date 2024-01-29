export const getTraceFields = (req) => {
  return {
    requestId: req.id,
    requestPath: req.path,
    sessionId: req.headers['x-session-id'],
  };
};
