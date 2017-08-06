# TinyApp

TinyApp is a fullstack web app build with Express and Node. It allows users to create shorter links, similar to bit.ly or ow.ly.

This project uses encrypted cookies, hashed passwords (using bcrypt), and a simple express server.

## Running TinyApp

1. Install dependencies: `npm install`
2. Run the development server: `node express_server.js`

and that's it!

## Dependencies

- Node.js
- Express
- EJS (template engine)
- bcrypt (hashing passwords)
- body-parser
- cookie-session (encrypted cookies)

!["Screenshot of main page no login"](https://github.com/derpyfrs/tiny_app/blob/master/docs/Main%20Page%20no%20ID.png)
!["Screenshot of Register page"](https://github.com/derpyfrs/tiny_app/blob/master/docs/Main%20Page%20with%20Login.png)
!["Screenshot of New URL Input page"](https://github.com/derpyfrs/tiny_app/blob/master/docs/New%20URL%20Page.png)
!["Screenshot of main page with user logged in and URL in place"](https://github.com/derpyfrs/tiny_app/blob/master/docs/Register%20ID%20Page.png)
