const { getPassword } = require("../sql/db");
const { validEmail, validLength } = require("../utils/utils");
const { compare } = require("../utils/bc");

exports.postLogin = async (req, res) => {
    console.log('[EXPO LOGIN]')
    const { email, password } = req.body;
    if (
        validEmail(email) &&
        validLength([
            [password, 7, 255],
            [email, 6, 255],
        ])
    ) {
        try {
            const result = await getPassword(email);
            const match = await compare(password, result.rows[0].password);
            if (match) {
                const userId = result.rows[0].id;
                req.session.userId = userId;
                req.session.name = result.rows[0].first_name;
                return res.status(200).json({
                    success: true,
                });
            } else {
                res.status(401).json({
                    success: false,
                    error: "Invalid credentials",
                });
            }
        } catch (error) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            error: "Please fill out the form correctly!",
        });
    }
};
