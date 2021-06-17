const { addBio } = require("../sql/db");
const { validLength } = require("../utils/utils");

exports.postBio = async (req, res) => {
    const { userId } = req.session;
    const { bio } = req.body;
    if (validLength([[bio, 0, 500]])) {
        try {
            const bioUpdate = await addBio(userId, bio);
            res.status(200).json({ bio: bioUpdate.rows[0] });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Server Error : Sorry something went wrong!!",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            error: "Please fill out the form correctly!",
        });
    }
};
