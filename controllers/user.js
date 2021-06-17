const { getUser, getOtherUser } = require("../sql/db");

exports.getUser = async (req, res) => {
    const { userId } = req.session;
    try {
        const response = await getUser(userId);
        const user = response.rows[0];
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};

exports.getOtherUser = async (req, res) => {
    const otherId = req.params.id;
    const { userId } = req.session;
    if (otherId == userId) {
        return res.status(200).json({ ownProfile: true });
    }
    try {
        const response = await getOtherUser(otherId);
        if (response.rowCount) {
            const user = response.rows[0];
            res.status(200).json({ user });
        } else
            res.status(400).json({
                success: false,
                error: "User does not exist!",
            });
    } catch (err) {
        if (err.code === "22P02") {
            return res.status(500).json({
                success: false,
                error: "User does not exist!",
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Server Error: Sorry, something went wrong!",
            });
        }
    }
};