import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import User from "../models/User.js";
import fetch from "node-fetch"; // npm install node-fetch

// --- Google Strategy (unchanged) ---
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              oauthProvider: "google",
              profilePic: profile.photos?.[0]?.value || "",
            });
          } else if (!user.profilePic && profile.photos?.[0]?.value) {
            user.profilePic = profile.photos[0].value;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          return done(err, false);
        }
      }
    )
  );
}

// --- GitHub Strategy (fixed for private emails) ---
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"], // request emails
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value;

          // If email is missing (private), fetch primary email from GitHub API
          if (!email) {
            const response = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github+json",
              },
            });
            const emails = await response.json();
            const primary = emails.find((e) => e.primary) || emails[0];
            email = primary?.email || `${profile.username}@github.com`;
          }

          let user = await User.findOne({ email });

          if (!user) {
  user = await User.create({
    name: profile.displayName || profile.username,
    email,
    oauthProvider: "github",
    profilePic: profile.photos?.[0]?.value || "",
  });
} else {
  // Always update avatar to latest provider
  user.profilePic = profile.photos?.[0]?.value || user.profilePic;
  user.oauthProvider = "github"; // optional, track last provider
  await user.save();
}


          return done(null, user);
        } catch (err) {
          console.error("GitHubStrategy error:", err);
          return done(err, false);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️ GitHub OAuth not configured. Missing CLIENT_ID or CLIENT_SECRET."
  );
}

export default passport;
