function isValidHttpUrl(urlString) {
    let url;
    try {
        url = new URL(urlString);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = { isValidHttpUrl };
