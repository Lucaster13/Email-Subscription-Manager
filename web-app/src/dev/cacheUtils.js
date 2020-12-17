

function cache_set(key, value, userId) {
    window.localStorage.setItem(key + userId, JSON.stringify(value));
    console.log("set cache", key + userId, "to", value);
}

function cache_has(key, userId) {
    return !!window.localStorage.getItem(key + userId);
}

function cache_get(key, userId) {
    return JSON.parse(window.localStorage.getItem(key + userId));
}

const cache_clr = () => window.localStorage.clear();

module.exports = {
    cache_clr,
    cache_get,
    cache_has,
    cache_set,
};