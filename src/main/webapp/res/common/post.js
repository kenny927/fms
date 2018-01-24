/**
 * @author: sirius
 * @email: kewei@yofc.com
 * @date: 2016-12-16 与后台交互接口 注意：依赖jquery
 */
var postUtil = {
    submit: function (url, param, target) {
        var tempform = document.createElement("form");
        tempform.action = url;
        tempform.method = "post";
        tempform.style.display = "none"
        if (target) {
            tempform.target = target;
        }

        for (var x in param) {
            var opt = document.createElement("input");
            opt.name = x;
            opt.value = param[x];
            tempform.appendChild(opt);
        }

        var opt = document.createElement("input");
        opt.type = "submit";
        tempform.appendChild(opt);
        document.body.appendChild(tempform);
        tempform.submit();
        document.body.removeChild(tempform);
    },
    call: function (url, jsonParam, callback) {
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: jsonParam,
            timeout: 20000,
            beforeSend: function (msg) {

            },
            success: function (data) {
                callback(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(XMLHttpRequest.status);         200
                // alert(XMLHttpRequest.readyState);     4
                // alert(XMLHttpRequest.responseText);   text
                // alert(textStatus);                    parsererror
                // alert(errorThrown);                   SyntaxError:Unexpected token < in JSON ap position 0
                if(XMLHttpRequest.status == 200 && XMLHttpRequest.readyState ==4 && textStatus == "parsererror" ) {
                    //登录超时,跳转到登录页面
                    window.location.href = "/";
                }
                if(typeof layer !='undefined' && layer){
					layer.msg("请求过程中出现异常",{icon:5},function(){
						layer.closeAll();
					});
                }
            },
            complete: function () {

            }
        });
    },
    /**
     * 同步调用
     */
    syncCall: function (url, jsonParam) {
        return $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            async: false,
            data: jsonParam,
            timeout: 10000,
        }).responseText;
    },
    get: function (url, param) {
        var paramStr = "";
        if (param) {
            paramStr = paramStr + "?";
            for (var x in param) {
                var val = param[x];
                paramStr = paramStr + x + "=" + val + "&";
            }
            if (paramStr.indexOf("&") != -1) {
                paramStr = paramStr.substr(0, paramStr.length - 1);
            }
        }
        window.location.href = url + paramStr;
    }
}
