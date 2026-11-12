function ReplaceDate(getDate) {
    console.log("date ", getDate);
    return getDate.replace(/2019/g, new Date().getFullYear());
}

module.exports = ReplaceDate;