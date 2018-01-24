/**
 * Created by roger on 2017/6/28.
 */
function countDown(begintime,currenttime, item, downMsg, upMsg, downTitle){
    var counterDesc_elem = item.find('.counterDesc');
    var end_time = new Date(begintime).getTime(),//月份是实际月份-1
        sys_second = (end_time-new Date(currenttime).getTime())/1000;
    var sys_pass_second = 0-sys_second;
    downMsg = downMsg || "";
    upMsg = upMsg || "";
    if (sys_second > 1) {
        countDownChange(null, sys_second, item, downTitle || "还剩", downMsg);
    }else{
        countDownChange(null, sys_pass_second, item, "已超过", upMsg);
    }
    var timer = setInterval(function(){
        if (sys_second > 1) {
            sys_second -= 1;
            if(sys_second<=1){
            	sys_pass_second = -1;
            }
            countDownChange(this, sys_second, item, downTitle || "还剩", downMsg);
        } else {
            sys_pass_second += 1;
            countDownChange(this, sys_pass_second, item, "已超过", upMsg);
        }

    }, 1000);
}

function countDownChange(e, second, item, title, msg){
    if(msg == '') {
        countDownView(second, item);
        item.find('.counterDesc').text(title);
    }else{
        if(e != null) {
            clearInterval(e);
        }
        item.empty();
        item.html(msg);
    }
}

function countDownView(sys_second, item){
    var day_elem = item.find('.day');
    var hour_elem = item.find('.hour');
    var minute_elem = item.find('.minute');
    var second_elem = item.find('.second');
    var day = Math.floor((sys_second / 3600) / 24);
    var hour = Math.floor((sys_second / 3600) % 24);
    var minute = Math.floor((sys_second / 60) % 60);
    var second = Math.floor(sys_second % 60);
    day_elem && $(day_elem).text(day);//计算天
    $(hour_elem).text(hour<10?"0"+hour:hour);//计算小时
    $(minute_elem).text(minute<10?"0"+minute:minute);//计算分钟
    $(second_elem).text(second<10?"0"+second:second);//计算秒杀

    if(day > 0){
        $(day_elem).show();
        item.find('.dayDesc').show();
    }
}