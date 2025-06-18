import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
//  console.log("✅ Decoded token:", decoded);
    // Attach user info from token
    req.user = {
      id: decoded.id,           
      role: decoded.role,       
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
