import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized.Login Again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id && tokenDecode.role === "ADMIN") {
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Not Authorized. Invalid token.",
    });
  }
};

export default adminAuth;
