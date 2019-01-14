(function () {
    //获取主要区块

    const box = {};
    //page_detail
    box.pagePreview = document.getElementById('page_preview');

    //主表区域
    box.main = box.pagePreview.getElementsByClassName('bill-header')[0];

    //明细表格区域
    box.itemTboday = box.pagePreview.getElementsByClassName('item-list-tbody')[0];

    //明细查看区域
    box.editBox = box.pagePreview.getElementsByClassName('item-list-edit')[0];

    //获取主表部分的编辑框
    let els = box.main.getElementsByClassName('edit-box');
    const mainEdites = {};
    for (let i = 0; i < els.length; i++) {
        let key = els[i].name;
        mainEdites[key] = els[i];
    }

    //获取明细查看部分
    //获取明细编辑部分的编辑框
    els = box.editBox.getElementsByTagName('input');
    const itemEdites = {};
    for (let i = 0; i < els.length; i++) {
        let key = els[i].name;
        itemEdites[key] = els[i];
    }

    //释放els
    els = null;


    //明细查看部分的关闭按钮
    const itemBtn = {};
    itemBtn.cancel = box.pagePreview.getElementsByClassName('item-list-cancel')[0];

    const mainBtn = {};
    mainBtn.close = box.pagePreview.getElementsByClassName('detail-close')[0];
    mainBtn.print = box.pagePreview.getElementsByClassName('detail-print')[0];

    //数据对象
    const detailData = {};
    detailData.main = {};
    detailData.items = [];

    //数据初始化
    function initDetailData(data) {
        if (data) {
            detailData.main = data.main;
            detailData.items = data.items;
        } else {
            box.pagePreview.style.display = '';
        }
    }

    //关闭页面
    mainBtn.close.addEventListener('click', function () {
        clearMainValue();
        detailData.main = null;
        detailData.items = null;
        box.pagePreview.style.display = '';
    }, false)

    ///打印预览
    mainBtn.print.addEventListener('click',function(){
        if(!detailData.main.id) {
            return showTips('error','请先进行保存')
        }

        window.open('print.html#' + detailData.main.id)
    },false)


    //关闭详情
    itemBtn.cancel.addEventListener('click', function () {
        closeEditBox();
    }, false);


    //查看详情
    box.itemTboday.addEventListener('click', function (e) {
        let tar = e.target;

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

    function clearValue(tar) {
        for (key in tar) {
            if (tar.hasOwnProperty(key)) {
                tar[key].value = '';
            }
        }
    }

    function clearItemValue() {
        clearValue(itemEdites);
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
        // box.itemTboday.classList.add('onedit');
        
        box.pagePreview.scrollTop = box.pagePreview.scrollHeight - box.pagePreview.offsetHeight;
    }

    //关闭明细查看
    function closeEditBox() {
        clearItemValue();
        box.editBox.dataset.index = '-1';
        box.editBox.classList.remove('show');
        // box.itemTboday.classList.remove('onedit');
        let trs = box.itemTboday.children;
        for (let i = 0; i < trs.length; i++) {
            trs[i].classList.remove('onedit');
        }
    }



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
                        <span class='edit-btn'>详情</span>
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
        for (let key in detailData.main) {
            if (detailData.main.hasOwnProperty(key) && mainEdites.hasOwnProperty(key)) {
                mainEdites[key].value = detailData.main[key];
            }
        }
    }

    function refreshDetail() {
        setMainValue();
        refreshItems(detailData.items);
    }

    box.pagePreview.addEventListener('mousedown',function(e) {
        if(e.button === 0) {
            window.getSelection().removeAllRanges();
        }else if(e.button === 2) {
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
    window.previewOpen = function (data) {
        initDetailData(data);
        refreshDetail();
        box.pagePreview.style.display = 'block';
    }
}())