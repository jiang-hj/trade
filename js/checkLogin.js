if(!isLogined()) {
    location.href = 'login.html';
}

function isLogined() {
    
    if(localStorage.loginInfo) {
        let loginInfo = JSON.parse(localStorage.loginInfo);
        if(loginInfo.userName === datas.user.userName && loginInfo.password === datas.user.password) {
            return true;
        }
    }

    return false;
}