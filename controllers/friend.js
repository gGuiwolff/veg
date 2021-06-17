const {
    getFriendStatus,
    addFriend,
    unfriend,
    acceptFriend,
    cancelFriend,
} = require("../sql/db");

exports.getFriend = async (req, res) => {
    const { userId } = req.session;
    const { otherUserId } = req.params;
    try {
        const { rows } = await getFriendStatus(userId, otherUserId);
        if (!rows.length) {
            res.status(200).json({ status: 0 });
        } else {
            if (rows[0].accepted) {
                res.status(200).json({ status: 1 });
            } else {
                userId === rows[0].sender_id
                    ? res.status(200).json({ status: 2 })
                    : res.status(200).json({ status: 3 });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};

exports.postFriend = async (req, res) => {
    const { userId } = req.session;
    const { operation, otherUserId } = req.body;
    const operations = {
        "Add Friend": async () => {
            const { rows } = await getFriendStatus(userId, otherUserId);
            return rows.length
                ? await acceptFriend(userId, otherUserId)
                : addFriend(userId, otherUserId);
        },
        Unfriend: async () => {
            const { rows } = await getFriendStatus(userId, otherUserId);
            return rows.length
                ? unfriend(userId, otherUserId)
                : { rows: [{ "?column?": 0 }] };
        },
        "Accept Friend Request": async () => {
            const { rows } = await getFriendStatus(userId, otherUserId);
            return rows.length
                ? acceptFriend(userId, otherUserId)
                : { rows: [{ "?column?": 0 }] };
        },
        "Cancel Friend Request": async () => {
            const { rows } = await getFriendStatus(userId, otherUserId);
            return rows[0] && rows[0].accepted
                ? rows[0]
                    ? unfriend(userId, otherUserId)
                    : { rows: [{ "?column?": 4 }] } //the same request has already been made
                : cancelFriend(userId, otherUserId);
        },
    };
    try {
        const { rows } = await operations[operation]();
        const status = rows[0] ? rows[0]["?column?"] : 4; // If !rows[0] the same request has already been made
        res.status(200).json({ status });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: "Server Error: Sorry, something went wrong!",
        });
    }
};
