const { getFriendStatus } = require("../sql/db");

exports.getMesage = async (req, res, next) => {
    const { userId } = req.session;
    const friend_id = req.params.id;
    try {
        const status = await getFriendStatus(userId, friend_id);
        if (!status.rows[0] || !status.rows[0].accepted) {
            res.redirect("/");
        } else {
            next();
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};
