const { latestUsers, searchUsers } = require("../sql/db");

exports.getUsersSearchP = async (req, res) => {
    const userInput = req.params.q;
    try {
        const response = await searchUsers(userInput);
        const users = response.rows;
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};
exports.getUsersLatest = async (req, res) => {
    try {
        const response = await latestUsers();
        const users = response.rows;
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};
