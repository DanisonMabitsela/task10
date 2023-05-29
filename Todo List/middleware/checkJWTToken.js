const checkJWTToken = (req, res, next) => {
  // Get the JWT token from the request headers.
  const token = req.headers.authorization;
  if (req.url === "/favicon.ico") {
    next();
    return;
  }

  // If the token is not present, return an unauthorized error.
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  // Try to parse the JWT token.
  try {
    const decoded = jwt.verify(token, "secret");
  } catch (err) {
    // If the token is invalid, return an unauthorized error.
    res.status(401).send("Unauthorized");
    return;
  }

  // Check if the user's username ends with the substring 'gmail.com'.
  if (!decoded.username.endsWith("@gmail.com")) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Check if the task exceeds 140 characters.
  if (req.body.title.length > 140) {
    res.status(400).send("Task cannot exceed 140 characters");
    return;
  }

  // Check if the request is of the JSON content type.
  if (req.headers["content-type"] !== "application/json") {
    res.status(415).send("Unsupported media type");
    return;
  }

  // Next middleware function.
  next();
};
