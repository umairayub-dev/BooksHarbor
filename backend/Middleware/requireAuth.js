const jwt = require("jsonwebtoken");
const User = require("../Users/UserModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id, tokenVersion } = jwt.verify(token, process.env.SECRET);

    // Verify token version against the stored version in user's record
    const user = await User.findOne({ _id: id }).select("_id role tokenVersion");
    console.log(user);
    if (!user || user.tokenVersion !== tokenVersion) {
      console.log(user.tokenVersion, tokenVersion);
      return res.status(401).json({ error: "Unauthorized request" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized request" });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role !== role) {
      return res.status(403).json({ error: "Access forbidden" });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
