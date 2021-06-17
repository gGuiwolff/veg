const { postImagesFeed } = require("../sql/db");


exports.postImages = async (req, res) => {
    console.log('[REQ DO FEED MID]')
    const { userId } = req.session;
    console.log('[meu req RASTREAR]',req.body.body.description)
    const description = req.body.body.description.url;
    try {
        const image = await postImagesFeed(
            userId,
            description
        );
        res.status(200).json({ image: image.rows[0] });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};