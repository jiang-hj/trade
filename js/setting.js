(function() {
    let userInfo = document.getElementsByClassName('user-info')[0],
        companyInfo = document.getElementsByClassName('company-info')[0];

    let inputs = userInfo.getElementsByTagName('input');
    let userInputs = {};
    for(let i = 0; i < inputs.length; i++) {
        userInputs[inputs[i].id] = inputs[i];
    }

    inputs = companyInfo.getElementsByTagName('input');
    let companyInputs = {};
    for(let i = 0; i < inputs.length; i++) {
        companyInputs[inputs[i].id] = inputs[i];
    }

    inputs = null;

    let userBtn = userInfo.getElementsByClassName('btn-span')[0],
        companyBtn = companyInfo.getElementsByClassName('btn-span')[0];

    userBtn.addEventListener('click',function() {
        //表单验证
        let msg = userCheckObj.run();
        if(msg) {
            showTips('error',msg);
            return
        }

        //原用户名密码验证
        if(userInputs.oldName.value !== datas.user.userName || userInputs.oldPassword.value !== datas.user.password) {
            showTips('error','当前用户名或密码不正确');
            return
        }

        //两次输入是否一致
        if(userInputs.newPassword.value !== userInputs.repeatPassword.value) {
            showTips('error','两次密码输入不一致');
            return
        }

        //提交新的用户名密码
        datas.user.userName = userInputs.newName.value;
        datas.user.password = userInputs.newPassword.value;
        localStorage.datas = JSON.stringify(datas);

        showTips('correct','用户名密码已修改，请重新登录');
        setTimeout(function() {
            location.reload();
        },1000)

    },false);






    companyBtn.addEventListener('click',function() {
        //表单验证
        let msg = companyCheckObj.run();
        if(msg) {
            showTips('error',msg);
            return;
        }

        //提交新信息

        for(let key in companyInputs) {
            if(companyInputs.hasOwnProperty(key)) {
                datas.company[key] = companyInputs[key].value;
            }
        }

        localStorage.datas = JSON.stringify(datas);
        showTips('correct','公司资料已保存')
    },false);



    





    function CheckObj() {
        this.cache = [];
    }

    CheckObj.prototype.add = function(dom,rule,msg) {
        this.cache.push(function() {
            let value = dom.value;
            msg = msg || '未按要求输入'

            if(!rule.test(value)) {
                return msg
            }

            return false;
        })
    };

    CheckObj.prototype.run = function() {
        let msg;
        for(let i = 0; i < this.cache.length; i++) {
            msg = this.cache[i]();
            if(msg) {
                return msg;
            }
        }
        return false
    };


    let userCheckObj = new CheckObj();
    userCheckObj.add(userInputs.oldName, /^[a-zA-Z]{4,16}$/, '用户名应为4-16位字母');
    userCheckObj.add(userInputs.oldPassword, /^[0-9a-zA-Z]{4,16}$/, '密码应为4-16位数字或字母');
    userCheckObj.add(userInputs.newName, /^[a-zA-Z]{4,16}$/, '新用户名须为4-16位字母');
    userCheckObj.add(userInputs.newPassword, /^[0-9a-zA-Z]{4,16}$/, '新密码需为4-16位数字或字母');
    userCheckObj.add(userInputs.repeatPassword, /^[0-9a-zA-Z]{4,16}$/, '第二次密码输入格式有误');

    
    let companyCheckObj = new CheckObj();
    companyCheckObj.add(companyInputs.companyNameChs, /.+/, '公司中文名不允许为空')
    companyCheckObj.add(companyInputs.companyNameEn, /.+/, '公司英文名不允许为空')
    companyCheckObj.add(companyInputs.companyAddressChs, /.+/, '公司中文地址不允许为空')
    companyCheckObj.add(companyInputs.companyAddressEn, /.+/, '公司英文地址不允许为空')
    companyCheckObj.add(companyInputs.companyCode, /^[0-9a-zA-Z]{18}$/, '统一社会信用代码为18位数字或字母')
        

    function fillCompanyInput() {
        for(let key in companyInputs) {
            if(companyInputs.hasOwnProperty(key) && datas.company.hasOwnProperty(key)) {
                companyInputs[key].value = datas.company[key];
            }
        }
    }

    let companyTag = document.getElementsByClassName('company-tag')[0];
    companyTag.addEventListener('click', function() {
        fillCompanyInput();
    });

    companyInfo.addEventListener('focusout',function(e) {
        let tar = e.target;
        tar.value = tar.value.toUpperCase();
    })

})();