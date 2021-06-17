const {
    getPassword,
    addResetCode,
    getResetCode,
    changePassword,
} = require("../sql/db");
const { validEmail, validLength } = require("../utils/utils");
const { sendEmail } = require("../utils/ses");
const { hash } = require("../utils/bc");
const cryptoRandomString = require("crypto-random-string");

exports.postResetStart = async (req, res) => {
    const { email } = req.body;
    if (validEmail(email) && validLength([[email, 6, 255]])) {
        try {
            const result = await getPassword(email);
            if (!result.rowCount) {
                return res.status(401).json({
                    success: false,
                    error: "E-Mail is not registered!",
                });
            }
            const code = cryptoRandomString({
                length: 6,
            });
            await addResetCode(email, code);
            await sendEmail(
                `Please use this code to reset your password: ${code}`,
                "Reset Password"
            );
            res.status(200).json({ success: true });
        } catch (error) {}
    } else {
        res.status(400).json({
            success: false,
            error: "Please fill out the form correctly!",
        });
    }
};

exports.postResetVerify = async (req, res) => {
    const { code, password, email } = req.body;
    if (
        validEmail(email) &&
        validLength([
            [email, 6, 255],
            [password, 7, 255],
        ])
    ) {
        try {
            const result = await getResetCode(email);
            if (result.rows[0].code != code) {
                return res.status(401).json({
                    success: false,
                    error: "Wrong code!",
                });
            }
            const hashedPassword = await hash(password);
            await changePassword(hashedPassword, email);
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: "Server Error: Sorry, something went wrong!",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            error: "Please fill out the form correctly!",
        });
    }
};
