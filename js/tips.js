(function() {
    let tipsBox = document.getElementsByClassName('tips-box')[0];

window.showTips = function(type,mess) {
    
    if(['error','correct','warning'].indexOf(type) === -1) {
        return
    }
    
    tipsBox.className = 'tips-box';
    tipsBox.style.top = '-35px';
    tipsBox.style.opacity = 0.8;
    
    tipsBox.children[0].textContent = mess;
    
    setTimeout(function() {
        tipsBox.classList.add(type);
        tipsBox.style.top = '-2px';
        tipsBox.style.opacity = 1;
    },1);

    clearTimeout(tipsBox.timer);
    tipsBox.timer = setTimeout(function() {
        tipsBox.style.top = '-35px';
    }, 2000)
}
    
})();