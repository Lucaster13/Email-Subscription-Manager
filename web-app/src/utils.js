const SESSION = window.sessionStorage;

function session_set(key, value) {
    SESSION.setItem(key, JSON.stringify(value));
    console.log("set", key, "to", value);
}

function session_get(key) {
    return JSON.parse(SESSION.getItem(key));
}

const session_clr = () => SESSION.clear();

module.exports = {
    session_set,
    session_get,
    session_clr
};