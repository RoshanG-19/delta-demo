const User = require('../models/user.js');


module.exports.renderSignupForm = (req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signup = async (req,res)=>{
  try{
      let{username,email,password} = req.body;
    const newUser = await new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err) {
            return next(err)
        }
         req.flash('Success','Registed Successfully');
        res.redirect('/listings');
    })
   
  }catch(e){
    req.flash('error',e.message);
    return res.redirect('/signup');
  }
}


module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.login = async(req,res)=>{
    req.flash('Success','Logined SuccessFull');
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err)  return next(err);
        req.flash('Success','logged out successfully');
        res.redirect('/listings');
    })
}