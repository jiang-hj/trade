(function() {
    let onesArr = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'],
        teenArr = ['TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN','SEVENTEEN','EIGHTEEN','NINETEEN'],
        tensArr = ['','','TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY'],
        thousandsArr = ['','THOUSAND','MILLION','BILLION','THOUSAND','MILLION'];

    function toEnglishNum(number) {
        let len = number.length,
            times = Math.ceil(len / 3),
            numArr = [],
            numberInEn = '';
        for(let i = 0; i < times; i++) {
            let end = len - 3 * i,
                star = end -3;
            star = star > 0 ? star : 0;
            numArr.push(number.substring(star,end));
        }

        for(let i = 0; i < numArr.length; i++) {
            let num = numArr[i],
                numInEn = '';
            if(num.length === 3) {
                if(+num[0] > 0) {
                    numInEn = onesArr[num[0]] + ' HUNDRED';
                    num = num.substr(1);
                }
            }

            if(num.length === 2 && (+num)) { //两位不全为0
                numInEn += numInEn.length > 0 ? ' AND ' : '';
                
                if(+num[0] > 1) {
                    numInEn += tensArr[num[0]] + ' ' + onesArr[num[1]];
                }else if(num[0] === '0') {
                    numInEn += onesArr[num[1]];
                }else {
                    numInEn += teenArr[num[1]];
                }
            }

            if(num.length === 1) {
                numInEn += onesArr[num[0]];
            }
            
            numInEn += ' ' + thousandsArr[i];
            numberInEn = numInEn +' ' + numberInEn;
        }

        return numberInEn
    }

    function amountInEnglish(number) {
        if(!/^\d+(\.\d+)?$/.test(number)) {
            return
        }

        //去除前后两端多余的0
        number = (+number).toString();

        let numArr = number.split('.'),
            integer = numArr[0],
            decimals;
        if(numArr.length === 2) {
            decimals = numArr[1];
        }

        let amountInt = 'SAY US DOLLARS ' + toEnglishNum(integer).trim(),
            amountDec = '';

        if(decimals) {
            decimals = decimals.substr(0,2);
            amountDec = ' AND CENTS ' + toEnglishNum(decimals).trim() + ' ONLY.';
        }else {
            amountDec += ' ONLY.';
        }

        return (amountInt + amountDec)
    }

    if(window.global) {
        global.amountInEnglish = amountInEnglish;
    }
    if(!window.amountInEnglish) {
        window.amountInEnglish = amountInEnglish;
    }

})();