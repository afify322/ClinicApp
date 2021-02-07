const passport=require("passport")
const LocalStrategy =require("passport-local").Strategy
let bcrypt=require("bcryptjs")
const User=require("../models/admin")


const User=require("../model/user")



const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {

    User.findOne({ email: username })
        .then((user) => {
           

            if (!user) {
               
                return done(null, false) }
            
            const isValid = bcrypt.compare(password,user.password);
            
            if (isValid) {
           //     require.user=user;
                
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });

}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});