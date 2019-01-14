window.onload = function () {
    let printBtn = document.getElementsByClassName('print-btn')[0],
        decBtn = document.getElementsByClassName('dec-btn')[0],
        plBtn = document.getElementsByClassName('pl-btn')[0],
        inBtn = document.getElementsByClassName('in-btn')[0],
        closeBtn = document.getElementsByClassName('close-btn')[0];

    let printSty = document.getElementById('print_style');

    let landscape = `
        @page {
            size: landscape;
        }
    `;

    let portrait = `
        @page {
            size: portrait;
        }
    `;

    let id = location.hash.substr(1);


    let data = getDataById(id);


    if (!data.main || !data.items) {
        alert('未找到对应数据')
        return
    }

    printBtn.addEventListener('click', function () {
        window.print();
    }, false)

    decBtn.addEventListener('click', function () {
        printSty.innerHTML = landscape;
        
        printWrap.innerHTML = exportDec;
    })

    plBtn.addEventListener('click', function () {
        printSty.innerHTML = portrait;

        if(!plHtml) {
            plHtml = createPl(data);
        }
        printWrap.innerHTML = plHtml;
    })

    inBtn.addEventListener('click', function () {
        printSty.innerHTML = portrait;
        if(!inHtml) {
            inHtml = createIn(data);
        }
        printWrap.innerHTML = inHtml;
    })

    closeBtn.addEventListener('click',function() {
        window.close();
    },false)












    function getDataById(id) {
        let data = {};
        // data.items = [];
        data.main = getDataMainById(id);

        data.items = getDataItemsByParentId(id);

        return cloneObject(data);
    }

    function getDataMainById(id) {
        for (let i = 0; i < datas.billMain.length; i++) {
            if (datas.billMain[i].id === id) {
                return datas.billMain[i];
            }
        }

    }

    function getDataItemsByParentId(id) {
        let items = [];
        datas.billDetail.forEach(function (item) {
            if (item.parentId === id) {
                items[item.index] = item;
            }
        });
        return items;
    }

    function cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    }


    function createExportDec(data) {
        let html = '';
        let pages = Math.ceil(data.items.length / 6);

        for (let i = 0; i < pages; i++) {

            html += `
            <div class="export-dec">
                <div class="e-header">
                    <div class="e-logo">
                        <img src="img/customsLogo.png" alt="">
                    </div>
                    <h1>中华人民共和国海关出口货物报关单</h1>
                </div>
                <div class="e-code-wrap clear">
                    <div class="col w-480">
                        预录入编号:
                    </div>
                    <div class="col w-887">
                        海关编号:
                    </div>
                    <div class="col w-20">
                        页码/页数:${i+1}/${pages}
                    </div>
                </div>
                <div class="e-body">
                    <div class="line h-43">
                        <div class="col w-461">
                            <p>境内发货人</p>
                            ${datas.company.companyNameChs}
                        </div>
                        <div class="col w-243">
                            <p>出境关别</p>
                            <input type="text" class="e-inp">
                        </div>
                        <div class="col w-282">
                            <p>出口日期</p>
                                <input type="text" class="e-inp" value="${data.main.exportDate}">
                        </div>
                        <div class="col w-226">
                            <p>申报日期</p>
                            ${data.main.documentDate}
                        </div>
                        <div class="col w-270">
                            <p>备案号</p>
                            ${data.main.recordNumber}
                        </div>
                    </div>

                    <div class="line h-43">
                        <div class="col w-461">
                            <p>境外收货人</p>
                            <input type="text" class="e-inp" value="${data.main.consignee.split('\n')[0]}">
                        </div>
                        <div class="col w-243">
                            <p>运输方式</p>
                            ${data.main.transportationMode}
                        </div>
                        <div class="col w-282">
                            <p>运输工具名称及航次号</p>
                            ${data.main.conveyance}
                        </div>
                        <div class="col w-496">
                            <p>提运单号</p>
                            ${data.main.blNumber}
                        </div>
                    </div>

                    <div class="line h-43">
                        <div class="col w-461">
                            <p>生产销售单位</p>
                            ${datas.company.companyNameChs}
                        </div>
                        <div class="col w-243">
                            <p>监管方式</p>
                            ${data.main.tradeMode}
                        </div>
                        <div class="col w-282">
                            <p>征税性质</p>
                            ${data.main.taxation}
                        </div>
                        <div class="col w-496">
                            <p>许可证号</p>
                            ${data.main.licenseNumber}
                        </div>
                    </div>

                    <div class="line h-43">
                        <div class="col w-461">
                            <p>合同协议号</p>
                            ${data.main.contractNumber}
                        </div>
                        <div class="col w-243">
                            <p>贸易国(地区)</p>
                            ${data.main.tradeStateChs}
                        </div>
                        <div class="col w-282">
                            <p>抵运国(地区)</p>
                            ${data.main.destinationStateChs}
                        </div>
                        <div class="col w-226">
                            <p>指运港</p>
                            ${data.main.destinationPortChs}
                        </div>
                        <div class="col w-270">
                            <p>离境口岸</p>
                            ${data.main.loadingPortChs}
                        </div>
                    </div>

                    <div class="line h-43">
                        <div class="col w-461">
                            <p>包装种类</p>
                            ${data.main.packaging}
                            </div>
                        <div class="col w-68">
                            <p>件数</p>
                            ${data.main.allPackagesNumber}
                            </div>
                        <div class="col w-175">
                            <p>毛重(千克)</p>
                            ${data.main.allGrossWeight}
                            </div>
                        <div class="col w-172">
                            <p>净重(千克)</p>
                            ${data.main.allNetWeight}
                            </div>
                        <div class="col w-110">
                            <p>成交方式</p>
                            ${data.main.priceTerms}
                            </div>
                        <div class="col w-166">
                            <p>运费</p>
                            ${data.main.freight}
                            </div>
                        <div class="col w-165">
                            <p>保费</p>
                            ${data.main.premium}
                            </div>
                        <div class="col w-165">
                            <p>杂费</p>
                            ${data.main.otherCharge}
                            </div>
                    </div>

                    <div class="line h-43">
                        <div class="col w-whole">
                            <p>随附单证及编号</p>
                                <input type='text' class="e-inp">
                        </div>
                    </div>

                    <div class="line h-100">
                        <div class="col w-whole">
                            <p>标记唛码及备注</p>
                                <textarea class="e-marks"></textarea>
                            </div>
                    </div>

                    <div class="line e-title h-24">
                        <div class="col w-whole">
                            <span class="w-54">项号</span>
                            <span class="w-114">商品编号</span>
                            <span class="w-520">商品名称及规格型号</span>
                            <span class="w-142">数量及单位</span>
                            <span class="w-114">单价/总价/币制</span>
                            <span class="w-100">原产国(地区)</span>
                            <span class="w-122">最终目的国(地区)</span>
                            <span class="w-240">境内货源地</span>
                            <span class="w-72">征免</span>
                        </div>
                    </div>

                    <ul class="e-item-box">
                    `;

            for (let j = 6 * i; j < 6 * (i + 1); j++) {
                if(data.items[j]) {
                    html += `
                        <li class="e-item">
                            <div class="w-54 e-item-index">
                                <p>${j + 1}</p>
                            </div>
                            <div class="w-114 e-item-code">
                                <p>${data.items[j].hsCode}</p>
                            </div>
                            <div class="w-520 e-item-product">
                                <p>${data.items[j].productNameChs}</p>
                                <p>${data.items[j].productInfo}</p>
                            </div>
                            <div class="w-142 e-item-quantity">
                                <p>${data.items[j].quantity} ${data.items[j].unitChs}</p>
                                <p><input type="text"></p>
                                <p><input type="text"></p>
                            </div>
                            <div class="w-114 e-item-currency">
                                <p>${data.items[j].unitPrice}</p>
                                <p>${data.items[j].amount}</p>
                                <p>${data.items[j].currency}</p>
                            </div>
                            <div class="w-100 e-item-from">
                                <p>中国</p>
                            </div>
                            <div class="w-122 e-item-to">
                                <p>${data.main.tradeStateChs}</p>
                            </div>
                            <div class="w-240 e-item-place">
                                <p>${data.items[j].manufacturePlace}</p>
                            </div>
                            <div class="w-72 e-item-taxation">
                                <p>照章征税</p>
                            </div>
                        </li>
                    `;
                }else {
                    html += `<li class="e-item"></li>`
                }
            }

            html += `            
                </ul>

                <div class="line h-36 e-total">

                </div>
                <div class="line e-footer h-72">
                    <div class="col w-980">
                        <p class="clear">
                            <span class="w-165">报关人员</span>
                            <span class="w-226">报关人员证号</span>
                            <span class="w-165">电话</span>
                            <span>兹声明对以上内容承担如是申报、依法纳税之法律责任</span>
                        </p>
                        <p class="h-24"></p>
                        <p class="clear">
                            <span class="w-796">申报单位</span>
                            <span>申报单位(签章)</span>
                        </p>
                    </div>
                    <div class="col w-502">
                        <p>&nbsp;海关批准签章</p>
                    </div>
                </div>
            </div>
        </div>
            `;
        }
        
        return html;
    }


    function createIn(data) {
        let html = `
            <div class="trade-document">
                <div class="td-header">
                    <h1>${datas.company.companyNameChs}</h1>
                    <h3>${datas.company.companyNameEn}</h3>
                    <h3>${datas.company.companyAddressEn}</h3>
                    <h2>发票</h2>
                    <h2>INVOICE</h2>
                    <div class="td-info">
                        <div class="float-l w-520 consingee-info">
                            <p>
                                <span>TO:</span>
                                ${data.main.consignee}
                            </p>
                        </div>
                        <div class="float-r document-info">
                            <p>
                                <span>
                                    Invoice No.:
                                </span>
                                <span>
                                    ${data.main.contractNumber}
                                </span>
                            </p>
                            <p>
                                <span>
                                    Date:
                                </span>
                                <span>
                                    ${data.main.documentDate}
                                </span>
                            </p>
                            <p>
                                <span>
                                    Load Port：
                                </span>
                                <span>
                                    ${data.main.loadingPortEn} CHINA
                                </span>
                            </p>
                            <p>
                                <span>
                                    Destination：
                                </span>
                                <span>
                                    ${data.main.destinationPortEn} ${data.main.destinationStateEn}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="td-body">
                    <div class="in-item-title">
                        <span class="w-142">Marks & Nos.</span>
                        <span class="w-320">Descriptions</span>
                        <span class="w-142">Quantities</span>
                        <span class="w-142">Unit Price</span>
                        <span class="w-142">Amount</span>
                    </div>
                    <div class="in-item-content">
                        <div class="in-marks">
                            <p>
                                N/M
                            </p>
                        </div>
                        <div class="in-item-box">
                            <ul>
            `;
        

        for(let i = 0; i < data.items.length; i++) {
            html += `
            <li class="clear">
                <span class="w-320">${data.items[i].productNameEn}</span>
                <span class="w-142">${data.items[i].quantity} ${data.items[i].unitEn}</span>
                <span class="w-142">${data.items[i].currency} ${data.items[i].unitPrice}</span>
                <span class="w-142">${data.items[i].currency} ${data.items[i].amount}</span>
            </li>
            `;
        }

        html += `
                </ul>
                </div>
            </div>
        </div>
        <div class="in-footer">
                <p class="in-total">
                    TOTAL: USD ${data.main.total}
                </p>
                <p class="in-amount-en">
                    ${amountInEnglish(data.main.total)}
                </p>
        </div>
        </div>
        `;

        return html;
    }


    function createPl(data) {
        let html = `
            <div class="trade-document">
                <div class="td-header">
                <h1>${datas.company.companyNameChs}</h1>
                <h3>${datas.company.companyNameEn}</h3>
                <h3>${datas.company.companyAddressEn}</h3>
                    <h2>箱单</h2>
                    <h2>PACKING LIST</h2>
                    <div class="td-info">
                        <div class="float-l w-520 consingee-info">
                            <p>
                                <span>TO:</span>
                                ${data.main.consignee}
                            </p>
                        </div>
                        <div class="float-r document-info">
                            <p>
                                <span>
                                    Invoice No.:
                                </span>
                                <span>
                                    ${data.main.contractNumber}
                                </span>
                            </p>
                            <p>
                                <span>
                                    Date:
                                </span>
                                <span>
                                    ${data.main.documentDate}
                                </span>
                            </p>
                            <p>
                                <span>
                                    Load Port：
                                </span>
                                <span>
                                    ${data.main.loadingPortEn} CHINA
                                </span>
                            </p>
                            <p>
                                <span>
                                    Destination：
                                </span>
                                <span>
                                    ${data.main.destinationPortEn} ${data.main.destinationStateEn}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="td-body">
                    <div class="pl-item-title clear">
                        <span class="w-142">Marks & Nos.</span>
                        <span class="w-282">Descriptions</span>
                        <span class="w-72">Packages</span>

                        <span class="w-100">Quantities</span>
                        <span class="w-100">G.W (KGS)</span>
                        <span class="w-100">N.W(KGS)</span>
                        <span class="w-100">Measurement (CBM)</span>
                    </div>
                    <div class="pl-item-content">
                        <div class="pl-marks">
                            <p>
                                N/M
                            </p>
                        </div>
                        <div class="pl-item-box">
                            <ul>
            `;

            for(let i = 0; i < data.items.length; i++) {
                html += `
                <li class="clear">
                    <span class="w-282">${data.items[i].productNameEn}</span>
                    <span class="w-72">${data.items[i].packagesNumber}</span>
                    <span class="w-100">${data.items[i].quantity}</span>
                    <span class="w-100">${data.items[i].grossWeight}</span>
                    <span class="w-100">${data.items[i].netWeight}</span>
                    <span class="w-100">${data.items[i].volume}</span>
                    
                </li>
                `;
            }

            html += `
                        </ul>
                        </div>                    
                    </div>
                </div>

                <div class="pl-footer">
                        <p class="pl-total">
                            TOTAL: 
                            <span>${data.main.allPackagesNumber}PACKAGES</span>
                            <span>${data.main.allGrossWeight}KGS</span>
                            <span>${data.main.allNetWeight}KGS</span>
                            <span>${data.main.allVolume}CBM</span>
                        </p>
                </div>
            </div>
            `;

            return html;
    }


    let printWrap = document.getElementsByClassName('print-wrap')[0];    

    let exportDec = createExportDec(data);
    let inHtml;
    let plHtml;
    printWrap.innerHTML = exportDec;
}