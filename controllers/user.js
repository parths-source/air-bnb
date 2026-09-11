const User = require("../models/user");
const Listing = require("../models/listing");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
    res.render("signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Explore your new adventure");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", "That account already exists. Please sign in.");
        res.redirect("/login");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("login.ejs");
};

module.exports.renderFavorites = async (req, res) => {
    const favoriteIds = (req.user.favorites || []).map((id) => String(id));
    const alllisting = await Listing.find({ _id: { $in: favoriteIds } });
    res.render("index.ejs", { alllisting, selectedCategory: "Your favorites", favoriteIds });
};

module.exports.login = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (!existingUser) {
            req.flash("error", "No account found with that username. Please create an account.");
            return res.redirect("/signup");
        }

        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash("error", "Incorrect password. Please try again.");
                return res.redirect("/login");
            }

            req.logIn(user, (loginError) => {
                if (loginError) {
                    return next(loginError);
                }

                const redirectUrl = req.session.redirectUrl || "/listings";
                delete req.session.redirectUrl;
                res.redirect(redirectUrl);
            });
        })(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
};
