exports.requireLoggedOutUser = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect("/");
    }
    next();
};
exports.requireLoggedInUser = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/welcome");
    }
    next();
};
/*exports.casualUser = (req, res, next) => {
    if (req.session === null) {
        return res.redirect("/teste");
    }
    next();
};*/
