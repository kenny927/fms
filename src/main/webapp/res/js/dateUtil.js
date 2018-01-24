/**
 * Created by sirius on 2016/12/29.
 */


/*
* 把日期分割到数组中
* */
Date.prototype.toArray = function () {
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
}

/*
* 在当前时间基础上进行时间计算
* */
Date.prototype.DateAdd = function(strInterval, Number,type) {
    var dtTmp = this;
    switch (strInterval) {
        case 's' :
            if(type == "-") {
                return new Date(Date.parse(dtTmp) - (1000 * Number));
            }else {
                return new Date(Date.parse(dtTmp) + (1000 * Number));
            }
        case 'n' :
            if(type == "-") {
                return new Date(Date.parse(dtTmp) - (60000 * Number));
            }else {
                return new Date(Date.parse(dtTmp) + (60000 * Number));
            }

        case 'h' :
            if(type == "-") {
                return new Date(Date.parse(dtTmp) - (3600000 * Number));
            }else {
                return new Date(Date.parse(dtTmp) + (3600000 * Number));
            }

        case 'd' :
            if(type == "-") {
                return new Date(Date.parse(dtTmp) - (86400000 * Number));
            }else {
                return new Date(Date.parse(dtTmp) + (86400000 * Number));
            }

        case 'w' :
            if(type == "-") {
                return new Date(Date.parse(dtTmp) - ((86400000 * 7) * Number));
            }else {
                return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            }

        case 'q' :
            if(type == "-") {
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }else {
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }

        case 'm' :
            if(type == "-") {
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }else {
                return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }

        case 'y' :
            if(type == "-") {
                return new Date((dtTmp.getFullYear() - Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }else {
                return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }

    }
}

/*
*   日期格式化
* */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.FirstDayOfWeek = function () {
    var now = this;
    var nowDayOfWeek = now.getDay();
    var firstDayOfWeek = now.DateAdd("d",nowDayOfWeek,"-");
    return firstDayOfWeek;
}

/*
* 当前时间和指定时间的时间差
* */
Date.prototype.DateDiff = function(strInterval, dtEnd) {
    var dtStart = this;
    if (typeof dtEnd == 'string' )//如果是字符串转换为日期型
    {
        dtEnd = dateUtil.StringToDate(dtEnd);
    }
    switch (strInterval) {
        case 's' :return parseInt((dtEnd - dtStart) / 1000);
        case 'n' :return parseInt((dtEnd - dtStart) / 60000);
        case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
        case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
        case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
        case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
    }
}


/*
* 当前日期所在月的最大天数
* */
Date.prototype.MaxDayOfDate = function()
{
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0],ary[1],1));
    var date2 = date1.DateAdd('m',1,"+");
    var result = dateUtil.daysBetween(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));
    return result;
}

var dateUtil = {
    daysBetween: function (DateOne, DateTwo) {
        var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
        var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
        var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

        var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
        var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
        var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

        var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
        return Math.abs(cha);
    },
    StringToDate: function (DateStr) {
        var converted = Date.parse(DateStr);
        var myDate = new Date(converted);
        if (isNaN(myDate)) {
//var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';
            var arys = DateStr.split('-');
            myDate = new Date(arys[0], --arys[1], arys[2]);
        }
        return myDate;
    }
}