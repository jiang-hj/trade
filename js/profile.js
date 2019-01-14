(function() {
    
let profileBody = document.getElementsByClassName('profile-body')[0];
let profileBox = document.getElementsByClassName('box-profile')[0];

let contextmenu = document.getElementsByClassName('contextmenu')[0];


//滚动
profileBox.addEventListener('mousewheel', function (e) {    
    mousewheel(e)
});

//火狐
profileBox.addEventListener('DOMMouseScroll', function (e) {    
    mousewheel(e)
});

function mousewheel(e) {
    let top,
        max = 40,
        min = profileBox.offsetHeight - profileBody.offsetHeight - 50;
    min = 40 < min ? 40 : min;
    e.stopPropagation();
    let delta = e.wheelDelta ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        top = profileBody.offsetTop + 150;
        if (top <= max) {
            profileBody.style.top = top + 'px';
        } else {
            profileBody.style.top = max + 'px';
        }
    } else if (delta < 0) {

        top = profileBody.offsetTop - 150;
        if (top >= min) {
            profileBody.style.top = top + 'px';
        } else {
            profileBody.style.top = min + 'px';
        }
    }
}

// profileBody.addEventListener('dblclick',function(e) {
//     e.preventDefault();
//     window.getSelection().removeAllRanges();
//     return false;
// },false);

profileBody.addEventListener('click',function(e) {
    let li = global.getClosest('.profile-item',e.target);
    if(li) {
        setActived(li);
    }
})

profileBody.addEventListener('contextmenu', function (e) {
    // e.stopPropagation()
    let li = global.getClosest('.profile-item',e.target);
    if(li) {
        setActived(li);
    }

    let htmlWidth = document.documentElement.clientWidth,
        htmlHeight = document.documentElement.clientHeight,
        x = e.clientX,
        y = e.clientY,
        width = 80,
        menuText;

    let text  = window.getSelection().toString();

    if(showData[0].state) {
        menuText = ['打开','转为编辑','复制单证','删除']
    }else {
        menuText = ['打开','归档','复制单证','删除']
    }

    if(text) {
        menuText.push('复制文本')
    }

    let height = 30 * menuText.length;

    x = (x + width + 10) > htmlWidth ? x - width : x;
    y = (y + height + 10) > htmlHeight ? y - height : y;

    contextmenu.style.left = x + 'px';
    contextmenu.style.top = y + 'px';

    contextmenu.innerHTML = createContextmenuHtml(menuText);
    contextmenu.style.display = 'block';
});

function createContextmenuHtml(arr) {
    let html = '<ul>';
    for(let i = 0; i < arr.length; i++) {
        html += `
            <li data-index="${i}">
                ${arr[i]}
            </li>
        `;
    }


    html += '</ul>';
    return html;
}

document.addEventListener('click',function() {
    contextmenu.style.display = 'none';
},false);

contextmenu.addEventListener('click',function(e) {
    setTimeout(() => {
        let li = global.getClosest('li',e.target);
        if(li) {
            if(li.dataset.index === '0') {
                menuEvent.open();
            }else if(li.dataset.index === '1') {
                menuEvent.changeState();
            }else if(li.dataset.index === '2') {
                menuEvent.copyItem();
            }else if(li.dataset.index === '3') {
                menuEvent.deleteItem();
            }else if(li.dataset.index === '4') {
                menuEvent.copyText();
            }
        }
    }, 0);
});

let openBtn = document.getElementsByClassName('profile-open-btn')[0];
openBtn.addEventListener('click',function() {
    menuEvent.open();
}); 

let changeBtn = document.getElementsByClassName('profile-change-btn')[0];
changeBtn.addEventListener('click',function() {
    menuEvent.changeState();
}); 

let copyBtn = document.getElementsByClassName('profile-copy-btn')[0];
copyBtn.addEventListener('click',function() {
    menuEvent.copyItem();
}); 
let deleteBtn = document.getElementsByClassName('profile-delete-btn')[0];
deleteBtn.addEventListener('click',function() {
    menuEvent.deleteItem();
}); 


let activedItem;

function setActived(dom) {
    if(activedItem) {
        activedItem.classList.remove('actived');
    }
    dom.classList.add('actived');
    activedItem = dom;
}


const menuEvent = {};
menuEvent.open = function() {
    if(!activedItem) {
        showTips('error','请先点击要打开的文件');
        return
    }

    let id = activedItem.dataset.id;
    let data = getDataById(id);
    if(data.main.state === 0) {
        window.detailOpen(data);
    }else {
        window.previewOpen(data);
    }
    
};

menuEvent.changeState = function() {
    if(!activedItem) {
        showTips('error','请先点击要打开的文件');
        return
    }

    let id = activedItem.dataset.id;
    let data = getDataMainById(id);
    
    
    let next = function() {
        refreshData();
        
        activedItem.parentNode.removeChild(activedItem);
        activedItem = null;
        window.localStorage.datas = JSON.stringify(datas);
    }
    
    if(data.state === 0) {
        // let flag = confirm('证书即将归档，请确认已经完成报关');
        // if(!flag) {
        //     return;
        // }

        showWarning('确认继续','请确认该票货物已经报关,归档后的资料可进行查看,但无法进行编辑',function() {
            data.state = 1;
            next();
        })
    }else {
        // let flag = confirm('证书将从归档转为可编辑，请通知相关同事完成对应工作！');
        // if(!flag) {
        //     return;
        // }

        showWarning('确认继续','该条记录将可以重新编辑,重新编辑后将影响您及同事已完成的工作',function() {
            data.state = 0;
            next();
        })
        // data.state = 0;
    }
    
}

menuEvent.copyItem = function() {
    if(!activedItem) {
        showTips('error','请先点击要打开的文件');
        return
    }

    let id = activedItem.dataset.id;
    let data = getDataById(id);
    data.main.contractNumber = '';
    data.main.id = null;
    data.main.state = 0;
    
    window.detailOpen(data);
    
}

menuEvent.deleteItem = function() {
    if(!activedItem) {
        showTips('error','请先点击要打开的文件');
        return
    }

    let id = activedItem.dataset.id;
    let data = getDataMainById(id);

    

    showWarning('确认删除','当前版本暂无恢复功能，删除后将无法找到该记录',function() {

        data.state = -1
        data.contractNumber += '*';
    
        refreshData();
        activedItem.parentNode.removeChild(activedItem);
        activedItem = null;
        window.localStorage.datas = JSON.stringify(datas);
        
    })

}

menuEvent.copyText = function() {
    document.execCommand('copy');
}



function getDataById(id) {
    let data = {};
    // data.items = [];
    data.main = getDataMainById(id);

    data.items = getDataItemsByParentId(id);

    return global.cloneObject(data);
}


function getDataMainById(id) {
    for(let i = 0; i < showData.length; i++) {
        if(showData[i].id === id) {
            return showData[i];            
        }
    }
    
}

function getDataItemsByParentId(id) {
    let items = [];
    datas.billDetail.forEach(function(item) {
        if(item.parentId === id) {
            items[item.index] = item;            
        }
    });
    return items;
}


//选择框动作
let category = {};
    category.checkAll = document.getElementsByClassName('category-checkAll')[0];
    category.wrap = document.getElementsByClassName('category-wrap')[0];
    category.items = category.wrap.children;


    category.checkAll.addEventListener('click',function(){
        this.classList.toggle('checked');
        filter.category = [];
        if(this.classList.contains('checked')){
            for(let i = 0; i < category.items.length; i++) {
                category.items[i].classList.add('checked');
                filter.category.push(category.items[i].dataset.category);
            }
        }else {
            for(let i = 0; i < category.items.length; i++) {
                category.items[i].classList.remove('checked');
            }            
        }
        refreshShowData();
        refreshProfile(showData);
    },false);
    
    category.wrap.addEventListener('click',function(e){
        let tar = global.getClosest('li',e.target);        
        if(tar) {
            filter.category = [];
            let item;            
            let checkAll = true;
            tar.classList.toggle('checked');
            checkedCategory = [];
            for(let i = 0; i < category.items.length; i++) {
                item = category.items[i];
                if(item.classList.contains('checked')) {
                    filter.category.push(item.dataset.category)
                }else {
                    checkAll = false;
                }
            }
            if(checkAll) {
                category.checkAll.classList.add('checked');
            }else {
                category.checkAll.classList.remove('checked');
            }
            refreshShowData();
            refreshProfile(showData);
        }
    },false);
    


    function refreshCategory(categorys) {
        category.wrap.innerHTML = createCategoryHtml(categorys);
    }

    function createCategoryHtml(categorys) {
        let html = '';
        for(let i = 0; i < categorys.length; i++) {
            html += `
            <li class="category-menu checked" data-category="${categorys[i]}">
                <i class="checkbox iconfont"></i>
                <span>${categorys[i]}</span>
            </li>
            `;
        }

        return html;
    }

    function refreshProfile(items) {
        activedItem = null;
        profileBody.innerHTML = createProfileHtml(items);
    }

    function createProfileHtml(items) {
        let html = '';
        for(let i = 0; i < items.length; i++) {
            html += `
            <li class="profile-item" data-id="${items[i].id}">
            <span>${items[i].documentDate}</span>
            <span>${items[i].contractNumber}</span>
            <span>${items[i].blNumber}</span>
            <span>${items[i].containerNumber}</span>
            <span>${items[i].destinationPortChs}</span>
            <span>${items[i].mainProduct}</span>
            <span>${items[i].mainFactory}</span>
            <span>${(+items[i].total).toFixed(2)}</span>
            <span>${items[i].allPackagesNumber}</span>
            <span>${items[i].allVolume}</span>
            <span>${items[i].allGrossWeight}</span>
        </li>
            `;
        }

        return html;
    }

    let filter = {};   

    let inputs = {};
    inputs.search = document.getElementsByName('searchBill')[0];
    inputs.begin = document.getElementsByName('begin')[0];
    inputs.end = document.getElementsByName('end')[0];
    inputs.min = document.getElementsByName('minAmount')[0];
    inputs.max = document.getElementsByName('maxAmount')[0];

    function refreshFilter() {
        filter.search = inputs.search.value;
        filter.begin = inputs.begin.value;
        filter.end = inputs.end.value;
        filter.min = inputs.min.value;
        filter.max = inputs.max.value;
    }

    let showData = [];

    function refreshShowData() {
        showData = [];
        profileData.forEach(function(item) {            
            if(checkData(item)) {
                showData.push(item);
            }
        });
    }

    function checkData(item) {
        if(filter.search) {
            if(JSON.stringify(item).indexOf(filter.search) === -1) {
                return false;
            }
        }

        if(filter.begin) {
            if(Date.parse(item.documentDate) < Date.parse(filter.begin)) {
                return false;
            }
        }

        if(filter.end) {
            if(Date.parse(item.documentDate) > Date.parse(filter.end)) {
                return false;
            }
        }

        if(filter.min) {
            if(+item.total < +filter.min) {
                return false;
            }
        }

        if(filter.max) {
            if(+item.total > +filter.max) {
                return false;
            }
        }

        if(filter.category) {
            if(filter.category.indexOf(item.customerCategory) === -1) {
                return false;
            }
        }

        return true;
    }

    let resetBtn = document.getElementsByName('profile-reset')[0];
    let submitBtn = document.getElementsByName('profile-submit')[0];

    resetBtn.addEventListener('click',function() {
        filter.begin = '';
        filter.end = '';
        filter.min = '';
        filter.max = '';
        // inputs.search.value = '';
        // filter.search = '';
        refreshShowData();
        refreshProfile(showData);
    },false);

    submitBtn.addEventListener('click',function(e) {
        e.preventDefault();
        refreshFilter();
        let dateReg = /\d{4}\/\d{2}\/\d{2}/;
        if(!dateReg.test(filter.begin) || isNaN(Date.parse(filter.begin))) {
            filter.begin = '';
            inputs.begin.value = '';
        }
        if(!dateReg.test(filter.end) || isNaN(Date.parse(filter.end))) {
            filter.end = '';
            inputs.end.value = '';
        }

        if(!global.checkFn.isNumber(filter.min)) {
            filter.min = '';
            inputs.min.value = '';
        }

        if(!global.checkFn.isNumber(filter.max)) {
            filter.max = '';
            inputs.max.value = '';
        }
        
        refreshShowData();
        refreshProfile(showData);

    },false)

    inputs.search.addEventListener('keydown',function(e) {
        if(e.keyCode == 13) {
            this.blur();
            filter.search = this.value;
            refreshShowData();
            refreshProfile(showData);
        }
    },false)

    let currentPage = 'editing';

    window.refreshProfilePage = function(page) {
        if(['history','editing'].indexOf(page) !== -1) {
            currentPage = page;
        }else if(currentPage !== 'editing') {
            return
        }

        activedItem = null;
        category.checkAll.classList.add('checked');


        refreshData();
        refreshCategory(profileCategory);
        refreshProfile(showData);
        showData = profileData;
        profileBody.style.top = '40px';
    };


    let profileData = [];
    let profileCategory = [];

    function refreshData() {
        profileData = [],
        profileCategory = [];
        datas.billMain.forEach(function(item) {
            if(currentPage === 'history') {
                if(+item.state > 0) {
                    profileData.push(item);
                    if(profileCategory.indexOf(item.customerCategory) === -1) {
                        profileCategory.push(item.customerCategory);
                    }
                }
            }else if(currentPage === 'editing') {                
                if(+item.state === 0) {
                    profileData.push(item);
                    if(profileCategory.indexOf(item.customerCategory) === -1) {
                        profileCategory.push(item.customerCategory);
                    }
                }
            }
            
        });

        showData = profileData;
    }

    const hashObj = {};
    hashObj.page = 'editing';
})();