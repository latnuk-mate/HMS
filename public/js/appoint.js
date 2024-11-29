// appointment section...

function isNumber(number) {
    const num = number.value;
    if (!isNaN(num)) {
      if (num.length > 10 || num.length < 10) {
        document.querySelector(".msg-for-number").innerHTML =
          "Please provide a correct number";
          number.style.border = "1px solid red";
          number.focus();
          return false;
      }else{
        return true;
      }
    } else {
      document.querySelector(".msg-for-number").innerHTML =
        "Please provide a number";
      number.style.border = "1px solid red";
      number.focus();
      return false;
    }
}


const Appnumber = document.getElementById("number");
document.forms["appointmentForm"].addEventListener("submit", (event) => {
  event.preventDefault();

  if (isNumber(Appnumber)) {
    document.forms["appointmentForm"].submit();
  } else {
    document.forms["appointmentForm"].reset();
  }
});