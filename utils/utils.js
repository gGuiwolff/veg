const URL = require("url").URL;

exports.formatDate = (date) => {
    const isoSubDate = (d) => d.toISOString().substring(0, 10);
    const checkDate = (day) => isoSubDate(date).startsWith(day);
    const time = date.toString().substring(16, 21);
    let today = isoSubDate(new Date());
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = isoSubDate(yesterday);
    if (checkDate(today)) return `today, ${time}:`;
    if (checkDate(yesterday)) return `yesterday, ${time}:`;
    return `on ${date.toString().substring(3, 10)}, ${time}:`;
};

exports.validEmail = (email) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.toLowerCase()
    );

exports.validLength = (arr) =>
    arr.every((arr) => arr[0].length <= arr[2] && arr[0].length >= arr[1]);

exports.validUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

exports.customPostgressError = (err) => {
    if (err.constraint === "users_email_key") {
        return "Email address is already registered.";
    }
    return false;
};
