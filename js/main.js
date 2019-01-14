(function() {
    let header = document.getElementById('header'),
        content = document.getElementById('main');
    
    function changeHeight() {
        content.style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
    }

    changeHeight();

    window.onresize = changeHeight;

    let menuWraper = document.getElementById('nav_wraper');

    menuWraper.onselectstart= function() {
        return false;
    }
    menuWraper.ondragstart = function() {
        return false
    }
})();



let dt = document.getElementsByClassName('detail')[0];

//添加日历组件
let mdel = document.getElementsByClassName('md-ele')
        for(let i = 0; i < mdel.length; i++) {
            new Md(mdel[i]);
        }


// 注销操作
let logout = document.getElementsByClassName('logout')[0];
logout.addEventListener('click',function() {
    localStorage.loginInfo = '';
    // alert('您已退出登录');
    showTips('correct','您已成功退出登录')
    setTimeout(function() {
        location.reload();
    },1000)
},false);


//dom查询，未使用；
let query = function(selector,element) { 
    element = element || document;
    if(typeof selector === 'string'){
        selector = selector.trim();
        if(/\.[\w\-_]+$/.test(selector)){
            return element.getElementsByClassName(selector.slice(1));
        }else if(/^#[\w\-_]+$/.test(selector)){
            return element.getElementById(selector.slice(1));
        } else if(/^[\w\-_]+/.test(selector)) {
            return element.getElementsByTagName(selector.slice(1));
        }else {
            return element.querySelectorAll(selector);
        }
    }
}