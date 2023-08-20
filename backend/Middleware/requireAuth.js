const jwt = require("jsonwebtoken");
const User = require("../Users/UserModel");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id: id }).select("_id role");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    console.log(role, req.user);
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
