import NodeCache from "node-cache";

const cache = new NodeCache();

const cachey = (duration) => (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  //check if key exists in cache
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  //if exists/send cache result
  if (cachedResponse) {
    res.send(cachedResponse);
  } else {
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};

export { cachey };
