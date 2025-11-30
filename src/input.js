export const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    p: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
}

export function setupInput() {
    document.addEventListener("keydown", (e) => {
        let key = e.key === " " ? "Space" : e.key;
        if (keys.hasOwnProperty(key)) {
            keys[key] = true;
        }
    })

    document.addEventListener("keyup", (e) => {
        let key = e.key === " " ? "Space" : e.key;
        if (keys.hasOwnProperty(key)) {
            keys[key] = false;
        }
    })
}