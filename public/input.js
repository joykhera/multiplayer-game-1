const input = {
    up: false,
    left: false,
    right: false,
    down: false,
    shift: false,
}

function handler(key = '', down_or_up) {
    key = key
        .replace('Arrow', '').toLowerCase()
        .replace("keys", "down")
        .replace("keyw", "up")
        .replace("keya", "left")
        .replace("keyd", "right")
        .replace("shiftright", "shift")
        .replace("shiftleft", "shift")

    if (key in input) input[key] = down_or_up
}

document.addEventListener("keydown", (e) => handler(e.code, true), false)
document.addEventListener("keyup", (e) => handler(e.code, false), false)

export default input