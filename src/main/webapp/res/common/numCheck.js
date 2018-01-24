/**
 * Created by hevenzheng on 2017/3/16.
 */
$(document).off("keyup", "input.num2");
$(document).on("keyup", "input.num2",function(event){
    var min = 0;
    var max = null;
    var value = event.target.value;
    if(value == null || value == "") {
        return;
    }
    value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g,""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    var finalValue = 0;
    if($.isNumeric(value)) {
        if(value < min) {
            finalValue = min;
        } else if(value != null && value !="" && max != null && value > max){
            finalValue = max;
        } else {
            finalValue =value;
        }
    }
    $(event.target).val(finalValue);
});



$(document).off("keyup", "input.num3");
$(document).on("keyup", "input.num3",function(event){
    var min = 0;
    var max = null;
    var value = event.target.value;
    if(value == null || value == "") {
        return;
    }
    value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g,""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    var finalValue = 0;
    if($.isNumeric(value)) {
        if(value < min) {
            finalValue = min;
        } else if(value != null && value !="" && max != null && value > max){
            finalValue = max;
        } else {
            finalValue =value;
        }
    }
    $(event.target).val(finalValue);
});
