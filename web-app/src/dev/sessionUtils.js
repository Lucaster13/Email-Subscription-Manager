

function session_set(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    console.log("set session", key, "to", value);
}

function session_has(key) {
    return !!window.sessionStorage.getItem(key);
}

function session_get(key) {
    return JSON.parse(window.sessionStorage.getItem(key));
}

const session_clr = () => window.sessionStorage.clear();

module.exports = {
    session_clr,
    session_get,
    session_has,
    session_set,
};