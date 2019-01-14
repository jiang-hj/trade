const global = {}
global.appMain = document.getElementById('app_main');
global.new = document.getElementById('new')

global.new.addEventListener('click',function() {
    detailOpen();
},false)

//获取符合要求的最近的祖级元素
global.getClosest = function(selector,tar) {
    let type = 'nodeName';
    if(selector.charAt(0) === '#') {
        type = 'id';
        selector = selector.slice(1);
    }else if(selector.charAt(0) === '.') {
        type = 'class';
        selector = selector.slice(1);
    }
    if(type !== 'class') {
        while(tar && tar.nodeType !== 9 && tar[type].toLowerCase() !== selector) {
            tar = tar.parentNode;
        }
    }else {
        while(tar && tar.nodeType !== 9 && !tar.classList.contains(selector)) {
            tar = tar.parentNode;
        }
    }
    
    if(tar.nodeType !== 9) {
        return tar;
    }
};

//验证
global.checkFn = {
    isNonEmpty: function(value) {
        // value = value.trim();
        return value !==  ''
        
    },    
    isNumber: function(value) {
        // value = value.trim();
        return /^((0)|([1-9]\d*))(\.\d+)?$/.test(value);       
    },
    isNonZeroNumber: function(value) {
        // value = value.trim();
        return (this.isNumber(value) && (+value !== 0));       
    },
    isDrawback: function(value) {
        // value = value.trim();
        return /^(([0-9])|(1[1-6]))$/.test(value);       
    },
    isHsCode: function(value) {
        return /^[1-9]\d{9}$/.test(value);
    },
    isContractNumberRepeated: function(value) {
        for(let i = 0; i < datas.billMain.length; i++) {
            if(datas.billMain[i].contractNumber === value) {
                return datas.billMain[i].id
            }
        }
        return false
    }
}

//获取相对某个祖级元素的offset
global.getOffset = function(dom,target) {
    let left = target.offsetLeft,
        top = target.offsetTop,
        height = target.offsetHeight,
        width = target.offsetWidth;
    while(target.offsetParent && target.offsetParent !== 9 && target.offsetParent !== dom) {
        target = target.offsetParent;
        left += target.offsetLeft;
        top += target.offsetTop;
        height += target.offsetHeight;
        width += target.offsetWidth;
    }

    if(target.offsetParent === dom) {
        return {
            left: left,
            top: top,
            width: width,
            height: height
        };
    }
    return 'dom输入错误'
}

//保存
global.save = function(data) {
    //如果data.main存在id，则替换原来数据，否则新增
    //检查data是否存在，不存在的话返回；
    if(!data) {
        return
    }
    if(data.main.id) {
        
        // let i = global.findMainIndex(data.main.id);
        // datas.billMain[i] = data.main;
        global.deleteMainById(data.main.id);
        datas.billMain.push(data.main);

        global.deleteItemsByParentId(data.main.id);

        global.pushToBillDetail(data.items,data.main.id);
    }else {
        let id = global.createId();
        data.main.id = id;
        //state=0为可编辑状态；
        data.main.state = 0;
        datas.billMain.push(global.cloneObject(data.main));

        global.pushToBillDetail(data.items,id);
    }
    window.localStorage.datas = JSON.stringify(datas);
    showTips('correct','保存成功');  
    
    //刷新单证概览页面；
    refreshProfilePage(); 
}

//根据id查找到主表中对应的索引
global.findMainIndex = function(id) {
    for(let i = 0; i < datas.billMain.length; i++) {
        if(datas.billMain[i].id === id) {
            return i;
        }
    }
}

global.deleteMainById = function(id) {
    let newItemsArr = [];

    datas.billMain.forEach(function(item) {
        if(item.id !== id) {
            newItemsArr.push(item);
        }
    });

    datas.billMain = newItemsArr;
}

global.deleteItemsByParentId = function(parentId) {
    let newItemsArr = [];

    datas.billDetail.forEach(function(item) {
        if(item.parentId !== parentId) {
            newItemsArr.push(item);
        }
    });

    datas.billDetail = newItemsArr;
}

global.pushToBillDetail = function(arr,parentId) {
    arr.forEach(function(item,i) {
        item.index = i;
        item.parentId = parentId;
        datas.billDetail.push(global.cloneObject(item));
    });
}

//生成id
global.createId = function() {
    let timestamp = Date.now().toString(36);
    let random = Math.random().toString(36).substr(1,7);
    return (timestamp + random)
}

//复制对象或者数组
global.cloneObject = function(obj) {
    return JSON.parse(JSON.stringify(obj))
}

// //显示数据
// global.profileData = [];
// global.profileCategory = [];



//取消右键默认菜单
document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
});


