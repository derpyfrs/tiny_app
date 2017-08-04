var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomNumber() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  if (urlDatabase.hasOwnProperty(text)) {
    this.generateRandomNumber();
  }
  return text;
}

function generateRandomId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  if (urlDatabase.hasOwnProperty(text)) {
    this.generateRandomNumber();
  }
  return text;
}

console.log(urlDatabase);

app.get("/", (req, res) => {
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userName: req.cookies['username']
  };
  res.render("urls_index", {
    templateVars: templateVars
});
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userName: req.cookies['username']
  };
  res.render("urls_register", {
    templateVars: templateVars
});
});

app.post("/login", (req, res) => {

  console.log("Logging in for ", req.body.login);
  res.cookie('username', req.body.login)
  console.log(req.cookies);
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  let usersId = generateRandomId();

  res.cookie('email', req.body.email);
  res.cookie('password', req.body.password);
  let newUserPool = req.body.email;
  // console.log(newUserPool);
  users[usersId] = {
    id :  usersId,
    email : req.body.email,
    password : req.body.password
  };
  console.log('password type of', typeof(req.body.password));
  // users.newUserPool = req.body.email;
  // users.newUserPool = req.body.password;
  console.log(usersId);
  console.log("register",req.cookies);
  console.log(users);

  if( req.body.email && req.body.password ) {
  res.redirect('/urls');
  } else
  res.status(400).send('error 400');
});

app.post("/logout", (req, res) => {
console.log("Logging out for ", req.body.login);
  res.clearCookie('username', req.body.login);
  res.clearCookie('password', req.body.password);
  res.clearCookie('email', req.body.email);
  console.log(req.cookies);
  res.redirect('/urls');
});


app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['username']}
  res.render("urls_new", {
    templateVars: templateVars
});
});

app.get("/urls/:id/update", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['username'] };
  urlDatabase[req.params.id] = req.body.longURL;

  res.render("urls_show", {
    templateVars: templateVars
});
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['username'] };
  res.render("urls_show", {
    templateVars: templateVars
});
});


app.post("/urls", (req, res) => {
  console.log('this is', req.body);  // debug statement to see POST parameters
  var shortUrl = generateRandomNumber();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(`${longURL}`);
  console.log(longURL)

});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
})

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
});