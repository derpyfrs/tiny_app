var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
  console.log("Logging in for ", req.body.login);
  console.log(req.cookies);
  res.cookie('username', req.body.login).redirect('/urls');
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id/update", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  urlDatabase[req.params.id] = req.body.longURL;
  res.render("urls_show", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log('this is', req.body);  // debug statement to see POST parameters
  var shortUrl = generateRandomNumber();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.status(301).redirect(`${longURL}`);
  console.log(longURL)

});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
})

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
})