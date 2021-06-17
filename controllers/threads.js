const { getAllPrivateMessages } = require("../sql/db");
const { formatDate } = require("../utils/utils");

exports.postThreads = async (req, res, next) => {
    const { userId } = req.session;

    try {
        const { rows } = await getAllPrivateMessages(userId);
        rows.forEach((row) => {
            row.created_at = formatDate(row.created_at);
        });
        const allMessages = rows;
        res.status(200).json({ allMessages, user: userId });
    } catch (err) {}
};
