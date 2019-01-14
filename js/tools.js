(function() {
    let pageTools = document.getElementById('page_tools');

    let amoutChsBtn = pageTools.getElementsByClassName('amount-chs-btn')[0],
        amoutEnBtn = pageTools.getElementsByClassName('amount-en-btn')[0],
        upperBtn = pageTools.getElementsByClassName('upper-btn')[0],
        lowerBtn = pageTools.getElementsByClassName('lower-btn')[0];

    let amountArea = pageTools.getElementsByClassName('amount-area')[0],
        letterArea = pageTools.getElementsByClassName('letter-area')[0];

    amoutEnBtn.addEventListener('click',function() {
        if(checkAmount()) {
            return
        }

        amountArea.value = global.amountInEnglish(amountArea.value);
    },false)

    amoutChsBtn.addEventListener('click',function() {
        if(checkAmount()) {
            return
        }

        amountArea.value = global.amountInChinese(amountArea.value);

    },false)

    upperBtn.addEventListener('click',function() {
        letterArea.value = letterArea.value.toUpperCase();
    },false)

    lowerBtn.addEventListener('click',function() {
        letterArea.value = letterArea.value.toLowerCase();
    },false)

    function checkAmount() {
        let value = amountArea.value;
        if(!/^\d+(\.\d+)?$/.test(value)) {
            showTips('error','请输入数字');
            return true
        }

        let numArr = value.split('.');
        if(numArr[0].length > 21){
            showTips('error','输入数字过大');            
            return true
        }
        if(numArr[1] && numArr[1].length > 2) {
            showTips('warning','已忽略小数点两位后的数字');            
        }

    }

    pageTools.addEventListener('mousedown',function(e) {
        if(e.button === 2) {
            let text  = window.getSelection().toString();
            if(text) {
                showTips('correct','已复制所选文本');
                document.execCommand('copy');
            }
        }
    },false)

})();