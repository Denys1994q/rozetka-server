import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import UserModel from "./models/User.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://rozetka-server.onrender.com/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
            };

            try {
                let user = await UserModel.findOne({ email: profile.emails[0].value });

                if (user) {
                    done(null, user);
                } else {
                    user = await UserModel.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.log(err);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: "https://rozetka-server.onrender.com/facebook/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const words = profile.displayName.split(" ");
            const newUser = {
                name: words[0],
                surname: words[1],
                email: " ",
                phone: " ",
            };

            try {
                let user = await UserModel.findOne({ name: words[0], surname: words[1] });
                console.log('user', user)

                if (user) {
                    done(null, user);
                } else {
                    user = await UserModel.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.log(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    // console.log("serialize", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // console.log("deserialize", user);
    done(null, user);
});

export default passport;
