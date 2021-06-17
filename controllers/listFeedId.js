const { getImagesFeedId,getIndividualPosts } = require("../sql/db");

exports.listImagesId = async (req, res) => {
    console.log('[LISTANDO IDS]')
    const { userId } = req.session;
    try {
        const imagesfeed = await getImagesFeedId(
            userId,
        );
        res.send(imagesfeed.rows);
        //res.send(imagesfeed.rows[0]);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};


exports.getOtherFeedId = async (req, res) => {
    console.log('[OUTRA IMAGENS]')
    const otherId = req.params.id;
    const { userId } = req.session;
    try {
        const response = await getIndividualPosts(
            otherId,
        );
        const user = response.rows[0];
        res.status(200).json({ user });
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