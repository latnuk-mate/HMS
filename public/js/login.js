// login form section...

const captchaInput = document.getElementById("captcha-input");

let captchaText = document.getElementById("captcha");
let ctx = captchaText.getContext("2d");
ctx.font = "35px Areal";
ctx.fillStyle = "#fff";

let captchaStr = "";

const captchaCode = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

function createCaptcha() {
  let arr = [];

  for (let i = 1; i <= 7; i++) {
    arr.push(captchaCode[Math.floor(Math.random() * captchaCode.length)]);
  }

  captchaStr = arr.join("");

  ctx.clearRect(0, 0, captchaText.width, captchaText.height);
  ctx.fillText(captchaStr, captchaText.width / 4, captchaText.height / 2);
}

createCaptcha(); // generating a captcha

function isCaptchaValid(value) {
  if (value !== captchaStr) {
    document.querySelector(".msg-for-captcha").innerHTML = "Incorrect captcha!";
    captchaInput.style.border = "1px solid red";
    return false;
  }

  return true;
}

document.forms["loginForm"].addEventListener("submit", (event) => {
  event.preventDefault();

  if (isCaptchaValid(captchaInput.value)) {
    document.forms["loginForm"].submit();
  } else {
    document.forms["loginForm"].reset();
  }
});