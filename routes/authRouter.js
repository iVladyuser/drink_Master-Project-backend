const express = require("express");
const validateBody = require("../middlewares/validateBody");
const schema = require("../schemas/userSchemas");
const authenticate = require("../middlewares/authenticate");
const ctrl = require("../controllers/userControllers");

const authRouter = express.Router();

authRouter.post("/signup", validateBody(schema.signupSchema), ctrl.signupUser);

authRouter.post("/signin", validateBody(schema.signinSchema), ctrl.signinUser);

authRouter.post("/logout", authenticate, ctrl.logoutUser);

module.exports = authRouter;
