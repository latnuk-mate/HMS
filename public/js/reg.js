//  registration section...


function isNumber(number) {
    const num = number.value;
    if (!isNaN(num)) {
      if (num.length > 10 || num.length < 10) {
        document.querySelector(".msg-for-number").innerHTML =
          "Please provide a correct number";
        number.style.border = "1px solid red";
        number.focus();
        return false;
      }
    } else {
      document.querySelector(".msg-for-number").innerHTML =
        "Please provide a number";
      number.style.border = "1px solid red";
      number.focus();
      return false;
    }
  
    return true;
  }
    
  const regNumber = document.getElementById("number");
  const password = document.getElementById("pass");
  const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).*$/;
  
  function validatePass() {
    if (!pattern.test(password.value)) {
      document.querySelector(".msg-for-pass").innerHTML =
        "Password must contain digits, uppercase , lowercase and special characters!";
      pass.style.border = "1px solid red";
      pass.focus();
      return false;
    }
    return true;
  }
  
  document.forms["signupForm"].addEventListener("submit", (event) => {
    event.preventDefault();
  
    if (isNumber(regNumber) && validatePass()) {
      document.forms["signupForm"].submit();
    } else {
      document.forms["signupForm"].reset();
    }
  });