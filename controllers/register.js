const { registerUser } = require("../sql/db");
const {
    validEmail,
    validLength,
    customPostgressError,
} = require("../utils/utils");

const { hash } = require("../utils/bc");

exports.postRegister = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (
        validEmail(email) &&
        validLength([
            [firstName, 2, 50],
            [lastName, 2, 50],
            [password, 7, 255],
            [email, 6, 255],
        ])
    ) {
        try {
            const hashedPassword = await hash(password);
            const result = await registerUser(
                firstName,
                lastName,
                email,
                hashedPassword
            );
            req.session.userId = result.rows[0].id;
            req.session.name = firstName;
            return res.status(200).json({
                success: true,
            });
        } catch (err) {
            customPostgressError(err)
                ? res.status(400).json({
                      success: false,
                      error: customPostgressError(err),
                  })
                : res.status(500).json({
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
