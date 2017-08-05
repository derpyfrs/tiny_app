var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");


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

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

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
    userName: req.cookies['id']
  };
  res.render("urls_index", {
    templateVars: templateVars
  });
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userName: req.cookies['id']
  };
  res.render("urls_register", {
    templateVars: templateVars
  });
});

app.get("/urls/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userName: req.cookies['id']
  };
  res.render("urls_login", {
    templateVars: templateVars
});
});

app.post("/urls/login", (req, res) => {
  console.log('req',req.body.password)
  // console.log('res',res.body.password)
  // console.log("Logging in for ", req.body.email);
  res.cookie('id', req.body.email)

  // // console.log(req.cookies);
  if (users[req.body.email] === users[req.body.id].email && users[req.body.password] === users[req.body.id].password) {
      res.cookie('id', req.body.email);
      res.redirect('/urls');
    }
    res.status(403).send('login first stupid')
});

app.post("/register", (req, res) => {
  let usersId = generateRandomNumber();

  res.cookie('email', req.body.email);
  res.cookie('id', usersId);
  res.cookie('password', req.body.password);
  let newUserPool = req.body.email;
  // console.log(newUserPool);
  users[usersId] = {
    id :  usersId,
    email : req.body.email,
    password : req.body.password
  };
  // console.log('password type of', typeof(req.body.password));
  // users.newUserPool = req.body.email;
  // users.newUserPool = req.body.password;
  console.log('usersID',usersId);
  console.log("register",req.cookies);
  console.log('users',users);
  Object.keys(users).forEach((userId) => {
      if(req.body.email !== users[userId].email ) {
        res.redirect('/urls');
      }
     else {
    res.status(400).send('error 400');
    }
  });
});

app.post("/logout", (req, res) => {
console.log("Logging out for ", req.body.login);
  res.clearCookie('username', req.body.login);
  res.clearCookie('password', req.body.password);
  res.clearCookie('email', req.body.email);
  res.clearCookie('id', req.body.id);
  console.log('req.cookies',req.cookies);
  res.redirect('/urls');
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies.id }

  if (req.cookies.id) {
    res.render("urls_new", {
      templateVars: templateVars
    });
  } else {
    res.render("urls_login", {
      templateVars: templateVars
    });
  }
});

app.get("/urls/:id/update", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['id'] };
  urlDatabase[req.params.id] = req.body.longURL;

  res.render("urls_show", {
    templateVars: templateVars
});
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, shortURL: req.params.id, longURL: urlDatabase[req.params.id], userName: req.cookies['id'] };
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
  console.log('longurl',longURL)

});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
});
