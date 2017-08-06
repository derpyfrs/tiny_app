var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['derpyFRS'],
  })
);

var urlDatabase = {
};

var users = {
  '1': {
    id: '1',
    username: 'derp',
    password: encryptPassword('derp')
  }
}

// helper functions
function encryptPassword(str) {
  return bcrypt.hashSync(str, 10);
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

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.status(301).redirect('/login');
  }
});

app.get("/urls/:id/update", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id] };
  if (req.session.user_id === urlDatabase[req.params.id].userId) {
    res.render("urls_show", templateVars);
  } else {
    res.send("You are not the owner of this URL <a href='/urls'><button>Back to home</button></a>");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.status(301).redirect(`${longURL}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.session.user_id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  var shortUrl = generateRandomNumber();
  urlDatabase[shortUrl] = {
    longURL: req.body.longURL,
    userId: req.session.user_id
  }
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  var verification = [false, null];
  var responseTemplate = "<p> Wrong username or password! </p> <br /> <a href='/login'><button>Back to log in</button></a>";

  Object.keys(users).forEach(function(id) {
    if (req.body.username === users[id].username && bcrypt.compareSync(req.body.password, users[id].password)) {
      verification = [true, id];
    }
  });

  if (verification[0]) {
    req.session.user_id = verification[1];
    res.redirect('/urls');
  } else {
    res.status(403).send(responseTemplate);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
})

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
})

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userId) {
    delete urlDatabase[req.params.id];
  } else {
    res.send("You are not the owner of this URL <a href='/urls'><button>Back to home</button></a>");
  }
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  var usernameAvailable = true;

  Object.keys(users).forEach(function(id) {
    if (req.body.username === users[id].username) {
      usernameAvailable = false;
    }
  });

  if (usernameAvailable) {
    var userId = generateRandomNumber();
    var password = encryptPassword(req.body.password);

    users[userId] = {
      id: userId,
      username: req.body.username,
      password: password
    };

    req.session.user_id = userId;
    res.redirect('/urls')
  } else {
    res.status(400).send("<p> Username taken! </p> <br /> <a href='/register'><button>Back to registration</button></a>");
  }
});