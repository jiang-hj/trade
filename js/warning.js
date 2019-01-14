(function() {
    let mask = document.getElementsByClassName('warning-mask')[0],
        titleBox = document.getElementsByClassName('warning-title')[0],
        messageBox = document.getElementsByClassName('warning-message')[0],
        ok = document.getElementsByClassName('warning-ok-btn')[0],
        cancel = document.getElementsByClassName('warning-cancel-btn')[0];

        function showWarning(tit,mes,fn) {
            mask.style.display = 'block';
            titleBox.textContent = tit;
            messageBox.textContent = mes;
            ok.onclick = function() {
                fn();
                ok.onclick = null;
                mask.style.display = 'none';
            }

            cancel.onclick = function() {
                ok.onclick = null;
                mask.style.display = 'none';
            }
        }

        window.showWarning = showWarning;
})();