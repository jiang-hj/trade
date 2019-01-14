(function() {

// let chineseNum = ['零','一','二','三','四','五','六','七','八','九'];
let chineseNum = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
let amountUnit = ['角','分','圆']
    //阿拉伯数字转中文


function toChineseNum (number) {
    // let chineseNum = ['零','一','二','三','四','五','六','七','八','九'];
    let r = number.toString();
    let rArr = r.split('');
    
    let len = rArr.length;
    
    let flag = true;
    let keyUnit = '';
    let toChe = ''
    //从个位开始
    for(let i = len - 1; i >= 0; i--) {
    	//第n位
    	let n = len - i;                    
    	//数字
    	let num = rArr[i];
    	
    	//是关键位，将keyUnint设为该位单位 //能被4整除的位余1的位
    	if(n % 4 === 1) {
    		keyUnit = '';
    		let nn = (n-1) / 4;
    		if(nn % 2) {
    			keyUnit += '万';
    		}
    		
    		for(let i = 1; i <= nn / 2; i++) {
    			keyUnit += '亿'
    		}
    	}
    	//非关键位
    	//是否为0
    	if(num == 0) {
    		//前一位不为0,且不为 个，万，亿。。。位   特殊情况，number=0时 ，即len == 1时 
    		if((!flag && (n % 4 !== 1)) ||  len == 1){
    			toChe = '零' + toChe;
    			flag = true;
    		}
    			
    	}else {
    		let unit = '';
    		switch(n % 4) {
    			case 0:
    				unit = '仟';
    				break;
    			case 2:
    				unit = '拾';
    				break;
    			case 3:
    				unit = '佰';
    				break;
    			default:
    				break;
    		}
    		toChe = chineseNum[num] + unit + keyUnit + toChe;
    		keyUnit = '';
    		flag = false;
    	}
    }
    return toChe;
}

function amountInChinese(number) {
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

    let amountInt = toChineseNum(integer),
        amountDec = '';
    
    if(decimals) {
        decimals = decimals.substr(0,2);
        for(let i = 0; i < decimals.length; i++) {
            // if(i > 1) {
            //     break;
            // }
            let decNum = decimals[i];
            if(decimals[i] !== '0') {
                amountDec += chineseNum[decNum] + amountUnit[i];
            }
        }
    }else {
        amountDec += '整';
    }

    return (amountInt + '圆' + amountDec)
}

global.amountInChinese = amountInChinese;

})();