var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var users = {
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id/update", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id] };
  urlDatabase[req.params.id] = req.body.longURL;
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.status(301).redirect(`${longURL}`);
});

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("login", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log('this is', req.body);  // debug statement to see POST parameters
  var shortUrl = generateRandomNumber();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  var verification = [false, null];
  var responseTemplate = "<p> Wrong username or password! </p> <br /> <a href='/login'><button>Back to log in</button></a>";

  Object.keys(users).forEach(function(id) {
    if (req.body.username === users[id].username && req.body.password === users[id].password) {
      verification = [true, id];
    }
  });

  verification[0] ? res.cookie('user_id', verification[1]).redirect('/urls') : res.status(403).send(responseTemplate);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id').redirect('/urls');
})

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  var userId = generateRandomNumber();
  var usernameAvailable = true;

  Object.keys(users).forEach(function(id) {
    if (req.body.username === users[id].username) {
      usernameAvailable = false;
    }
  });

  if (usernameAvailable) {
    users[userId] = {
      id: userId,
      username: req.body.username,
      password: req.body.password
    };
    res.cookie('user_id', userId).redirect('/urls')
  } else {
    res.status(400).send("<p> Username taken! </p> <br /> <a href='/register'><button>Back to registration</button></a>");
  }
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
})