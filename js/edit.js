(function () {
    //获取主要区块

    const box = {};
    //page_detail
    box.pageDetail = document.getElementById('page_detail');

    //主表区域
    box.main = box.pageDetail.getElementsByClassName('bill-header')[0];

    //明细表格区域
    box.itemTboday = box.pageDetail.getElementsByClassName('item-list-tbody')[0];

    //明细编辑框区域
    box.editBox = box.pageDetail.getElementsByClassName('item-list-edit')[0];

    //获取主表部分的编辑框
    let els = box.main.getElementsByClassName('edit-box');
    const mainEdites = {};
    for (let i = 0; i < els.length; i++) {
        let key = els[i].name;
        mainEdites[key] = els[i];
    }

    //获取明细编辑部分


    //获取明细编辑部分的编辑框
    els = box.editBox.getElementsByTagName('input');
    const itemEdites = {};
    for (let i = 0; i < els.length; i++) {
        let key = els[i].name;
        itemEdites[key] = els[i];
    }

    //释放els
    els = null;


    //明细编辑部分的确定，取消,增加按钮
    const itemBtn = {};
    itemBtn.save = box.pageDetail.getElementsByClassName('item-list-save')[0];
    itemBtn.copy = box.pageDetail.getElementsByClassName('item-list-copy')[0];
    itemBtn.cancel = box.pageDetail.getElementsByClassName('item-list-cancel')[0];
    itemBtn.add = box.pageDetail.getElementsByClassName('item-list-add')[0];

    const mainBtn = {};
    mainBtn.save = box.pageDetail.getElementsByClassName('detail-save')[0];
    mainBtn.copy = box.pageDetail.getElementsByClassName('detail-copy')[0];
    mainBtn.close = box.pageDetail.getElementsByClassName('detail-close')[0];
    mainBtn.print = box.pageDetail.getElementsByClassName('detail-print')[0];

    //下拉列表
    const selectBox = {};
    //主表区域的
    selectBox.main = box.main.getElementsByClassName('my-select-wraper')[0];
    //编辑区的
    selectBox.itemEdites = box.editBox.getElementsByClassName('my-select-wraper')[0];

    //数据对象
    const detailData = {};
    detailData.main = {};
    detailData.items = [];

    //数据初始化
    function initDetailData(data) {
        if(data) {
            detailData.main = data.main;
            detailData.items = data.items;
        }else {
            // for(let key in mainEdites) {
            //     if(mainEdites.hasOwnProperty(key)) {
            //         detailData.main[key] = '';
            //     }
            // }

            detailData.main = {};

            let now = new Date();
            detailData.main.documentDate = now.getFullYear() + '/' + (now.getMonth() + 1)+ '/' + now.getDate();
            detailData.main.tradeMode = '一般贸易';
            detailData.main.taxation = '一般征税';
            detailData.main.payment = 'T/T';
            detailData.main.priceTerms = 'FOB';
            detailData.main.transportationMode = '水路运输';
            detailData.main.notify = 'SAME AS CONSIGNEE';
            detailData.main.shipper = datas.company.companyNameEn;

            detailData.items = [];
        }
    }



    //明细编辑部分按钮
    //点击add
    itemBtn.add.addEventListener('click', function () {
        showEditBox();
    }, false);

    //点击取消
    itemBtn.cancel.addEventListener('click', function () {
        closeEditBox();
    }, false);

    //点击复制
    itemBtn.copy.addEventListener('click', function () {
        box.editBox.dataset.index = -1;
        let trs = box.itemTboday.children;
            for (let i = 0; i < trs.length; i++) {
                trs[i].classList.remove('onedit');
            }
    }, false);

    //点击确定
    itemBtn.save.addEventListener('click', function () {
        //表单验证，如果有错，停止继续执行；
        if(checkItems()) {
            return
        }

        let obj;
        //如果新增，box.editBox.dataset.index = -1
        if(box.editBox.dataset.index == -1){
            obj = {};
            saveItemValue(obj);
            detailData.items.push(obj);
        }else {
            obj = detailData.items[box.editBox.dataset.index];
            saveItemValue(obj);
        }
        
        closeEditBox();
        refreshItems(detailData.items);
        aggregate();
    }, false);

    //删除 编辑
    box.itemTboday.addEventListener('click', function (e) {
        let tar = e.target;
        // closeEditBox();

        //删除
        if (tar.className === 'delete-btn') {
            let tr = global.getClosest('tr', tar);
            let index = tr.dataset.index;

            showWarning('确认删除','删除后数据将无法恢复',function() {
                detailData.items.splice(index, 1);
                refreshItems(detailData.items);
                aggregate();
            })
            
        }
        //编辑
        if (tar.className === 'edit-btn') {
            let tr = global.getClosest('tr', tar);
            let index = tr.dataset.index;
            let trs = box.itemTboday.children;
            for (let i = 0; i < trs.length; i++) {
                trs[i].classList.remove('onedit');
            }
            tr.classList.add('onedit');
            showEditBox(index);
        }
    });

    //单证的保存，复制和关闭
    mainBtn.save.addEventListener('click',function(){
        if(checkMain() || detailData.items.length === 0) {
            showTips('error','请检查表单是否填写正确');
            return
        }

        saveMainValue(detailData.main);
        // clearMainValue();
        // saveDetailData(detailData);
        global.save(detailData);
        // detailData.main = null;
        // detailData.items = null;
    },false)

    mainBtn.copy.addEventListener('click',function(){
        if(!detailData.main.id) {
            return showTips('error','请先保存当前单证')
        }
        detailData.main.id = null;
        mainEdites.contractNumber.value = '';
        showTips('correct','已复制单证')
    },false)

    mainBtn.close.addEventListener('click',function(){
        clearMainValue();
        detailData.main = null;
        detailData.items = null;
        box.pageDetail.style.display = '';

    },false)

    //打印预览
    mainBtn.print.addEventListener('click',function(){
        if(!detailData.main.id) {
            return showTips('error','请先进行保存')
        }

        window.open('print.html#' + detailData.main.id)
    },false)


    //保存，清除表单数据
    function saveValue(tar,obj) {
        
        for (key in tar) {
            if (tar.hasOwnProperty(key)) {
                obj[key] = tar[key].value
            }
        }
        return obj;
    }

    function clearValue(tar) {
        for (key in tar) {
            if (tar.hasOwnProperty(key)) {
                tar[key].value = '';
                if(tar[key].nextElementSibling){
                    tar[key].nextElementSibling.innerHTML = '';
                }
                
            }
        }
    }

    function saveItemValue(obj) {
        return saveValue(itemEdites,obj);
    }

    function clearItemValue() {
        clearValue(itemEdites);
    }

    function saveMainValue(obj) {
        return saveValue(mainEdites,obj)
    }

    function clearMainValue() {
        clearValue(mainEdites)
    }

    /**
     * @description 显示明细编辑部分
     * @param {*} index 正在编辑的条目，如为空，表示新建
     */
    function showEditBox(index) {
        if (index !== undefined) {
            let item = detailData.items[index];
            box.editBox.dataset.index = index;
            for (key in itemEdites) {
                if (itemEdites.hasOwnProperty(key) && item[key]) {
                    itemEdites[key].value = item[key];
                }
            }
        } else {
            box.editBox.dataset.index = -1;
            itemEdites.currency.value = 'USD';
        }
        box.editBox.classList.add('show');
        box.itemTboday.classList.add('onedit');
        itemBtn.add.classList.add('hidden');
        box.pageDetail.scrollTop = box.pageDetail.scrollHeight - box.pageDetail.offsetHeight;
    }

    //关闭明细编辑列表
    function closeEditBox() {
        clearItemValue();
        box.editBox.dataset.index = '-1';
        box.editBox.classList.remove('show');
        box.itemTboday.classList.remove('onedit');
        itemBtn.add.classList.remove('hidden');
        let trs = box.itemTboday.children;
        for (let i = 0; i < trs.length; i++) {
            trs[i].classList.remove('onedit');
        }
    }


    //主表部分表单验证
    function checkMain() {
        //允许为空的输入框键名
        let permitEmptyArr = ["userRemarks","remarks","recordNumber","licenseNumber","freight","premium","otherCharge","allPackagesNumber","allGrossWeight","allNetWeight","allVolume","total","mainProduct","mainFactory"],
            value,
            haserror = false;
        for(let key in mainEdites) {
            if(mainEdites.hasOwnProperty(key)) {
                if(permitEmptyArr.indexOf(key) !== -1) {
                    continue;
                }

                value = mainEdites[key].value;
                value = value.trim();
                mainEdites[key].value = value;

                //判断是否填写
                if(key === 'shipper') {
                    if(!global.checkFn.isNonEmpty(value)) {
                        mainEdites[key].nextElementSibling.textContent = '请到系统设置配置相关信息';
                        haserror = true;                        
                    }else {
                        mainEdites[key].nextElementSibling.textContent = '';
                    }
                }else {
                    if(!global.checkFn.isNonEmpty(value)) {
                        mainEdites[key].nextElementSibling.textContent = '不能为空';
                        haserror = true;
                        continue;
                    }else {
                        mainEdites[key].nextElementSibling.textContent = '';
                    }
                }

                //检查合同号是否重复
                if(key === 'contractNumber') {
                    let id = global.checkFn.isContractNumberRepeated(value);
                    if(id && detailData.main.id !== id) {
                        mainEdites[key].nextElementSibling.textContent = '合同号有重复';
                        haserror = true;
                        continue;
                    }else {
                        mainEdites[key].nextElementSibling.textContent = '';
                    }
                }
            }
        }

        return haserror;
    }


    //明细部分表单验证
    function checkItems() {
        let noZeroNumberArr = ["packagesNumber","grossWeight","netWeight","volume","quantity","unitPrice","amount","purchaseUnitPrice","purchaseAmount"],
            value,
            haserror = false;
        for(let key in itemEdites) {
            if(itemEdites.hasOwnProperty(key)) {

                //工厂和换汇成本允许不需要判断
                if(key === 'factory' || key === 'coefficient') {
                    continue;
                }

                //对value进行裁剪，去除两端空格
                value = itemEdites[key].value;
                value = value.trim();
                itemEdites[key].value = value;

                //判断是否填写;未填写的话不许要进行特殊判断
                if(!global.checkFn.isNonEmpty(value)) {
                    itemEdites[key].nextElementSibling.textContent = '不能为空';
                    haserror = true;
                    continue;
                }else {
                    itemEdites[key].nextElementSibling.textContent = '';
                }

                //判断hs编码；退税率；和其他需要为数字的项目；
                if(key === 'hsCode') {
                    if(!global.checkFn.isHsCode(value)) {
                        itemEdites[key].nextElementSibling.textContent = 'hs编码不正确';
                        haserror = true;                        
                    }else {
                        itemEdites[key].nextElementSibling.textContent = '';
                    }
                }else if(key === 'drawback') {
                    if(!global.checkFn.isDrawback(value)) {
                        itemEdites[key].nextElementSibling.textContent = '退税率不正确';
                        haserror = true;                        
                    }else {
                        itemEdites[key].nextElementSibling.textContent = '';
                    }
                }else if(noZeroNumberArr.indexOf(key) !== -1) {
                    if(!global.checkFn.isNonZeroNumber(itemEdites[key].value)) {
                        itemEdites[key].nextElementSibling.textContent = '请填写数字';
                        haserror = true;
                    }else {
                        itemEdites[key].nextElementSibling.textContent = '';
                    }
                }
            }
        }
        return haserror;
    }

    //计算主表部分件数毛净重，体积，主要货物，工厂
    function aggregate() {
        let allPackagesNumber = 0,
            allGrossWeight = 0,
            allNetWeight = 0,
            allVolume = 0,
            total = 0,            
            maxAmount = 0,
            mainProduct = '',
            mainFactory = '';
        
        for(let i = 0; i < detailData.items.length; i++) {
            allPackagesNumber += +detailData.items[i].packagesNumber;
            allGrossWeight += +detailData.items[i].grossWeight;
            allNetWeight += +detailData.items[i].netWeight;
            allVolume += +detailData.items[i].volume;
            total += +detailData.items[i].amount;
            if(+detailData.items[i].amount > maxAmount) {
                maxAmount = +detailData.items[i].amount;
                mainProduct = detailData.items[i].productNameChs;
                mainFactory = detailData.items[i].factory;
            }
        }

        mainEdites.allPackagesNumber.value = allPackagesNumber;
        mainEdites.allGrossWeight.value = allGrossWeight;
        mainEdites.allNetWeight.value = allNetWeight;
        mainEdites.allVolume.value = allVolume;
        mainEdites.total.value = total;
        mainEdites.mainProduct.value = mainProduct;
        mainEdites.mainFactory.value = mainFactory;
    }

    /**
     * @description 筛选对象数组
     * @param {*} datas 筛选目标
     * @param {*} rule 规则， ‘键值:条件’
     * @returns 筛选结果
     */
    function filter(datas, key, val) {
        let array = [];
        for (let i = 0; i < datas.length; i++) {
            if (datas[i][key].indexOf(val) !== -1) {
                array.push(datas[i]);
            }

            //找到数据大于8条，停止查找
            // if(array.length >= 6) {
            //     break;
            // }
        }
        return array;
    }





    //创建下拉列表内容；
    function createSelectlist(data) {
        if (!data.length) {
            return '';
        }
        let item,
            html = '<ul>';
        for (let i = 0; i < data.length; i++) {
            item = data[i];
            html += `<li data-index="${i}">`;
            for (let key in item) {
                html += `
                    <span>${item[key]}</span>
                `
            }
            html += '</li>';
        }
        html += '</ul>';
        return html;
    }

    //下拉列表的点击动作
    function selectHandle(e, dom) {
        // e.stopPropagation();
        let tar = global.getClosest('li', e.target);
        if (tar) {
            let i = tar.dataset.index;
            let item = this.data[i];
            for (let key in item) {
                if (item.hasOwnProperty(key) && dom.hasOwnProperty(key)) {
                    dom[key].value = item[key];
                }
            }
        }
    }


    //下拉菜单hover效果
    function listHover(dom) {
        let lists = dom.children[0].children,
            len = lists.length;
        for (let i = 0; i < len; i++) {
            if (i === dom.index - 1) {
                lists[i].style.backgroundColor = '#efefef';
            } else {
                lists[i].style = '';
            }
        }
    }

    //下拉菜单对上下按键的响应
    function arrowAction(dom, event) {
        let lists = dom.children[0].children,
            len = lists.length;
        //ArrowDown
        if (event.keyCode === 40) {
            dom.index = dom.index || 0;
            if (++dom.index > len) {
                dom.index = 1;
            }
        }
        //Arrowup
        if (event.keyCode === 38) {
            dom.index = dom.index || 1;
            if (--dom.index <= 0) {
                dom.index = len;
            }
        }
        listHover(dom);
    }

    function enterAction(dom, event) {
        if (event.keyCode === 13) {
            let inputs = dom === selectBox.main ? mainEdites : itemEdites;
            let i = dom.index - 1;
            let item = dom.data[i];
            for (let key in item) {
                if (item.hasOwnProperty(key) && inputs.hasOwnProperty(key)) {
                    inputs[key].value = item[key];
                }
            }
            closeSelect()
        }
    }


    //关闭下拉框
    function closeSelect() {
        selectBox.main.data = undefined;
        selectBox.main.index = undefined;
        selectBox.main.innerHTML = '';

        selectBox.itemEdites.data = undefined;
        selectBox.itemEdites.index = undefined;
        selectBox.itemEdites.innerHTML = '';
    }

    //box.pageDetail监听到点击事件就关闭下拉框
    box.pageDetail.addEventListener('click', function () {
        closeSelect();
    })

    box.pageDetail.addEventListener('mouseover', function (e) {
        // closeSelect();
        e.stopPropagation();
        let li = global.getClosest('li', e.target);
        if (li) {
            let select = li.parentNode.parentNode;
            select.index = +li.dataset.index + 1
            listHover(select);
        }
    })


    //下拉框点击事件
    selectBox.main.addEventListener('click', function (e) {
        selectHandle.call(this, e, mainEdites);
    })

    selectBox.itemEdites.addEventListener('click', function (e) {
        selectHandle.call(this, e, itemEdites);
    })

    //下拉菜单对按键的响应
    document.addEventListener('keyup', function (e) {
        //下拉框中有内容；
        if (selectBox.main.children.length) {
            arrowAction(selectBox.main, e);
            // listHover(selectBox.main);  
            enterAction(selectBox.main, e);
        }

        if (selectBox.itemEdites.children.length) {
            arrowAction(selectBox.itemEdites, e);
            // listHover(selectBox.itemEdites); 
            enterAction(selectBox.itemEdites, e);
        }
    })

    //通过focusin监听输入框聚焦，根据输入框位置给下拉框定位
    box.main.addEventListener('focusin', function (e) {
        e.stopPropagation();
        let tar = e.target;
        let offset = global.getOffset(this, tar);

        selectBox.main.style.left = offset.left + 'px';
        selectBox.main.style.top = offset.top + tar.offsetHeight + 'px';
    })

    box.editBox.addEventListener('focusin', function (e) {
        e.stopPropagation();
        let tar = e.target;
        let offset = global.getOffset(this, tar);

        selectBox.itemEdites.style.left = offset.left + 'px';
        selectBox.itemEdites.style.top = offset.top + tar.offsetHeight + 'px';
    })

    //输入框在输入时根据其内容，筛选数据然后给输入框添加item
    function onInput(datas, selcDom) {
        selcDom = selcDom || selectBox.main
        let value = this.value.trim();

        let data = filter(datas, this.name, value);
        selcDom.data = data;
        selcDom.innerHTML = createSelectlist(data);
    }

    //主表区域下input事件
    mainEdites.destinationPortChs.addEventListener('input', function () {
        onInput.call(this, selectData.destinationPort);
    });

    mainEdites.destinationPortEn.addEventListener('input', function () {
        onInput.call(this, selectData.destinationPort);
    });

    mainEdites.loadingPortChs.addEventListener('input', function () {
        onInput.call(this, selectData.loadingPort);
    });

    mainEdites.loadingPortEn.addEventListener('input', function () {
        onInput.call(this, selectData.loadingPort);
    });

    mainEdites.tradeStateChs.addEventListener('input', function () {
        onInput.call(this, selectData.tradeState);
    });

    mainEdites.tradeStateEn.addEventListener('input', function () {
        onInput.call(this, selectData.tradeState);
    });

    mainEdites.tradeStateEn.addEventListener('input', function () {
        onInput.call(this, selectData.tradeState);
    });

    mainEdites.transportationMode.addEventListener('input', function () {
        onInput.call(this, selectData.transportationMode);
    });

    mainEdites.containerType.addEventListener('input', function () {
        onInput.call(this, selectData.containerType);
    });

    mainEdites.packaging.addEventListener('input', function () {
        onInput.call(this, selectData.packaging);
    });

    mainEdites.payment.addEventListener('input', function () {
        onInput.call(this, selectData.payment);
    });

    mainEdites.taxation.addEventListener('input', function () {
        onInput.call(this, selectData.taxation);
    });

    mainEdites.tradeMode.addEventListener('input', function () {
        onInput.call(this, selectData.tradeMode);
    });

    mainEdites.priceTerms.addEventListener('input', function () {
        onInput.call(this, selectData.priceTerms);
    });

    mainEdites.customerCategory.addEventListener('input', function () {
        onInput.call(this, selectData.customerCategory);
    });

    mainEdites.consignee.addEventListener('input', function () {
        onInput.call(this, selectData.consignee);
    });


    //明细编辑部分inpu事件；
    itemEdites.hsCode.addEventListener('input', function () {
        onInput.call(this, selectData.product, selectBox.itemEdites);
    });

    itemEdites.productNameChs.addEventListener('input', function () {
        onInput.call(this, selectData.product, selectBox.itemEdites);
    });

    itemEdites.unitChs.addEventListener('input', function () {
        onInput.call(this, selectData.unit, selectBox.itemEdites);
    });

    itemEdites.currency.addEventListener('input', function () {
        onInput.call(this, selectData.currency, selectBox.itemEdites);
    });

    itemEdites.factory.addEventListener('input', function () {
        onInput.call(this, selectData.factory, selectBox.itemEdites);
    });


    //明细编辑部分表单的自动计算

    function calculateCoefficient() {
        let unitPrice = itemEdites.unitPrice.value.trim(),
            purchaseUnitPrice = itemEdites.purchaseUnitPrice.value.trim(),
            drawback = itemEdites.drawback.value.trim(),
            coefficient;
        
        //当3个值都存在，计算换汇成本，否则清空；
        if(unitPrice && purchaseUnitPrice && drawback) {
            coefficient = (purchaseUnitPrice / 1.16 * (1.16 - drawback / 100)) / unitPrice;
            itemEdites.coefficient.value = coefficient.toFixed(3);
        }else {
            itemEdites.coefficient.value = '';
        }
    }

    //报关单价变化时自动计算总价
    itemEdites.unitPrice.addEventListener('change', function () {
        let quantity = itemEdites.quantity.value.trim(),
            unitPrice = this.value.trim();

        //如果数量和单价为非零数字计算，否则清空
        if (global.checkFn.isNumber(quantity) && global.checkFn.isNumber(unitPrice)) {
            this.value = (+unitPrice).toFixed(4);
            itemEdites.amount.value = (unitPrice * quantity).toFixed(2);
        }else {
            itemEdites.amount.value = '';
        }

        calculateCoefficient();
    })

    //采购单价变化时，自动计算采购总价
    itemEdites.purchaseUnitPrice.addEventListener('change', function () {
        let quantity = itemEdites.quantity.value.trim(),
            purchaseUnitPrice = this.value.trim();

        //如果数量和单价为非零数字计算，否则清空
        if (global.checkFn.isNumber(quantity) && global.checkFn.isNumber(purchaseUnitPrice)) {
            this.value = purchaseUnitPrice;
            itemEdites.purchaseAmount.value = (purchaseUnitPrice * quantity).toFixed(2);
        }else {
            itemEdites.purchaseAmount.value = '';
        }

        calculateCoefficient();
    })

    //当数量变化时，清空单价总价， 避免录单人员疏忽造成单证报关价格的错误
    itemEdites.quantity.addEventListener('change', function () {
        itemEdites.unitPrice.value = '';
        itemEdites.amount.value = '';
        itemEdites.purchaseUnitPrice.value = '';
        itemEdites.purchaseAmount.value = '';

        calculateCoefficient();
    });

    //报关总价变化时，若数量存在，自动计算报关单价
    itemEdites.amount.addEventListener('change', function () {
        let quantity = itemEdites.quantity.value.trim(),
            amount = this.value.trim();
        if (global.checkFn.isNumber(quantity) && global.checkFn.isNumber(amount)) {
            this.value = (+amount).toFixed(2);
            itemEdites.unitPrice.value = (amount / quantity).toFixed(4);
        }else {
            itemEdites.unitPrice.value = '';
        }

        calculateCoefficient();
    });

    //采购总价变化时，若数量存在，自动计算采购单价
    itemEdites.purchaseAmount.addEventListener('change', function () {
        let quantity = itemEdites.quantity.value.trim(),
            purchaseAmount = this.value.trim();
        
        if (global.checkFn.isNumber(quantity) && global.checkFn.isNumber(purchaseAmount)) {
            this.value = (+purchaseAmount).toFixed(2);
            itemEdites.purchaseUnitPrice.value = (purchaseAmount / quantity).toFixed(4);
        }else {
            itemEdites.purchaseUnitPrice.value = '';
        }

        calculateCoefficient();
    });

    itemEdites.drawback.addEventListener('change',function() {
        calculateCoefficient();
    })

    /**
     * @description 创建item-list的表体的html
     * @param {Array} items 对象数组
     */
    function createItemsHtml(items) {
        let html = '';
        items.forEach(function (item, i) {
            html += `
                <tr data-index='${i}' draggable="true">
                    <td class="item-td-index">${i+1}</td>
                    <td>${item.hsCode}</td>
                    <td>
                        <p>${item.productNameChs} ${item.productNameEn}</p>
                        <p>${item.productInfo}</p>
                    </td>
                    <td>
                        ${item.quantity} ${item.unitChs} (${item.unitEn})
                    </td>
                    <td>
                        <p>${item.unitPrice}</p>
                        <p>${item.amount}</p>
                        <p>${item.currency}</p>
                    </td>
                    <td>
                        ${item.packagesNumber}
                    </td>
                    <td>
                        ${item.grossWeight}
                    </td>
                    <td>
                        ${item.netWeight}
                    </td>
                    <td>
                        ${item.volume}
                    </td>
                    <td>
                        ${item.manufacturePlace}
                    </td>
                    <td>
                        <p>${item.purchaseUnitPrice}</p>
                        <p>${item.purchaseAmount}</p>
                    </td>
                    <td>
                        ${item.coefficient}
                    </td>
                    <td>
                        ${item.factory}
                    </td>
                    <td>
                        <span class='edit-btn'>编辑</span>
                        <span class='delete-btn'>删除</span>
                    </td>
                </tr>
            `
        });
        return html;
    }

    //刷新明细表格区域
    function refreshItems(items) {
        box.itemTboday.innerHTML = createItemsHtml(items);
    }

    function setMainValue() {
        for(let key in detailData.main) {
            if(detailData.main.hasOwnProperty(key) && mainEdites.hasOwnProperty(key)) {
                mainEdites[key].value = detailData.main[key];
            }
        }
    }

    function refreshDetail() {
        setMainValue();
        refreshItems(detailData.items);
    }

    function arrayItemExchange(array, a, b) {
        let temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }

    const evfn = {};

    //拖拽方案
    const drag = {}
    //方案1
    drag.method1 = function () {
        let dragTarget;
        box.itemTboday.addEventListener('dragstart', function (e) {
            dragTarget = e.target;
            e.dataTransfer.setData('tag', 'tr');
            e.target.classList.add('ondrag')

        }, false)
        box.itemTboday.addEventListener('dragend', function (e) {
            e.target.style.opacity = '1'
        }, false)


        box.itemTboday.addEventListener('dragenter', function (e) {
            let tar = global.getClosest('tr', e.target);

            let trs = this.children
            if (tar) {
                for (let i = 0; i < trs.length; i++) {
                    if (trs[i] === tar) {
                        trs[i].classList.add('onselected');
                    } else {
                        trs[i].classList.remove('onselected');
                    }
                }
            }
        }, false)

        box.itemTboday.addEventListener('drop', function (e) {
            let tar = global.getClosest('tr', e.target)
            if (tar) {
                let a = dragTarget.dataset.index;
                let b = tar.dataset.index;
                arrayItemExchange(detailData.items, a, b);
                refreshItems(detailData.items);
            }
        }, false)

        box.itemTboday.addEventListener("dragover", function (e) {
            // 阻止默认动作,使drop生效
            e.preventDefault();
        }, false);
    }

    //拖拽方案2
    drag.method2 = function () {
        box.itemTboday.addEventListener('mousedown', function (e) {
            e.preventDefault();
            // e.stopPropagation();
            if (e.target.className !== 'item-td-index') {
                return false
            }
            let dragTarget = global.getClosest('tr', e.target);
            let dropTarget = global.getClosest('tr', e.target);

            box.itemTboday.addEventListener('mouseover', evfn.itmove = function (e) {
                e.stopPropagation();
                dragTarget.classList.add('ondrag');

                let tar = global.getClosest('tr', e.target);
                let trs = this.children
                if (tar) {
                    for (let i = 0; i < trs.length; i++) {
                        if (trs[i] === tar) {
                            trs[i].classList.add('onselected');
                            dropTarget = trs[i];
                        } else {
                            trs[i].classList.remove('onselected');
                        }
                    }
                }
            })

            document.addEventListener('mouseup', evfn.dcup = function (e) {
                box.itemTboday.removeEventListener('mouseover', evfn.itmove);
                document.removeEventListener('mouseup', evfn.dcup);
                let a = dragTarget.dataset.index;
                let b = dropTarget.dataset.index;
                arrayItemExchange(detailData.items, a, b);
                refreshItems(detailData.items);
            })
        });

    }
    
    drag.method2();

    //转大写
    box.pageDetail.addEventListener('focusout', function (e) {
        let tar = e.target;
        tar.value = tar.value.toUpperCase();
    })
    
    //右键复制
    box.pageDetail.addEventListener('mousedown',function(e) {
        if(e.button === 2) {
            let text  = window.getSelection().toString();
            if(text) {
                showTips('correct','已复制所选文本');
                document.execCommand('copy');
            }
        }
    },false)

    /**
     * @description 对外接口
     * @param {Object} data 表单所需数据data.main;主表数据，data.items明细数据；不传为新建；
     */
    window.detailOpen = function(data) {
        initDetailData(data);
        refreshDetail();
        box.pageDetail.style.display = 'block';
    }
}())