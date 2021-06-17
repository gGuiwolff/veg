const path = require("path");

exports.getWelcome = async (req, res) => {
    res.sendFile(path.join(__dirname, "../..", "client", "index.html"));
};

/*exports.getWelcomes = async (req, res) => {
    res.sendFile(path.join(__dirname, "../..", "client","../..", "src", "componets", "NavBar.js"));
};*/
