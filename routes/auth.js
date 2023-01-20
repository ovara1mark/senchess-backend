// required packages
const express = require("express");
const passport = require("passport");

// required controllers
const authController = require("../controllers/auth");

// global router variable
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
// router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// // @desc    Google auth callback
// // @route   GET /auth/google/callback
// router.get(
//   "/google/redirect",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("admin/add-product");
//   }
// );

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/admin/add-product");
  }
);

// get login route
router.get("/login", authController.getLogin);

// get signup route
router.get("/signup", authController.getSignup);

// post login route
router.post("/login", authController.postLogin);

// post signup route
router.post("/signup", authController.postSignup);

// post logout route
router.post("/logout", authController.postLogout);

module.exports = router;
