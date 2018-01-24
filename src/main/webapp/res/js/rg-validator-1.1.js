var RgValidatorParam = {
    valid_default_html : '<span class="jun-success-msg iconfont icon-tongguo c-g fz18" style="position: absolute;left: 100%; margin-left:4px;top: 8px;"></span>',
    inValid_icon_default : '<span class="rg_error_icon jun-danger-msg iconfont icon-jinggao-copy c-f" style="top: 6px;right: 10px;position: absolute;"></span>',
    fieldInType_default : 'div',
    invalidMessage_class_default : ' iconfont c-f jun-ch fz12 '
}

var RgValidator = function (ops) {
    var valid_html = '';
    var inValid_html = '';
    var inValid_icon = '';
    var invalidMessage_class = '';
    var fieldInType = '';

    var options = ops;
    var invalidMessage_style = '';
    var invalidIconOnlyWhileRequired = true;
    var noSuccessIconForNotRequired = false;
    _init_default();
    _init();

    function _init_default(){
        valid_html = RgValidatorParam.valid_default_html;
        inValid_icon = RgValidatorParam.inValid_icon_default;
        invalidMessage_class = RgValidatorParam.invalidMessage_class_default;
        fieldInType = RgValidatorParam.inValid_icon_default;
    }

    function _init(){
        fieldInType = RgValidator.getExitsVariable(options.fieldInType, fieldInType);
        valid_html = RgValidator.getExitsVariable(options.valid, valid_html) ;
        inValid_html = RgValidator.getExitsVariable(options.invalid, inValid_html);
        inValid_icon = RgValidator.getExitsVariable(options.invalidIcon, inValid_icon);
        invalidMessage_class = RgValidator.getExitsVariable(options.invalidMessageClass, invalidMessage_class);
        invalidMessage_style = RgValidator.getExitsVariable(options.invalidMessageStyle, invalidMessage_style);
        invalidIconOnlyWhileRequired = RgValidator.getExitsVariable(options.invalidIconOnlyWhileRequired, invalidIconOnlyWhileRequired);
        noSuccessIconForNotRequired = RgValidator.getExitsVariable(options.noSuccessIconForNotRequired, noSuccessIconForNotRequired);
    }
    /**
     * bind validator
     * */
    this.bindValidator = function() {
        var form = $('#' + options.form);
        var that = this;
        $.each(form.find('input[rg-validate-field], select[rg-validate-field]'), function(n, item) {
            var validateField = $(this).attr("rg-validate-field");
            var validator = options.fields[validateField];
            if (validator) {
                that.rgValidateField($(this), validator);
            }
        });
        return this;
    }
    /**
     * validate on submit
     * */
    this.validateOnSubmit = function(options) {
        var resultValidation = "";
        var form = $('#' + options.form);
        noSuccessIconForNotRequired = options.noSuccessIconForNotRequired || false;
        $.each(form.find('.rg_group input[rg-validate-field],.rg_group select[rg-validate-field]'), function() {
            var validateField = $(this).attr("rg-validate-field");
            var validator = options.fields[validateField];
            if (validator) {
                resultValidation = resultValidation + rgValidateFieldOnSubmit($(this), validator);
            }
        });
        return resultValidation;
    }

    /**
     * bind sigle validation event
     * */
    this.rgValidateField = function(inputObj, validator) {
        // alert(JSON.stringify(inputObj));
        var that = this;
        if (validator.validators) {
            inputObj.on('change', function() {
                that.rgValidateFieldOne(inputObj, validator);
            });
        }
        return "";
    }
    /**
     *validate some input|select field
     * */
    this.rgValidateFieldOne = function(inputObj, validator){
        var resultValidation = "";
        resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "notEmpty") : resultValidation;
        var required_check_result = false;
        if(resultValidation == ''){
            required_check_result = true;
        }
        resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "regexp") : resultValidation;
        resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "service") : resultValidation;
        resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "csValidating") : resultValidation;

        validateOneShowMessage(inputObj, resultValidation, validator.group||'');
        if(noSuccessIconForNotRequired && validator.validators["notEmpty"]){
            validateOneShowMessage(inputObj, resultValidation, '', true, required_check_result);
        }else{
            validateOneShowMessage(inputObj, resultValidation, '',false, required_check_result);
        }

        //添加校验成功call back
        var callback = validator.callback || '';
        if (callback != '') {
            var func = eval(callback);
            func.call(this, resultValidation);
        }
        return resultValidation;
    }

    /**
     * get options
     * */
    this.getOptions = function(){
        return options;
    }

    /**
     * private method area
     * */

    var rgValidateFieldOnSubmit = function(inputObj, validator) {
        // alert(JSON.stringify(inputObj));
        var resultValidation = "";
        if (validator.validators) {
            resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "notEmpty") : resultValidation;
            var required_check_result = false;
            if(resultValidation == ''){
                required_check_result = true;
            }
            resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "regexp") : resultValidation;
            resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "service") : resultValidation;
            resultValidation = resultValidation == "" ? validateOneByOne(inputObj, validator, "csValidating") : resultValidation;
            if(validator.validators["nothing"]){
                validateOneShowMessage(inputObj, resultValidation, true);
            }else if(this.noSuccessIconForNotRequired && validator.validators["notEmpty"]){
                validateOneShowMessage(inputObj, resultValidation, '', true, required_check_result);
            }else{
                validateOneShowMessage(inputObj, resultValidation, '', false, required_check_result);
            }
        }
        return resultValidation;
    }


    var validateOneByOne = function (inputObj, validator, item) {
        var keys = (JSON.stringify(validator.validators)).match(eval("/" + item + "\\d*/gi"));
        if(keys == null){
            var validatorItem = validator.validators[item];
            if (validatorItem) {
                var func = eval("rgValidateField_" + item);
                if (func.call(this, inputObj, validatorItem)) {
                    //return "";
                } else {
                    return validatorItem.message;
                }
            }
        }else {
            for (var i = 0; i < keys.length; i++) {
                var validatorItem = validator.validators[keys[i]];
                if (validatorItem) {
                    var func = eval("rgValidateField_" + item);
                    if (func.call(this, inputObj, validatorItem)) {
                        //return "";
                    } else {
                        return validatorItem.message;
                    }
                }
            }
        }
        return "";
    }

    var validateOneShowMessage =  function (inputObj, message, group, noSuccessIconForNotRequired, required_check_result) {
        if (message == "") {
            rgValidateFieldValid_success(inputObj, message, group, noSuccessIconForNotRequired);
        } else {
            rgValidateFieldValid_fail(inputObj, message, group, required_check_result);
        }
    }

    /**
     * 验证成功
     */
    var rgValidateFieldValid_success = function (inputObj, message, group, noSuccessIconForNotRequired) {
        inputObj.removeClass('bor-ff');
        var rg_group_div = inputObj.parent(fieldInType);
        if (rg_group_div.hasClass("rg_group")) {
            if(typeof(inputObj.attr("rg-validate-group")) == "undefined"){
                //noSuccessIconForNotRequired开启时，非必填字段比显示成功提示
                if(!inputObj.val() && !noSuccessIconForNotRequired){
                    //去除成功图标
                    if (rg_group_div.find(".jun-success-msg").length > 0) {
                        rg_group_div.find(".jun-success-msg").remove();
                    }

                    //去除失败验证信息
                    var messageSpan = rg_group_div.find(".rg_error_msg");
                    if (messageSpan.length > 0) {
                        messageSpan.remove();
                    }
                    var messageIcon = rg_group_div.find(".rg_error_icon");
                    if (messageIcon.length > 0) {
                        messageIcon.remove();
                    }
                    return;
                }
                //添加成功图标
                if (rg_group_div.find(".jun-success-msg").length <= 0) {
                    rg_group_div.append(valid_html);
                }
                //去除失败验证信息
                var messageSpan = rg_group_div.find(".rg_error_msg");
                if (messageSpan.length > 0) {
                    messageSpan.remove();
                }
                var messageIcon = rg_group_div.find(".rg_error_icon");
                if (messageIcon.length > 0) {
                    messageIcon.remove();
                }
            }else{
                //组消息提醒
            }
        }
    }
    /**
     * 验证失败
     */
    var rgValidateFieldValid_fail = function (inputObj, message, group, required_check_result) {
        var rg_group_div = inputObj.parent(fieldInType);
        if (rg_group_div.hasClass("rg_group")) {

            //去除成功图标
            if (rg_group_div.find(".jun-success-msg").length > 0) {
                rg_group_div.find(".jun-success-msg").remove();
            }
            //跟新错误信息
            if (rg_group_div.find(".rg_error_msg")) {
                var messageSpan = rg_group_div.find(".rg_error_msg");
                if(typeof(messageSpan.attr("rg-validate-group")) == "undefined"){
                    //消息不累加
                    messageSpan.remove();
                }else{
                    //group 消息累加
                }
            }
            if(rg_group_div.find('.rg_error_icon').length == 0 && !required_check_result){
                rg_group_div.append(inValid_icon);
            }
            //非空验证成功时，不显示文字提示
            if(required_check_result){
                rg_group_div
                    .append('<span class="' + invalidMessage_class + ' rg_error_msg ' + '">'
                        + message + '</span>   ');
                //格式错误验证失败时，不显示 必填提示图标
                var messageIcon = rg_group_div.find(".rg_error_icon");
                if (messageIcon.length > 0) {
                    messageIcon.remove();
                }
            }
        }
        inputObj.addClass('bor-ff');
        rg_group_div.find('input').addClass('bor-ff');
    }
}

/**
 * 非空验证
 */
var rgValidateField_notEmpty =  function(inputObj, validator) {
    var vallue = RgValidator.rgTrim(inputObj.val());
    if (vallue.length < 1) {
        return false;
    } else {
        return true;
    }
}
/**
 * 正则表达式验证
 */
var rgValidateField_regexp = function(inputObj, validator){
    var value = RgValidator.rgTrim(inputObj.val()) || '';
    if (validator.regexp && value != '') {
        return validator.regexp.test(value);
    }
    return true;
}

/**
 * 输入满足条件后， 调后台同步验证
 * 服务器端验证
 */
var rgValidateField_service = function(inputObj, validator){
    var blresult = true;
    var value = inputObj.val() || '';
    var name = inputObj.attr("name");
    if (validator.url && value != '') {
        /*postUtil.call(validator.url, {checkParam1: value}, function(result) {

         });*/
        var ifregexp= validator.ifregexp || '';
        var doService = false;
        if(ifregexp == ''){
            doService = true;
        }else if(ifregexp.test(value)){
            doService = true;
        }else{
            doService = false;
        }
        if(doService){
            $.ajax({
                url: validator.url,
                type: 'post',
                dataType: 'json',
                data: {checkParam1: value, name : value},
                timeout: 10000,
                async: false,
                success: function (result) {
                    if(result.success){
                        blresult =  result.data;
                    }else{
                        alert(result.message);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        }
    }
    return blresult;
}
/**
 * 自定义验证规则，回调，返回boolean
 * */
var rgValidateField_csValidating = function(inputObj, validator){
    var callback = validator.callback || '';
    if (callback != '') {
        var func = eval(callback);
        return func.call(this, inputObj);
    }
    return true;
}

var rgValidateField_nothing = function(inputObj, validator) {
    return true;
}

RgValidator.rgTrim = function(str)
{
    if(str == null || str == ''){
        return "";
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 重置验证，并清空
 * */
RgValidator.reset = function(obj){
    obj.val("");
    RgValidator.resetValidation(obj);
}

/**
 * 重置验证
 * */
RgValidator.resetValidation = function(obj){
    obj.parent().find(".rg_error_msg").remove();
    obj.parent().find(".rg_error_icon").remove();
    obj.removeClass('bor-ff');
}

RgValidator.getExitsVariable = function (variableName, variableName1) {
    try {
        if (typeof (variableName) == "undefined") {
            return variableName1;
        } else if (variableName == null){
            return variableName1;
        }else {
            return variableName;
        }
    } catch (e) {
    }
    return variableName;
}