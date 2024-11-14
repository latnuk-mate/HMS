// doctor Profile area...

const oldPass = document.getElementById('oldPass');
const newPass = document.getElementById('newPass');
const confirmPass = document.getElementById('confirmPass');

// password view function...
const toggleForOld = document.getElementById('togglePasswordForOld');
const toggleForNew = document.getElementById('togglePasswordForNew');
const toggleForConfirm = document.getElementById('togglePasswordForConfirm');

    function checkPass(pass, icon){
        const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
        pass.setAttribute('type', type);
        // toggle the eye slash icon
        if (icon.classList.contains('fa-eye')) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }


toggleForOld.addEventListener('click', ()=>{
    checkPass(oldPass, toggleForOld)
});

toggleForNew.addEventListener('click', ()=>{
    checkPass(newPass, toggleForNew)
});

toggleForConfirm.addEventListener('click', ()=>{
    checkPass(confirmPass, toggleForConfirm)
});


document.forms["passUpdateForm"].addEventListener("submit", (event) => {
event.preventDefault();

if(newPass.value !== confirmPass.value){
        document.querySelector('#msg').innerHTML = "Confirm Password Not Matched!";
        return false;

    }else{
        document.forms["passUpdateForm"].submit();
    }

});