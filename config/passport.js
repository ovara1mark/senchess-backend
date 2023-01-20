const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/google");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "523464582816-rf87iinlf6s6c6t60lu9erovvd0bql6o.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/auth/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
