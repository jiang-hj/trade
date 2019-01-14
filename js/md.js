/**
 * @description 自定义日历
 * @class Md
 * @param {Element} dom input的父节点
 */
function Md(dom) {
    this.dom = dom;
    this.input = dom.getElementsByTagName('input')[0];
    this.node = null;
    this.head = null;
    this.dateBtn = null;
    this.body = null;
    this.foot = null;
    this.yBox = null;
    this.mBox = null;
    this.dBox = null;
    this.dtable = null;
    this.dateObj = {};
    this.dateStr = '';
    this.ONEDAY = 24 * 3600 * 1000;
    this.init();
}

/**
 * @description 判断是否为闰年
 * @param {Number} year
 */
Md.prototype.isLeapYear = function (year) {
    if (year % 400 === 0) {
        return true
    }
    if (year % 100 !== 0 && year % 4 === 0) {
        return true
    }
    return false
}

/**
 * @method daysOfMonth  获取该月天数
 */
Md.prototype.daysOfMonth = function (year, month) {
    if (month === 2) {
        if (this.isLeapYear(year)) {
            return 29
        } else {
            return 28
        }
    }

    if (month < 8 && month >= 1) {
        if (month % 2 === 0) {
            return 30
        } else {
            return 31
        }
    }

    if (month >= 8 && month <= 12) {
        if (month % 2 === 0) {
            return 31
        } else {
            return 30
        }
    }

    throw '输入日期错误' + year + month;
}


/**
 * @description 获取这天是周几，（1-7）
 */
Md.prototype.whatDay = function (year, month, day) {
    let date = new Date(year, month - 1, day);
    let d = date.getDay();
    return d > 0 ? d : 7
}

/**
 * @description 某月的第一天是周几
 */
Md.prototype.whatFirstDayOfMonth = function (year, month) {
    return this.whatDay(year, month, 1);
}


/**
 * @description 某月最后一天是星期几
 */
Md.prototype.whatLastDayOfMonth =function (year, month) {
    let day = this.daysOfMonth(year, month);
    return this.whatDay(year, month, day);
}

/**
 * @description date 转 year/month/day
 */
Md.prototype.date2Str = function(date) {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

/**
 * @description year/month/day 转 date 
 */
Md.prototype.str2Date = function(str) {
    return new Date(Date.parse(str))
}

/**
 * @description year/month/day 转 {year,month,day} 形式对象
 */
Md.prototype.str2Obj = function(str) {
    let tempArr = str.split('/');
    return {
        year: +tempArr[0],
        month: +tempArr[1],
        day: +tempArr[2]
    }
}

/**
 * @description 将date对象转为 {year,month,day} 形式对象
 */
Md.prototype.date2Obj = function(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    }
}

/**
 * @description 返回今天 {y，m，d} 对象
 */
Md.prototype.getTodayObj = function() {
    let today = new Date();
    return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    }
}

/**
 * @description 将 {year,month,day} 形式对象 转为 date对象
 */
Md.prototype.obj2Date = function(obj) {
    return new Date(obj.year,obj.month,obj.day);
}

Md.prototype.isDateEqual = function(obj1,obj2) {
    return (obj1.year == obj2.year && obj1.month == obj2.month &&obj1.day == obj2.day) 
}

/**
 * @description 将 {year,month,day} 形式对象 year/month/day 形式字符串
 */
Md.prototype.obj2Str = function(obj) {
    if(+obj.month < 10) {
        obj.month = '0' + obj.month;
    }
    if(+obj.day < 10) {
        obj.day = '0' + obj.day;
    }
    return obj.year + '/' + obj.month + '/' + obj.day
}


/**
 * @description 根据输入返回一个 {year,month,day} 的数组；
 * @param {Number|String} year 年
 * @param {Number|String} month 月
 * @param {Number|String} day 日
 * @param {Number|String} diff 
 * 差值  0：返回从day到该月最后一天，
 * 正：返回从day到之后的diff天
 * 负返回从前day的前 -diff天起到 之后的diff天（不包含day这一天）
 * @returns {Array} 数组
 */
Md.prototype.createDateArr = function (year, month, day, diff) {
    let obj = this.correctMonth(year,month)
    month = obj.month;
    year = obj.year;
    diff = diff || this.daysOfMonth(year,month,day) - day + 1;

    let date = new Date(year,month-1,day),
        oneDayTime = 1000 * 60 * 60 * 24,
        arr = [],
        time;


    if(diff < 0) {
        diff = -diff;
        time = date.getTime() - diff * oneDayTime;
        date = new Date(time); 
    }

    for(let i = 0; i < diff; i++) {
        arr.push(this.date2Obj(date));
        time = date.getTime() + oneDayTime;
        date = new Date(time);
    }

    return arr;
}

/**
 * @description 该月日历所需要显示的日期；
 */
Md.prototype.createCalendarArr = function (year, month) {
    year = +year;
    month = +month;
    let firstDay = this.whatFirstDayOfMonth(year, month),
        lastDay = this.whatLastDayOfMonth(year, month),
        arr = [];
    if (firstDay > 1) {
        arr = arr.concat(this.createDateArr(year, month, 1, 1 - firstDay));
    }
    arr = arr.concat(this.createDateArr(year, month, 1));
    if (lastDay < 7) {
        arr = arr.concat(this.createDateArr(year, month + 1, 1, 7 - lastDay));
    }

    return arr;
}


/**
 * @description 当month > 12 或 month < 1 时，对year进行修正；用于month的加减；
 */
Md.prototype.correctMonth = function (year, month) {
    while (month > 12) {
        month -= 12;
        year++;
    }

    while (month < 1) {
        month += 12;
        year--;
    }

    return {
        year: year,
        month: month
    }
}

/**
 * @description 创建一个年份数组；
 */
Md.prototype.createYearArr = function (year,count) {
    count = count || 20;
    let arr = [];
    for(let i = 0; i < count; i++) {
        arr.push(year++);
    }
    return arr;
}

/**
 * @description 能被count 小于year 的最大值
 */
Md.prototype.yearBegin = function(year, count) {
    count = count || 20;
    return year - year % count
}

/**
 * @description 返回某月日历的表格结构
 * @param dateStr 设为选中样式的日期
 */
Md.prototype.getCalendarHtml = function(year,month,dateStr) {
    let html = '',
        arr = this.createCalendarArr(year,month),
        dateObj = this.str2Obj(dateStr),
        className,
        item;
    for(let i=0, len = arr.length; i < len / 7; i++) {
        html += '<tr>';
        for(let j = 0; j < 7; j++) {
            item = arr[7 * i + j];
            className = '';
            if(this.isDateEqual(this.getTodayObj(),item)) {
                className = 'md-td-today'
            }
            if(month != item.month) {
                className += ' md-td-diff';
            }else if(this.isDateEqual(dateObj,item)) {
                className += ' md-td-sel';
            }
            className = 'class="' + className +'"';
            html += `<td ${className ? className : ''} data-date="${this.obj2Str(item)}">${+item.day}</td>`;
        }
        html += '</tr>'
    }

    return html
}

/**
 * 年份选择的html结构
 */
Md.prototype.getYearHtml = function(year,count) {
    let html = '',
        arr = this.createYearArr(year,count),
        item;
    
    html = '<ul>'
    for(let i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        html += `<li class="md-li-year" data-year="${item}">${item}</li>`;
    }
    html +='</ul>';

    return html
}

/**
 * @description 月份html 结构；
 */
Md.prototype.getMonthHtml = function() {
    let html = '',
        arr = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        item;

        html = '<ul>'
        for(let i = 0, len = arr.length; i < len; i++) {
            item = arr[i];
            html += `<li class='md-li-month' data-month="${i + 1}">${item}</li>`;
        }
        html +='</ul>';
    
        return html
}

Md.prototype.mainHtml = function() {
    let html = `
        
            <div class="md-head">
                <a href="#" class="md-date-btn">${this.dateObj.year + '年' + this.dateObj.month +'月'}</a>
                <div class="md-btn-wraper">
                    <i class="md-prev left-arrow"></i>
                    <i class="md-next right-arrow"></i>
                </div>
            </div>
            <div class="md-body">
                <div class="md-day-box">
                    <table>
                        <thead>
                            <tr>
                                <th>一</th>
                                <th>二</th>
                                <th>三</th>
                                <th>四</th>
                                <th>五</th>
                                <th>六</th>
                                <th>日</th>
                            </tr>
                        </thead>
                        <tbody class="md-tb">  
                            ${this.getCalendarHtml(this.dateObj.year,this.dateObj.month,this.dateStr)}
                        </tbody>
                    </table>
                </div>
                <div class="md-month-box">
                    ${this.getMonthHtml()}
                </div>
                <div class="md-year-box">
                </div>
            </div>
            <div class="md-foot">
                <i class="md-today">今天</i>
                <i class="md-clear">清空</i>
            </div>
        
    `;

    return html;
}

/**
 * @description 将this.dateObj保存的日期加一天
 */
Md.prototype.nextDay = function() {
    let time = Date.parse(this.obj2Str(this.date2Obj));
    time = time + this.ONEDAY;
    let date = new Date(time);
    this.dateObj = this.date2Obj(date);
}

/**
 * @description 将this.dateObj保存的日期减一天
 */
Md.prototype.prevDay = function() {
    let time = Date.parse(this.obj2Str(this.date2Obj));
    time = time - this.ONEDAY;
    let date = new Date(time);
    this.dateObj = this.date2Obj(date);
}

/**
 * @deprecated 通过 y/m/d格式字符串给 this.dateObj设值
 */
Md.prototype.initDate = function(str) {
    this.dateStr = str;
    this.dateObj = this.str2Obj(str);
}

/**
 * @deprecated 通过 string格式字符串给 this.dateObj.month设值
 */
Md.prototype.setMonth = function(month) {
    this.dateObj.month = this.str2Obj(month);
}

/**
 * @deprecated 通过 string格式字符串给 this.dateObj.year设值
 */
Md.prototype.setMonth = function(year) {
    this.dateObj.year = this.str2Obj(year);
}

/**
 * @description 刷新日历内容并显示
 */
Md.prototype.refreshCalendar = function() {
    this.dtable.innerHTML = this.getCalendarHtml(this.dateObj.year,this.dateObj.month,this.dateStr)
    this.body.classList.remove('mb-show');
    this.body.classList.remove('yb-show');
}

/**
 * @description 显示月份选择框
 */
Md.prototype.showMonthBox = function() {
    this.body.classList.remove('yb-show');
    this.body.classList.add('mb-show');
}

/**
 * @description 显示年份选择框
 */
Md.prototype.showYearBox = function() {    
    this.body.classList.remove('mb-show');
    this.body.classList.add('yb-show');    
}

/**
 * @description 通过class 查找组件中的元素
 */
Md.prototype.findByClass = function(className) {
    return this.dom.getElementsByClassName(className)[0];
}

/**
 * @description 通过class查找最近的祖元素
 */
Md.prototype.closestByClass = function(className,el) {

    while(el && el.nodeType != 9 && !el.classList.contains(className)) {
        el = el.parentNode;
    }

    if(el && el.nodeType == 9) {
        return null
    }

    return el
}

Md.prototype.init = function() {
    let self = this;  
    
    
    self.dateObj = self.getTodayObj();
    self.dateStr = self.obj2Str(self.dateObj);

    // 日历主体部分渲染
    self.node = document.createElement('div');
    self.node.className = 'md-box';
    
    self.node.innerHTML = self.mainHtml();

    self.dom.appendChild(self.node);

    self.head = self.findByClass('md-head');
    self.dateBtn = self.findByClass('md-date-btn')
    self.body = self.findByClass('md-body');
    self.foot = self.findByClass('md-foot');
    self.yBox = self.findByClass('md-year-box');
    self.mBox = self.findByClass('md-month-box');
    self.dBox = self.findByClass('md-day-box');
    self.dtable = self.findByClass('md-tb');
    
    self.input.addEventListener('click',function(e) {   
        if(self.dateStr !== this.value) {
            self.dateObj = self.getTodayObj();
            self.dateStr = self.obj2Str(self.dateObj);
            this.value = '';
            self.close();
        }
        
        self.node.classList.toggle('show');
        this.blur();
    },false);

    self.input.addEventListener('change',function(e) {

    })

    document.addEventListener('click',function(e) {
        let target = e.target;

        /**
         * 点击其他区域隐藏
         */
        if(target != self.input) {
            self.close()
        }
        

        

    },false)

    self.node.addEventListener('click',function(e){
        let target = e.target;
        let temp;
        e.stopPropagation();

        /**
         * 日期点击
         */
        if(target.nodeName.toLowerCase() == 'td') {
            self.initDate(target.dataset.date)
            self.input.value = target.dataset.date;
            
            self.close()
        }

        /**
         * 年月按钮点击
         */
        if(target === self.dateBtn) {
            if(self.dateBtn.dataset.flag !== '1') {
                self.showMonthBox();
                self.dateBtn.dataset.flag = '1';
                self.dateBtn.innerHTML = self.dateObj.year + '年'
            }else {
                self.refreshYearBox();
            }
            
        }

        /**
         * 月份点击
         */
        temp = self.closestByClass('md-li-month',target);
        if(temp) {
            self.dateObj.month = +temp.dataset.month;
            self.dateBtn.innerHTML = self.dateObj.year + '年' + self.dateObj.month + '月';
            self.dateBtn.dataset.flag = '0'
            self.refreshCalendar();
        }

        /**
         * 年份点击
         */
        temp = self.closestByClass('md-li-year',target);
        if(temp) {
            self.dateObj.year = +temp.dataset.year;
            self.dateBtn.innerHTML = self.dateObj.year + '年';
            self.showMonthBox()
        }

        /**
         * prev按钮
         */
        temp = self.closestByClass('md-prev',target);
        if(temp) {
            if(self.body.classList.contains('mb-show')) {
                self.prevYear()
            }else if(self.body.classList.contains('yb-show')){
                self.prevTwentyYear()
            }else {
                self.prevMonth()
            }
        }

        /**
         * next按钮
         */
        temp = self.closestByClass('md-next',target);
        if(temp) {
            if(self.body.classList.contains('mb-show')) {
                self.nextYear()
            }else if(self.body.classList.contains('yb-show')){
                self.nextTwentyYear()
            }else {
                self.nextMonth()
            }
        }
        
        /**
         * today按钮
         */
        temp = self.closestByClass('md-today',target);
        if(temp) {
            self.dateObj = self.getTodayObj();
            self.dateStr = self.obj2Str(self.dateObj);
            self.input.value = self.dateStr;
            self.close();
        }

        /**
         * 清空按钮
         */
        temp = self.closestByClass('md-clear',target);
        if(temp) {
            self.dateObj = self.getTodayObj();
            self.dateStr = self.obj2Str(self.dateObj);
            self.input.value = '';
            self.close();
        }

        
    },false)
}


/**
 * 事件部分
 */

/**
 * @description 月份增减
 */
Md.prototype.prevMonth = function() {
    this.monthChange(-1)
}

Md.prototype.nextMonth = function() {
    this.monthChange(1)
}

Md.prototype.monthChange = function(n) {
    let obj = this.correctMonth(this.dateObj.year,this.dateObj.month + n);
    this.dateObj.year = obj.year;
    this.dateObj.month = obj.month;
    this.dateBtn.innerHTML = this.dateObj.year + '年' + this.dateObj.month + '月';
    this.refreshCalendar();
}

Md.prototype.prevYear = function() {
    this.dateObj.year -= 1;
    this.dateBtn.innerHTML = this.dateObj.year + '年';
}

Md.prototype.nextYear = function() {
    this.dateObj.year -= 1;
    this.dateBtn.innerHTML = this.dateObj.year + '年';
}

Md.prototype.prevTwentyYear = function() {
    this.dateObj.year -= 20;
    this.refreshYearBox();
}

Md.prototype.nextTwentyYear = function() {
    this.dateObj.year = +this.dateObj.year + 20;
    this.refreshYearBox();
}

Md.prototype.refreshYearBox = function() {
    let begin = this.yearBegin(this.dateObj.year,20);
    this.dateBtn.innerHTML = begin + '年 -- ' + (begin + 19) + '年';
    this.yBox.innerHTML = this.getYearHtml(begin,20);
    this.showYearBox();
};

Md.prototype.close = function() {
    this.initDate(this.dateStr);
    this.refreshCalendar()
    this.dateBtn.dataset.flag = 0;
    this.dateBtn.innerHTML = this.dateObj.year + '年' + this.dateObj.month + '月'
    this.node.classList.remove('show');
};