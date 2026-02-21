<<<<<<< HEAD
if(!process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require('express');
const path = require('path');
const methodOveride = require('method-override');
const port = 3000;
const app = express();
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError.js');
const ejsMate = require('ejs-mate');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const User = require('./models/user.js');
const dbUrl = process.env.ATLASDB_URL;
const passport = require('passport')
const localStrategy = require('passport-local');

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
})
store.on('error',(err)=>{
    console.log('error in MONGO SESSION STORE',err);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 60 *60*1000,
        maxAge : 60*60*1000,
    }
};


main().then(()=>{console.log('connection succesful')})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOveride('_method'));
app.engine('ejs',ejsMate)


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('Success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})



app.use('/listings',listingRoutes);
app.use('/listings/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

// request other than above routes
app.use((req,res,next)=>{
    throw new ExpressError(404,'page not found');
})


app.use((err,req,res,next)=>{
    res.status(err.statusCode || 500).render('error.ejs',{err});
    
})
app.listen(port,(req,res)=>{
    console.log('app is listening');
})
=======
// New line 
>>>>>>> 0dff99a0927e376b39d23b87adf3ce76f3f6a686
