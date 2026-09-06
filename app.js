const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.send("working");
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);

const Mongo = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(Mongo);
}

main()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render("error.ejs", { err: { message } });
});

app.listen(8080, () => {
    console.log("server is running at port 8080");
});

