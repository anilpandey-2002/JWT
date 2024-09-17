// one middleware for all token code
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers; //token is send through header as frontensd req.header contain all req it get
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from header
      token = authorization.split(" ")[1];

      //   it tells how to authorize
      //   console.log("authorization", authorization);
      //   console.log("token", token);

      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Get User from Token
      req.user = await UserModel.findById(userID).select("-password"); //password ka alwa sab dega

      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};

export default checkUserAuth;
