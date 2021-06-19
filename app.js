const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const compression = require("compression");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/./config/config.env" });
const csurf = require("csurf");
const { requireLoggedInUser } = require("./middleware/auth");
const cookieSession = require("cookie-session");
const {
    getChatMessages,
    addChatMessage,
    getFriendStatus,
    getPrivateMessages,
    addPrivateMessage,
} = require("./sql/db");
const { formatDate } = require("./utils/utils");
app.use(cors());
app.use(compression());
app.use(express.json());

//Route files
const register = require("./routes/register");
const login = require("./routes/login");
const password = require("./routes/password");
const welcome = require("./routes/welcome");
const teste = require("./routes/welcome")
const user = require("./routes/user");
const users = require("./routes/users");
const bio = require("./routes/bio");
const friend = require("./routes/friend");
const friends = require("./routes/friends");
const message = require("./routes/message");
const threads = require("./routes/threads");
const feed = require("./routes/feed");
const listfeed = require("./routes/listfeed");
const listOtherFeed = require('./routes/listOtherFeed')
const listImagesId = require("./routes/listFeedId")
const logOut = require("./routes/logOut")
//const listotherfeed = require('./routes/listOtherFeed')
//app.use("/dashboard", require("./routes/dashboard"));

// const { ids } = require("webpack");

//Cookie session + socket cookie

const cookieSessionMiddleware = cookieSession({
    secret: process.env.COOKIE_SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});


//Mount routers
app.use("/register", register);
app.use("/login", login);
app.use("/password/reset", password);
app.use("/welcome", welcome);
app.use("/user", user);
app.use("/threads", threads);
app.use("/users", users);
app.use("/bio", bio);
app.use("/friend", friend);
app.use("/friends", friends);
app.use("/message", message);

app.use("/feed", feed);
// ABRE TESTE=====
app.use("/listfeedimages",listfeed)
app.use("/listfeedimagesid",listImagesId)
app.use("/otherfeed",listOtherFeed)
app.use("/logout",logOut)
app.use("/teste", () => console.log('[EXPO AQUI]'))
//app.use('/post',post)
//app.use("/cloudimages")
// FECHA TESTE====

app.get("*", requireLoggedInUser, (req, res) =>
    res.sendFile(path.join(__dirname,"/client/index.html"))
);


app.get("*", requireLoggedInUser, (req, res) =>
    res.send('ok')
);

var port = process.env.PORT || 3000;
server.listen(port, () => console.log("http://apivegiwe-com.umbler.net"));

// Socket:
let onlineSockets = {};

io.on("connection", async (socket) => {
    console.log(`Socket id ${socket.id} is now connected.`);

    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    onlineSockets[userId]
        ? onlineSockets[userId].push(socket.id)
        : (onlineSockets[userId] = [socket.id]);

    // onlineUsers = [...new Set(Object.values(onlineSockets))];

    try {
        const { rows } = await getChatMessages();
        rows.reverse().forEach((row) => {
            row.created_at = formatDate(row.created_at);
        });
        io.sockets.emit("chatMessages", rows);
    } catch (err) {
        console.log(err);
    }

    socket.on("newMessage", async (mssg) => {
        try {
            const { rows } = await addChatMessage(userId, mssg);
            rows[0].created_at = formatDate(rows[0].created_at);
            io.sockets.emit("addedMessage", rows[0]);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("getPms", async ({ friend_id }) => {
        try {
            const status = await getFriendStatus(userId, friend_id);
            if (!status.rows[0] || !status.rows[0].accepted) {
                return;
            }
            const { rows } = await getPrivateMessages(userId, friend_id);
            rows.reverse().forEach((row) => {
                row.created_at = formatDate(row.created_at);
            });
            io.to(socket.id).emit("pms", [[friend_id], rows]);
        } catch (err) {
            console.log(err);
        }
    });
    socket.on("newPmMessage", async (mssg, to) => {
        try {
            const { rows } = await addPrivateMessage(userId, mssg, to);
            rows[0].created_at = formatDate(rows[0].created_at);
            const recipientsSockets = onlineSockets[to];
            const sendersSockets = onlineSockets[userId];

            recipientsSockets &&
                recipientsSockets.forEach((socket) =>
                    io.to(socket).emit("addedPm", [userId, rows[0]])
                );
            sendersSockets.forEach((socket) =>
                io.to(socket).emit("addedPm", [to, rows[0]])
            );
        } catch (err) {
            console.log(err);
        }
    });
});

