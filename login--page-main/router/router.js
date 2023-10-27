const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// connecting mongoose
mongoose.connect("mongodb://127.0.0.1:27017/users").then(console.log("done"));
const userschema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const usersModel = new mongoose.model("details", userschema);

function signin(req, res, next) {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
}

// login pgae
router.get("/", async (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/home");
  }
  else if(req.session.isadAuth){
    res.redirect("/admin")
  } 
  else {
    res.render("login");
  }
});
// signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});
// login process
router.post("/login", async (req, res) => {
  try {
    const data = await usersModel.findOne({ username: req.body.username });
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      data.password
    );
    if (passwordMatch) {
      req.session.username = req.body.username;
      req.session.isAuth = true;
      res.redirect("/home");
    } 
    else 
    {
      res.render("login", { perror: "Invalid password" });
    }
  } catch {
    res.render("login", { unerror: "Invalid username" });
  }
});
// signup data collection
router.post("/sign", async (req, res) => {
  const emailexist = await usersModel.findOne({ email: req.body.email });
  if (emailexist) {
    res.render("signup", { emailexist: "e-mail already exist" });
  } else {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const { username, email, password } = req.body;
    await usersModel.insertMany([
      { username: username, email: email, password: hashedpassword },
    ]);
    res.redirect("/");
  }
});
router.get("/home", signin, (req, res) => {
  if (req.session.isAuth) {
    const cardContents=[
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://img.freepik.com/free-photo/majestic-mountain-range-tranquil-scene-dawn-generated-by-ai_188544-30834.jpg"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://static.toiimg.com/photo/msid-89349701,width-96,height-65.cms"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkcmlkfGVufDB8fDB8fHww&w=1000&q=80"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://img.freepik.com/free-photo/majestic-mountain-range-tranquil-scene-dawn-generated-by-ai_188544-30834.jpg"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
      },
      {
        title:"india",
        text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
        urlimg:"https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
      }
    ]
    res.render("home",{cardContents});
  } else {
    res.redirect("/");
  }
});
router.get("/logout", (req, res) => {
  req.session.isAuth = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = { router, usersModel };
