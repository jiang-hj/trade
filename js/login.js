let loginBtn = document.getElementsByClassName('login-btn')[0],
    nameInp = document.getElementById('userName'),
    passwordInp = document.getElementById('password');

let loginFn;

loginBtn.addEventListener('click',loginFn = function () {
    let name = nameInp.value,
        password = passwordInp.value;

    if (name === datas.user.userName && password === datas.user.password) {
        showTips('correct','登录成功,即将跳转');
        localStorage.loginInfo = JSON.stringify({
            userName: name,
            password: password
        })
        setTimeout(function() {
            location.href = 'index.html';
        },1000);
    } else {
        passwordInp.value = '';
        showTips('error','用户名或密码错误')
    }
}, false)

loginBtn.addEventListener('mousedown',function() {
    this.classList.add('actived');
},false)

loginBtn.addEventListener('mouseup',function() {
    this.classList.remove('actived');
},false)

document.addEventListener('keyup',function(e) {
    if(e.keyCode === 13) {
        if(document.activeElement === nameInp) {
            passwordInp.focus();
        }else if(document.activeElement === passwordInp) {
            passwordInp.blur();
            loginFn();
        }
    }
},false)

