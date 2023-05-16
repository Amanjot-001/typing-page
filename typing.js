// caret
const mouseCaret = document.querySelector('.mouseCaret');
const navLinks = document.querySelectorAll('nav .grow-link');
const borderLinks = document.querySelectorAll('.border-link');
const li = document.querySelectorAll('.timer-options>li');
const resDiv = document.querySelectorAll('.result-content>div>p');
const liveTime = document.querySelector('.live-time>div>p');
const typingArea = document.querySelector('.typing-area');

window.addEventListener('mousemove', (e) => {
    mouseCaret.style.top = e.pageY + 'px';
    mouseCaret.style.left = e.pageX + 'px';
})

navLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
        mouseCaret.classList.add('caret-grow');
        link.classList.add('hovered-link');
    })
    link.addEventListener('mouseleave', () => {
        mouseCaret.classList.remove('caret-grow');
        link.classList.remove('hovered-link');
    })
})

borderLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
        mouseCaret.classList.remove('mouseCaret');
    })
    link.addEventListener('mouseleave', () => {
        mouseCaret.classList.add('mouseCaret');
    })
})

li.forEach(link => {
    link.addEventListener('mouseover', () => {
        mouseCaret.classList.add('caret-grow');
        link.classList.add('hovered-link');
    })
    link.addEventListener('mouseleave', () => {
        mouseCaret.classList.remove('caret-grow');
        link.classList.remove('hovered-link');
    })
})

resDiv.forEach(link => {
    link.addEventListener('mouseover', () => {
        mouseCaret.classList.add('caret-grow');
        link.classList.add('hovered-link');
    })
    link.addEventListener('mouseleave', () => {
        mouseCaret.classList.remove('caret-grow');
        link.classList.remove('hovered-link');
    })
})

liveTime.addEventListener('mouseover', () => {
    mouseCaret.classList.add('caret-grow');
    link.classList.add('hovered-link');
})
liveTime.addEventListener('mouseleave', () => {
    mouseCaret.classList.remove('caret-grow');
    link.classList.remove('hovered-link');
})

typingArea.addEventListener('mouseover', () => {
    mouseCaret.classList.remove('mouseCaret');
})
typingArea.addEventListener('mouseleave', () => {
    mouseCaret.classList.add('mouseCaret');
})

//main script

const str = document.querySelector(".given-text");
const input = document.querySelector("#myInput");
const timerSet = document.querySelectorAll("li");
const watch = document.querySelector(".timer");
const time = document.querySelector(".fa-clock");
const caret = document.querySelector(".caret");
const container = document.querySelector(".container");

const originalString = str.textContent.replace(/\s+/g, " ").trim();

let clock = 0;
let clockFlag = false;
let backspaced = false;
let line = 0;
let scrollDistance = 0;
let flag = false;
let totalLines = 0;
let a = 0;
const stopWatch = document.createElement("div");

let typedWords = 0;
let correctWords = 0;
let timerForScore = true;
let cnt = 0;

str.addEventListener('click', () => {
    input.focus();
})

makeHtml(originalString);
function makeHtml(originalString) {
    str.innerHTML = "";
    for (let i = 0; i < originalString.length; i++) {
        const span = document.createElement("span");
        span.textContent = originalString[i];
        span.classList.add(`span${i}`);
        str.insertAdjacentElement("beforeend", span);
    }
    for (let i = 0; i < originalString.length - 2; i++) {
        let index = document.querySelector(`p.given-text span.span${i}`);
        let afterIndex = document.querySelector(`p.given-text span.span${i + 1}`);
        if (index.getBoundingClientRect().top != afterIndex.getBoundingClientRect().top) {
            totalLines++;
        }
    }
}

let firstWordLeft = document.querySelector(`.span0`).getBoundingClientRect().left;
let firstWordTop = document.querySelector(".span0").getBoundingClientRect().top;

typingArea.addEventListener("click", () => {
    input.focus();
    console.log('input focused')
});

input.style.height = '0';
input.style.width = '0';
input.style.border = '0';
input.style.padding = '0';

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        input.focus();
    }
});

// doing backspacing
input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Backspace") {
        e.preventDefault(); // Prevent the default behavior of the key combination
        return;
    }
    let ptr = input.value;
    if (ptr.length < 1) {
        return;
    } //if no character is left

    if (e.key === "Backspace") {
        let once = true;
        let top = false;
        let index = document.querySelector(
            `p.given-text span.span${ptr.length - 1}`
        );
        // remove notTyped class from all chars till the place where space was entered
        while (index.classList.contains("notTyped")) {
            if (once) {
                let afterIndex = document.querySelector(
                    `p.given-text span.span${ptr.length}`
                );
                let beforeIndex = document.querySelector(
                    `p.given-text span.span${ptr.length - 2}`
                );
                let beforeIndexTop = beforeIndex.getBoundingClientRect().top;
                let afterIndexTop = afterIndex.getBoundingClientRect().top;
                if (index.getBoundingClientRect().top != afterIndexTop) {
                    top = true;
                    moveCaretBack(index);
                } else if (index.getBoundingClientRect().top != beforeIndexTop) {
                    top = true;
                    moveCaretBack(beforeIndex);
                    input.value = input.value.slice(0, -1);
                }
                once = false;
            }
            index.classList.remove("notTyped");
            index.innerText = originalString[ptr.length - 1];
            ptr = ptr.slice(0, -1);
            index = document.querySelector(
                `p.given-text span.span${ptr.length - 1}`
            );
            flag = true;
        }
        if (flag) {
            // only if above loop ran
            input.value = ptr;
            input.value += originalString[ptr.length - 1];
            let caretLeft = index.getBoundingClientRect().left - firstWordLeft + 20 + index.getBoundingClientRect().width;
            caret.style.left = `${caretLeft}px`;
            if (!top) {
                let caretTop = index.getBoundingClientRect().top - firstWordTop + 25;
                caret.style.top = `${caretTop}px`;
            }
            flag = false;
            return;
        } else {
            index.classList.remove("right");
            index.classList.remove("wrong");
            let caretLeft = index.getBoundingClientRect().left - firstWordLeft + 20;
            caret.style.left = `${caretLeft}px`;
            let caretTop = index.getBoundingClientRect().top - firstWordTop + 25;
            caret.style.top = `${caretTop}px`;
        }
        if (ptr.length == 1) {
            caret.style.left = "20px";
            return;
        }

        let afterIndex = document.querySelector(
            `p.given-text span.span${ptr.length}`
        );
        let beforeIndex = document.querySelector(
            `p.given-text span.span${ptr.length - 2}`
        );
        let beforeIndexTop = beforeIndex.getBoundingClientRect().top;
        let afterIndexTop = afterIndex.getBoundingClientRect().top;
        if (index.getBoundingClientRect().top != afterIndexTop) {
            moveCaretBack(index);
        } else if (index.getBoundingClientRect().top != beforeIndexTop) {
            moveCaretBack(beforeIndex);
            input.value = input.value.slice(0, -1);
        }
        backspaced = true;
    }
});

// handling the input
input.addEventListener("input", (e) => {
    if (input.value.length > 0 && clockFlag == true && clock != 0) {
        clockFlag = false;
        watch.innerHTML = "";
        stopWatch.classList.add("watch");
        stopWatch.innerText = clock;
        watch.append(stopWatch);
        startTimer();
    }
    let p = input.value;
    if (p.length < 1) {
        return;
    }

    let index = document.querySelector(`p.given-text span.span${p.length - 1}`);
    if (backspaced) {
        backspaced = false;
        return;
    }
    if (p[0] == " ") {
        // to prevent typing space in start
        p = "";
        input.value = "";
        return;
    }
    if (p.length > 1 && p[p.length - 1] == " " && p[p.length - 2] == " ") {
        // to prevent typing consecutive spaces
        input.value = input.value.slice(0, -1);
        return;
    }
    // if correct word is typed
    if (originalString[p.length - 1] === p[p.length - 1]) {
        index.classList.add("right");
        console.log('correct')
    } else {
        console.log('incorrect')
        // space is typed in b/w words
        if (p[p.length - 1] == " ") {
            input.value = input.value.slice(0, -1);
            for (let i = p.length - 1; i < originalString.length; i++) {
                if (originalString[p.length - 1] == " ") break;
                index.classList.add("notTyped");
                p += originalString[i];
                input.value += originalString[i];
                index = document.querySelector(
                    `p.given-text span.span${p.length - 1}`
                );
            }
            input.value += " ";
            index.classList.add("notTyped");
            let afterIndex = document.querySelector(
                `p.given-text span.span${p.length}`
            );
            let afterIndexTop = afterIndex.getBoundingClientRect().top;
            if (index.getBoundingClientRect().top != afterIndexTop) {
                moveCaretDown(afterIndex, index);
            } else {
                moveCaret(index);
            }
            return;
        }
        if (originalString[p.length - 1] == " " && p[p.length - 1] != " ") {
            input.value = input.value.slice(0, -1);
            return;
        }
        index.classList.add("wrong");
    }
    let afterIndex = document.querySelector(
        `p.given-text span.span${p.length}`
    );
    let afterIndexTop = afterIndex.getBoundingClientRect().top;
    if (index.getBoundingClientRect().top != afterIndexTop) {
        moveCaretDown(afterIndex, index);
    } else {
        moveCaret(index);
    }

    caret.style.animationName = "none";
    if (p.length === originalString.length) {
        input.disabled = true;
        over = true;
        score();
        return;
    }
});

function moveCaret(index) {
    let caretLeft = index.getBoundingClientRect().left - firstWordLeft + 20 + index.getBoundingClientRect().width;
    caret.style.left = `${caretLeft}px`;
    let caretTop = index.getBoundingClientRect().top - firstWordTop + 25;
    caret.style.top = `${caretTop}px`;
}

function moveCaretDown(afterIndex, index) {
    line++;
    console.log(line);
    let caretLeft = 20;
    caret.style.left = `${caretLeft}px`;
    let caretTop = afterIndex.getBoundingClientRect().top - firstWordTop + 25;
    caret.style.top = `${caretTop}px`;
    if (line > 2) {
        if (line == 3) scrollDistance = 55;
        else scrollDistance += 36;
        if (totalLines - line <= 7) {
        } else {
            caret.style.top = "78px";
            container.scrollTop = scrollDistance;
        }
    }
}

function moveCaretBack(index) {
    if (line != 0) line--;
    let caretLeft = index.getBoundingClientRect().left - firstWordLeft + 20;
    caret.style.left = `${caretLeft}px`;
    let caretTop = index.getBoundingClientRect().top - firstWordTop + 25;
    caret.style.top = `${caretTop}px`;
    if (line >= 2) {
        if (line == 2) scrollDistance = 18;
        else scrollDistance -= 36;
        if (totalLines - line <= 7) {
        } else {
            caret.style.top = "78px";
            container.scrollTop = scrollDistance;
        }
    }
}

time.addEventListener("click", () => {
    if (a > 1) a = 0;
    if (a % 2 == 0) {
        time.style.color = "#ffd700";
        clockFlag = true;
    } else {
        time.style.color = "white";
        clockFlag = false;
    }
    a++;
    console.log('time');
});

timerSet.forEach((item) => {
    item.addEventListener("click", () => {
        if (clockFlag) {
            item.style.color = "#ffd700";
            clock = item.getAttribute("value");
        }
    });
});

function startTimer() {
    setTimeout(() => {
        clock--;
        console.log(clock);
        stopWatch.innerText = clock;
        if (clock != 0) startTimer();
    }, 1000);
}
