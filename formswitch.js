function switchToRegister(){
    const registerForm = document.getElementById('register-form');
    const signinForm = document.getElementById('signin-form');
    registerForm.classList.add('active');
    signinForm.classList.remove('active');
}

function switchToSignin(){
    const registerForm = document.getElementById('register-form');
    const signinForm = document.getElementById('signin-form');
     registerForm.classList.remove('active');
    signinForm.classList.add('active');
}