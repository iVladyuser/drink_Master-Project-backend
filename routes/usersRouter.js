const express = require("express");
const ctrl = require("../controllers/userControllers");
const validateBody = require("../middlewares/validateBody");
const schema = require("../schemas/userSchemas");
const authenticate = require("../middlewares/authenticate");
const storage = require("../middlewares/upload");

const usersRouter = express.Router();

usersRouter.get("/current", authenticate, ctrl.getCurrent);

usersRouter.patch(
	"/avatar",
	authenticate,
	storage.single("avatar"),
	ctrl.updateAvatar
);
usersRouter.patch(
	"/",
	authenticate,
	validateBody(schema.subscriptionListSchema),
	ctrl.updateSubscription
);

module.exports = usersRouter;
