const express=require("express");
const multer=require("multer");
const fs=require("fs");
const bcrypt=require("bcrypt");
const session=require("express-session");

const app=express();
const PORT=3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({secret:"game-universe",resave:false,saveUninitialized:true}));
app.use(express.static("public"));
app.use("/games",express.static("games"));

if(!fs.existsSync("users.json"))fs.writeFileSync("users.json","{}");
if(!fs.existsSync("games"))fs.mkdirSync("games");

const upload=multer({dest:"games/"});

app.post("/register",(req,res)=>{
 const users=JSON.parse(fs.readFileSync("users.json"));
 users[req.body.username]={password:bcrypt.hashSync(req.body.password,10),admin:Object.keys(users).length===0};
 fs.writeFileSync("users.json",JSON.stringify(users,null,2));
 res.redirect("/login.html");
});

app.post("/login",(req,res)=>{
 const users=JSON.parse(fs.readFileSync("users.json"));
 const u=users[req.body.username];
 if(!u||!bcrypt.compareSync(req.body.password,u.password))return res.send("Invalid");
 req.session.user=req.body.username;
 res.redirect("/");
});

app.post("/upload",upload.single("game"),(req,res)=>{
 if(!req.session.user)return res.send("Login required");
 res.send("Uploaded!");
});

app.get("/games-list",(req,res)=>{
 res.json(fs.readdirSync("games"));
});

app.listen(PORT,()=>console.log("Game Universe running"));
