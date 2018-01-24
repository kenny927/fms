/**
 * Created by hevenzheng on 2017/5/17.
 */
$(document).on("keyup", "input.unitCheck",function(event){
    var unitName = $(this).attr("unitName");
    if(!unitName || unitName == '') {
        return;
    }
    //根据单位名称获取输入小数位数
    var precision = unitConfig[unitName];
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
    var numRex = "";
    for(var i =0;i<precision;i++) {
        numRex += '\\d';
    }
    var re = new RegExp( "^(\\-)*(\\d+)\\.("+numRex+").*$", "gi");
    value = value.replace(re,'$1$2.$3');
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

function renderUnitDisplay() {
    $.each($(".unitDisplay"), function (index, item) {
    	console.log($(item).val());
        var value = $(item).val();
        var type = "value";
        if(!value) {
            value = $(item).text();
            type = "text";
        }
        var unitName = $(item).attr("unitName");
        var precision = unitConfig[unitName];
        try {
            if(type == "value") {
                $(item).val(parseFloat(value).toFixed(precision));
            } else if(type == "text") {
                $(item).text(parseFloat(value).toFixed(precision));
            }
        } catch(e) {
            console.log(e);
        }
    });
}

$(function () {
    renderUnitDisplay();
});