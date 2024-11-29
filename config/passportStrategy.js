const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { Patient } = require("../Model/patient");

module.exports = function () {
  const callback = async (email, pass, done) => {
    const user = await Patient.findOne({ userEmail: email });

    try {
      if (!user) {
        return done(null, false, {message : "No User record Found!" });
      }
      if (!bcrypt.compareSync(pass, user.userPass)) {
        return done(null, false, {message : "Invalid Username or PassWord!" });
      }

      return done(null, user);
    } catch (err) {
      console.log(err);
    }
  }; // verify callback function....


    // using LocalStrategy authentication....
  passport.use(new LocalStrategy({ usernameField: "email" }, callback));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    await Patient.findById(id , function (err, user) {
      done(err, user);
    });
  });


};
