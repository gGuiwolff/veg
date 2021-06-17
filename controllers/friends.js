const { getFriends } = require("../sql/db");

exports.postFriends = async (req, res) => {
    const { userId } = req.session;
    try {
        const { rows } = await getFriends(userId);
        const friends = rows;
        res.status(200).json({ friends });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};
