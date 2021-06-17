const { getImagesFeed, getOtherImagesFeed } = require("../sql/db");

exports.listImages = async (req, res) => {
    console.log('[LISTANDO]')
    const { userId } = req.session;
    try {
        const imagesfeed = await getImagesFeed(
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

exports.getOtherFeed = async (req, res) => {
    console.log('[OUTRA IMAGENS]')
    const otherId = req.params.id;
    const { userId } = req.session;
    
    if (otherId == userId) {
        return res.status(200).json({ ownProfile: true });
    }
    try {
        const response = await getImagesFeed(
            userId,
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

/*try {
    const response = await getOtherImagesFeed(otherId);
    if (response.rowCount) {
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
}*/