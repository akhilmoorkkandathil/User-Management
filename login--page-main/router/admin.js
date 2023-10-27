const express = require("express");
const mongoose = require("mongoose");
const { usersModel } = require("./router");
const bcrypt = require("bcrypt");

const adrouter = express.Router();

adrouter.use(express.urlencoded({ extended: true }));

// connecting mongoose
mongoose.connect("mongodb://127.0.0.1:27017/users").then(console.log("done"));
const userschema = new mongoose.Schema({
  username: String,
  password: String,
});
// creating model 
const adminsModel = new mongoose.model("admins", userschema);
// authentication checking function 
function adsignin(req, res, next) {
  if (req.session.isadAuth) {
    next();
  } else {
    res.redirect("/admin");
  }
}
// first route 
adrouter.get("/", async (req, res) => {
  if (req.session.isadAuth) {
    res.redirect("/admin/adhome");
  } else {
    res.render("admin");
  }
});

function middleware(err,req,res,next)
{
  if(err){
    res.send('Error')
  }
  else if(req.body.email==='abc@gmail.com'){
    next()
  }
}
// admin login route  
adrouter.post("/adminlogin",middleware, async (req, res) => {
  try {
    // email checking
    const data = await adminsModel.findOne({ username: req.body.username });
    if (data.username == req.body.username) {
      if (data.password == req.body.password) {

        req.session.isadAuth = true;
        res.redirect("/admin/adhome");
      } else {
        res.render("admin", { perror: "invalid password" });
      }
    } else {
      res.render("admin", { perror: "invalid username" });
    }
  } catch {
    const error = "bug indu mwoney";
    console.log(error);
  }
});
// admin logout route 
adrouter.get("/adminlogout", (req, res) => {
  req.session.isadAuth = false;
  req.session.destroy();
  res.redirect("/admin");
});
// admin adduser route 
adrouter.route("/adduser").get(adsignin, (req, res) => {
  res.render("adduser");
});
// admin aduser submission route 
adrouter.post("/adusersubmit", adsignin, async (req, res) => {
  if (req.session.isadAuth) {
    const emailexist = await usersModel.findOne({ email: req.body.email });
    if (emailexist) {
      res.render("adduser", { emailsexist: "e-mail already exist" });
    } else {
      const { username, email, password } = req.body;
      const hashedpassword = await bcrypt.hash(req.body.password, 10);
      await usersModel.insertMany([
        { username: username, email: email, password: hashedpassword },
      ]);
      res.redirect("/admin/adhome");
    }
  } else {
    res.redirect("/admin");
  }
});
// admin home route 
adrouter.route("/adhome")
  .get(adsignin, async (req, res) => {
    if (req.session.isadAuth) {
      const data = await usersModel.find({});
      res.render("adminpanel", { users: data });
    } else {
      res.redirect("/admin");
    }
  })
  .post(adsignin, async (req, res) => {
    if (req.session.isadAuth) {
      const name = req.body.search;
      const data = await usersModel.find({
        username: { $regex: new RegExp(name, "i") },
      });
      res.render("adminpanel", { users: data });
    } else {
      res.redirect("/admin");
    }
  });
adrouter.get("/delete/:email", adsignin, async (req, res) => {
  if (req.session.isadAuth) {
    const userid = req.params.email;
    await usersModel.deleteOne({ email: userid });
    res.redirect("/admin/adhome");
  } else {
    res.redirect("/admin/adhome");
  }
});
adrouter.get("/update/:email", adsignin, async (req, res) => {
  if (req.session.isadAuth) {
    const useremail = req.params.email;
    const user = await usersModel.findOne({ email: useremail });
    res.render("update", { data: user });
  } else {
    res.redirect("/admin");
  }
});
adrouter.post("/update/:email", adsignin, async (req, res) => {
  if (req.session.isadAuth) {
    const useremail = req.params.email;
    const emailexist=await usersModel.findOne({$and:[{email:req.body.email},{email:{$ne:useremail}}]})
    if(emailexist)
    {
      res.render("update",{emailsexist:"Email already exists"})
    }
    else
    {
    await usersModel.updateOne(
      { email: useremail },
      { username: req.body.username, email: req.body.email }
    )
    res.redirect("/admin/adhome");
    }
  } 
  else
  {
    res.redirect("/admin");
  }
});

module.exports = adrouter;
