const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth').OAuth2Strategy


  
  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback",
    scope:["profile","email"],
  },
  function(accessToken,refreshToken,profile,callback){
    callback(null,profile)
  }
  
  ))

  passport.serializeUser((user,done)=>{
    done(null,user)
  })

  
  passport.deserializeUser((user,done)=>{
    done(null,user)
  })