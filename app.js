if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env.secret);

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");

main().then((res) => {
    console.log("connection successfull")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}
app.get("/", (req, res) => {
    res.send("working");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUSer = new User({
        email: "student@gmail.com",
        username: "itsak008",
    });

    let registeredUser = await User.register(fakeUSer, "helloworld");
    res.send(registeredUser);
})

app.use("/listings", listings);
app.use("/Listings/:id/reviews", reviews);
app.use("/", user);


// 404 handler - invalid link
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    if (req.headers['content-type'] === 'application/json') {
        return res.status(statusCode).json({ error: message });
    }
    res.status(statusCode).render("error", { statusCode, message });
});


app.listen(8080, () => {
    console.log("port is working");
});