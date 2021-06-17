const { getOtherFeed } = require("../sql/db");

exports.listOtherImages = async (req, res) => {
    console.log('[LISTANDO NOVAS IMAGENS]')
    const otherId = req.params.id;
    const { userId } = req.session;
    if (otherId == userId) {
        return res.status(200).json({ ownProfile: true });
    }
        //
        try {
            const response = await getOtherFeed(otherId);
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