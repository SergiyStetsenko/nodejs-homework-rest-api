const { Router } = require("express");
const { asuncWrapper } = require("../helpers/asunc_wrapper");
const {
  validateLogin,
  validateUserAuth,
  subscriptionValid,
} = require("../helpers/userValidate");
const { authService } = require("./userService");
const { prepereUser } = require("../auth/user_serialize");
const { prepareUserWithToken } = require("../auth/auth_serializer");
const { authorize } = require("../auth/authorization");

const router = Router();

router.post(
  "/users/signup",
  validateUserAuth,
  asuncWrapper(async (req, res, next) => {
    const user = await authService.singUpUser(req.body);
    return res.status(201).send(prepereUser(user));
  })
);

router.post(
  "/users/login",
  validateLogin,
  asuncWrapper(async (req, res, next) => {
    const userWithToken = await authService.singLogin(req.body);
    return res.status(200).send(prepareUserWithToken(userWithToken));
  })
);

router.post(
  "/users/logout",
  authorize,
  asuncWrapper(async (req, res, next) => {
    await authService.logout(req.user);
    return res.status(200).send("user is logout");
  })
);

router.get("/users/current", authorize, (req, res, next) => {
  const { email, username, subscription } = req.user;

  res.status(200).send({ email, username, subscription });
});

router.patch("/users/subs", subscriptionValid, async (req, res, next) => {
  await authService.subscripStat(req.body);
  return res.status(200).send(req.body);
});

module.exports = router;
