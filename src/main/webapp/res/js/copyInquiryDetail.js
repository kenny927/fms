layui.use(['form','laydate'], function() {
    var form = layui.form();
    laydate = layui.laydate;


    form.on('radio(inquiry)', function(data){
        if(data.value="是"){
            _accountId=vm.datas.buyerSellerInfo.buyerAccountId;
            _userId=vm.datas.buyerSellerInfo.buyerUserId;
            _entrustOrderContact=vm.datas.buyerSellerInfo.userRealName;
            _entrustOrderContactMobile=vm.datas.buyerSellerInfo.entrustOrderContactMobile;
            vm.$data.msg1=true;
            vm.$data.msg5=false;
            vm.$data.chooseSystemAccount={
                mobile:vm.datas.buyerSellerInfo.entrustOrderContactMobile,
                accountManagerName:vm.datas.accountManagerName,
                linkman:vm.datas.buyerSellerInfo.entrustOrderContact,
                email:vm.datas.buyerSellerInfo.email,
                accountName:vm.datas.buyerSellerInfo.accountName,
                accountResourceCname:vm.datas.buyerSellerInfo.accountName,
                createDate:vm.datas.buyerSellerInfo.createDate
            };
        }
    });
    form.on('radio(inquiry2)', function(data){
        if(data.value="否"){
            _accountId=vm.datas.buyerSellerInfo.buyerAccountId;
            // vm.$data.msg1=false;
            vm.$data.msg5=true;
            // _accountId="";
        }
    });
    form.on('radio(isNeedInvoiceY)', function(data){
        vm.datas.isNeedInvoice=data.value;
    });
    form.on('radio(isNeedInvoiceN)', function(data){
        vm.datas.isNeedInvoice=data.value;
    });
    //点击生成询单
    form.on('submit(demo1)', function(data){
        var isPass = true;
        var msg = "";
        var errorCount=0;
        //平台商品和自定义商品不能都为空
        if(vm.$data.malls.length == 0 && vm.$data.diys.length == 0) {
            errorCount++;
            msg += "<"+errorCount+">商城商品和自定义商品不能都为空";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }
        if(!offerId){
            if(_accountId=="") {
                errorCount++;
                msg += "<"+errorCount+">请选择工程商";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
        }
        //商城商品
        $.each(vm.malls, function(index,item) {
            //描述长度不能超过100
            // if (item.skuremark.length>100) {
            //     layer.msg('描述长度不能为超过100', {icon: 5});
            //     isPass=false;
            // }
            //数量为数字
            if(vm.$data.msg3){
                if (item.skuOfferPrice=="") {
                    errorCount++;
                    msg += "<"+errorCount+">商城商品报价不能为空";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
                }
            }
            if (isNaN(item.skuQuantity)) {
                errorCount++;
                msg += "<"+errorCount+">数量为数字";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }else if(item.skuQuantity<=0){
                errorCount++;
                msg += "<"+errorCount+">商城商品数量必填且不能为零";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
        })
        //自定义商品验证
        $.each(vm.diys, function(index,item) {
            if (item.skuName == "") {
                errorCount++;
                msg += "<"+errorCount+">自定义商品名称不能为空";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            // if (item.skuMode == "") {
            //     errorCount++;
            //     msg += "<"+errorCount+">自定义商品型号不能为空";
            //     if(errorCount%3==0){
            //         msg+="</br>";
            //     }
            //     isPass = false;
            // }
            if (item.skuBrandName == "") {
                errorCount++;
                msg += "<"+errorCount+">自定义商品品牌不能为空";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            if (isNaN(item.skuQuantity)||item.skuQuantity<=0||item.skuQuantity=="") {
                errorCount++;
                msg += "<"+errorCount+">自定义商品数量只能填数字且不能为零";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            if (item.skuUnitName == "") {
                errorCount++;
                msg += "<"+errorCount+">自定义商品计量单位不能为空";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            if(vm.$data.msg3){
                if (item.skuPrice == "") {
                    errorCount++;
                    msg += "<"+errorCount+">自定义商品报价不能为空";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
                }
            }

        })

        //期望交期
        var expectDeliveryTime = $('#enquire_expectDeliveryTime').val();
        if($.trim(expectDeliveryTime) == "") {
            errorCount++;
            msg += "<"+errorCount+">请选择期望交期";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }

        if(offerType=='distributor' && !vm.offerersAccountId){
            errorCount++;
            msg += "<" + errorCount + ">请选择分销商";
            if (errorCount % 3 == 0) {
                msg += "</br>";
            }
            isPass = false;
        }
        if(!offerType) {
            errorCount++;
            msg += "<" + errorCount + ">请选择报价人";
            if (errorCount % 3 == 0) {
                msg += "</br>";
            }
            isPass = false;
        }
        //*选择平台时候
        //选择有效期
        if(vm.$data.msg3)
        {
            var offerValidUntil = $('#enquire_offerValidUntil').val();
            if ($.trim(offerValidUntil) == "") {
                errorCount++;
                msg += "<" + errorCount + ">请选择有效期时间";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
            //选择回复交期
            /*
            var replyDeliveryDate = $('#enquire_replyDeliveryDate').val();
            if ($.trim(replyDeliveryDate) == "") {
                errorCount++;
                msg += "<" + errorCount + ">请选择回复交期";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
            */          
           /* var deliverDays = $('#deliverDays').val();
            if ($.trim(deliverDays) == "") {
                errorCount++;
                msg += "<" + errorCount + ">请输入付款后多少天发货";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }*/
            
            //运费,商品总价,报价总价金额
            // console.log(vm.offerFreight)
            if(vm.offerFreight==undefined||vm.datas.offerFreight.length==0){
                errorCount++;
                msg += "<" + errorCount + ">请填写运费";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
            if(isNaN(vm.offerSkuTotalPrice)||vm.offerSkuTotalPrice==0){
                errorCount++;
                msg += "<" + errorCount + ">请填写商品报价";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
        }
        // if(!offerId){
        //
        //     if(isNaN(vm.offerSkuTotalPrice)){
        //         errorCount++;
        //         msg += "<" + errorCount + ">请填写商品报价";
        //         if (errorCount % 3 == 0) {
        //             msg += "</br>";
        //         }
        //         isPass = false;
        //     }
        // }
        //省份
        if($.trim(_province) == "") {
            errorCount++;
            msg += "<"+errorCount+">选择项目地省份";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }
        console.log(_city);
        console.log(_province);

        if($.trim(_city) == "") {
            errorCount++;
            msg += "<"+errorCount+">请选择项目地市";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }
        //基本信息校验
        //配送方式选择其他时备注
        var deliveryMode = $('input[name="deliveryMode"]:checked ').val();
        if($.trim(deliveryMode) == "") {
            errorCount++;
            msg += "<"+errorCount+">请选择配送方式";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }else if(deliveryMode == "OTHER" && $.trim($("#deliveryModeRemark").val()) == "") {
            errorCount++;
            msg += "<"+errorCount+">配送方式选择【其他】时请输入具体配送方式";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }
        var consigneeMobile=$('#consigneeMobile').val();
        if($.trim(consigneeMobile) != ""){
            var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
            var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
            if(!reg1.test(consigneeMobile)&&!reg2.test(consigneeMobile)){
                errorCount++;
                msg += "<"+errorCount+">请输入正确的收货人 电话";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
        }
        //结算方式选择订金支付或货到付款时备注必填
        var payMode = $('input[name="payMode"]:checked ').val();
        if($.trim(payMode) == "") {
            errorCount++;
            msg += "<"+errorCount+">请选择支付方式";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }else if(payMode == "DEPOSIT") {
            var remark = $.trim($("#payModeRemark1").val());
            if(remark == "") {
                errorCount++;
                msg += "<"+errorCount+">支付方式选择【订金支付】时请输入支付比例";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            } else {
                if(!$.isNumeric(remark) || parseFloat(remark) > 100 || parseFloat(remark) <= 0) {
                    errorCount++;
                    msg += "<"+errorCount+">支付比例必须为数字且不能大于100不能为负数";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
                }
            }

        } else  if(payMode == "CASH_ON_DELIVERY") {
            var remark = $.trim($("#payModeRemark2").val());
            if(remark == "") {
                errorCount++;
                msg += "<"+errorCount+">支付方式选择【货到付款】时请输入天数";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            } else {
                if(!$.isNumeric(remark)||!(/^[0-9]+$/).test(remark) ) {
                    errorCount++;
                    msg += "<"+errorCount+">货到付款天数必须为数字";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
                }
            }
        }

        var isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val();
        if($.trim(isNeedInvoice) == "") {
            errorCount++;
            msg += "<"+errorCount+">请选择是否开票";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }
        var remark=$("#remark").val();
        if($.trim(remark) != ""&&remark.length>=1001){
            errorCount++;
            msg += "<"+errorCount+">备注长度不超过1000";
            if(errorCount%3==0){
                msg+="</br>";
            }
            isPass = false;
        }

        if(!isPass) {
            layer.open({
                title: '数据填写有误',
                icon: 5,
                skin: 'youskin',
                area: ['550px', '300px'],
                btnAlign: 'c',
                content: msg,
                btn: ['我知道了'],
                yes: function(index1, layero){
                    layer.close(index1);
                },
                cancel: function(){
                    //右上角关闭回调
                }
            });
        }else{
            var param = {};
            param.deliveryMode = $('input[name="deliveryMode"]:checked ').val();
            if(param.deliveryMode == "OTHER") {
                param.deliveryModeRemark = $("#deliveryModeRemark").val();
            }
            param.payMode = $('input[name="payMode"]:checked ').val();//zhifu
            if(param.payMode == "DEPOSIT") {
                param.payModeRemark = $("#payModeRemark1").val();
            } else if(param.payMode == "CASH_ON_DELIVERY") {
                param.payModeRemark = $("#payModeRemark2").val();
            }

            param.isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val();
            param.purchasingRequisitionDesc = vm.datas.purchasingRequisitionDesc;
            var expectDeliveryTime = $('#enquire_expectDeliveryTime').val();
            var offerValidUntil = $('#enquire_offerValidUntil').val();
            //var replyDeliveryDate = $('#enquire_replyDeliveryDate').val();
            var consignee = $('#consignee').val();
            var consigneeAddress = $('#consigneeAddress').val();
            var consigneeMobile = $('#consigneeMobile').val();
            param.offerValidUntil=offerValidUntil;
            //param.replyDeliveryDate=replyDeliveryDate;
            param.deliverDays = $('#deliverDays').val();


            if(offerType=='platform'){
            	param.offerType="PLATFORM_OFFER";
            }else if(offerType=='distributor'){
            	param.offerType="DISTRIBUTOR_OFFER";
            }
            
            if(vm.$data.msg3){              
                param.offerersAccountId="11";
                param.offerFreight=vm.datas.offerFreight;
                param.offerSkuTotalPrice=vm.offerSkuTotalPrice;
                param.offerTotalPrice=vm.offerTotalPrice;
            }else{
                param.offerAccountName=$("#offerAccountName").html();
                param.offerersAccountId=vm.offerersAccountId;
            }
            if(vm.$data.msg5){
                param.buyerUserId=_userId;
                param.buyerAccountId=_accountId;
                param.entrustOrderContact=_entrustOrderContact;
                param.entrustOrderContactMobile=_entrustOrderContactMobile;
                param.parentId="";
            }else{
                if(vm.datas.parentId){
                    param.parentId=vm.datas.parentId;
                }else{
                    param.parentId=offerId;
                }
                param.buyerUserId=_userId;
                param.buyerAccountId=_accountId;
                param.entrustOrderContact=_entrustOrderContact;
                param.entrustOrderContactMobile=_entrustOrderContactMobile;
            }

            param.offerVersionNumber=vm.datas.offerVersionNumber;
            param.offerId=vm.datas.offerId;
            param.purchasingRequisitionDesc=remark;//备注
            param.inquiryOrderProvince =_province;//收货人省份
            param.inquiryOrderCity = _city;//收货人市级
            param.expectDeliveryDate=$('#enquire_expectDeliveryTime').val();//期望交期
            param.offerOtherFeesDesc = vm.datas.offerOtherFeesDesc;
            param.offerOtherFees=vm.datas.offerOtherFees;
            param.attachmentFileListStr=vm.attachmentFileListStr;//附件
            param.customSkuDataList=vm.diys;//自定义商品
            param.skuDataList = vm.malls;//商城商品

            param.dealSign="ForOther";
            
            if(vm.datas.consigneeAddressId){
            	param.consigneeAddressId = vm.datas.consigneeAddressId;
            	param.consignee = vm.datas.consignee;
            	param.consigneeAddress =vm.datas.consigneeAddress;
            	param.consigneeMobile = vm.datas.consigneeMobile;
            }
            if(vm.datas.invoiceAddressId){
            	param.invoiceAddressId = vm.datas.invoiceAddressId;
            	param.invoiceConsignee = vm.datas.invoiceConsignee;
            	param.invoiceConsigneeAddress = vm.datas.invoiceConsigneeAddress;
            	param.invoiceConsigneeMobile =vm.datas.invoiceConsigneeMobile;
            }
            if(vm.datas.invoiceId){
            	param.invoiceId = vm.datas.invoiceId;
            	param.invoiceCorporationAddress = vm.datas.invoiceCorporationAddress;
            	param.invoiceCorporationBankAccount = vm.datas.invoiceCorporationBankAccount;
            	param.invoiceCorporationBankDesc = vm.datas.invoiceCorporationBankDesc;
            	param.invoiceCorporationName = vm.datas.invoiceCorporationName;
            	param.invoiceCorporationPhoneNumber = vm.datas.invoiceCorporationPhoneNumber;
            	param.invoiceEaxpayerIdentificationNumber = vm.datas.invoiceEaxpayerIdentificationNumber;
            }
            
            layer.load();
            postUtil.call("/mallOrder/api/mallInquiry/addMallInquiry", {"jsonData" : JSON.stringify(param)}, function (result) {
            	layer.closeAll('loading');
            	if (result.STATUS == "SUCCESS") {
                    if(offerId){
                        if(vm.$data.msg8){
                            layer.msg("复制成功,询单ID:"+result.DATA);
                            setTimeout(function () {
                                cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
                                cardUtil.changeCard("询价单");
                                cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
                                cardUtil.changeCard("我的询价单");
                                cardUtil.closeCard("复制询价单-"+offerId);
                            },1500);
                        }else {
                            layer.msg("修改成功,询单ID:"+result.DATA);
                        }
                    }else {
                        cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
                        cardUtil.changeCard("询价单");
                        cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
                        cardUtil.changeCard("我的询价单");
                        // layer.msg("新增询单ID:"+result.DATA);
                        cardUtil.closeCard("代客下询单");
                    }
                }else {
                    layer.msg(result.MSG + "");
                }
            });

            console.log(param);
        }
    })
})


var areaData = Area;
var $form;
var form;
var $;
// layui.use('form', function() {
//     form = layui.form();
//     $form =$($('.form-css')[0]);
//     loadProvince();
// });
function loadProvince() {
    var proHtml = '';
    var proHtml1 = '<option class="option1" value="' +"" + '" selected>' +
        "全部" + '</option>';
    var proHtml2 = '<option class="option2" value="' +"" + '" selected>' +
        "全部" + '</option>';
    for(var i = 0; i < areaData.length; i++) {
        if(_province != '' && _province == areaData[i].provinceName) {
            proHtml1 += '<option class="option1" value="' + areaData[i].provinceName + '" selected='+'"selected">' +
                areaData[i].provinceName + '</option>';
            proHtml2 += '<option class="option2" value="' + areaData[i].provinceName + '" selected='+'"selected">' +
                areaData[i].provinceName + '</option>';
        } else {
            proHtml1 += '<option class="option1" value="' + areaData[i].provinceName + '">' +
                areaData[i].provinceName + '</option>';
            proHtml2 += '<option class="option2 "value="' + areaData[i].provinceName + '">' +
                areaData[i].provinceName + '</option>';
        }
    }
    if(_province != '') {
        var cities = getCityByProvince(areaData, _province);
        console.log(_city);
        loadCity(cities, _city);
    }
    $form.find('select[name=province]').append(proHtml1);
    $form.find('select[name=province2]').append(proHtml2);
    form.render();
    form.on('select(province)', function(data) {
        _province = data.value;

//         	 $(".alloptions2").attr("selected",true);
        if(_province==""){
            $form.find('select[name=province2]').find('option').each(function(i,n){
                if($(n).text()=="全部")
                {
                    $(n).attr("selected",true);

                }
            })

        }else{
            $(".option2").attr("selected",false);
            $form.find('select[name=province2]').find('option').each(function(i,n){
                if($(n).text()==_province)
                {
                    $(n).attr("selected",true);
                }
            })
        }


        var cities = getCityByProvince(areaData, _province);
        if(cities.length > 0) {
            loadCity(cities);

        } else {
            $form.find('select[name=city]').parent().hide();
        }
    });
}
function getCityByProvince(areaData, provinceName) {
    var cities = [];
    $.each(areaData, function (index, item) {
        if(item.provinceName == provinceName) {
            cities = item.mallCityList;
            return false;
        }
    });
    return cities;
}
function loadCity(citys, selCity) {
    var cityHtml = '';
    for(var i = 0; i < citys.length; i++) {
        if(selCity != '' && selCity == citys[i].cityName) {
            cityHtml += '<option value="' + citys[i].cityName + '" selected>' +
                citys[i].cityName + '</option>';
        } else {
            cityHtml += '<option value="' + citys[i].cityName + '">' +
                citys[i].cityName + '</option>';
        }
    }
    if(!selCity){
        _city=citys[0].cityName;
    }
    // _city=selCity;
    $form.find('select[name=city]').html(cityHtml).parent().show();
    form.render();
    form.on('select(city)', function(data) {
        var value = data.value;
        var d = value.split('_');
        var code = d[0];
        _city=value;

    });
}
$("input[name=chooseAll]").on("click",function(){
    if($(this).prop("checked")){
        $("input[name=single]").prop("checked",true);
    }else{
        $("input[name=single]").prop("checked", false);
    }
});

function getCityByProvince(areaData, provinceName) {
    var cities = [];
    $.each(areaData, function (index, item) {
        if(item.provinceName == provinceName) {
            cities = item.mallCityList;
            return false;
        }
    });
    return cities;
}
// 结束

//页面加载完后调用


//选择sku商品的回调方法
function chooseSkuCommodityCallback(skuDataList) {
    if(skuDataList) {
        var html = "";
        $.each(skuDataList, function (index, sku) {
            var isExist = false;
            $.each(vm.$data.malls, function (idx, item) {
                if(item.skuId == sku.skuId) {
                    isExist = true;
                    return false;
                }
            });
            if(!isExist) {
                var product = {};
                product.skuId = sku.skuId;
                product.skuModel = sku.model;
                product.skuName = sku.skuName;
                product.skuBrandId = sku.brandId;
                product.skuBrandName = sku.brandName;
                product.skuUnitId = sku.unitId;
                product.skuUnitName = sku.unitName;
                product.skuClassifyId = sku.classifyId;
                product.skuClassifyName = sku.classifyName;
                var precision = unitConfig[sku.unitName];
                product.skuQuantity = sku.minnum.toFixed(precision);
                product.orginImg = sku.orginImgPath;
                product.directoryPrice=sku.directoryPrice;
                product.skuOfferAmount=0;
                var skuPropertyList='';
                for(var i=0;i<sku.skuPropertyList.length;i++){
                    // var tt1={};
                    skuPropertyList+=(sku.skuPropertyList[i].propertyValue+':'+sku.skuPropertyList[i].propertyName);

                }
                product.skuPropertyList=skuPropertyList;
                vm.$data.malls.push(product);
            }
        });
        renderUnitDisplay();
    }
    return true;
}



function addProduct() {
    layer.open({
        title:"请选择SKU",
        type: 2,
        area: ['1000px', '550px'],
        fixed: false, //不固定
        maxmin: false,
        content: '/reusable/skuCommodity/chooseSkuCommodityForMallClassifyPage?skuType=NORMAL'
    });
}


layui.use('upload', function(){
    layui.upload({
        elem: "#buyerAttachmentListFileBtn",
        skin: 'upload',
        url: '/file_server/mall/generalFileUpload', //上传接口
        before: function (input) {
            // //返回的参数item，即为当前的input DOM对象
            // console.log('文件上传中');
        },
        success: function (result) { //上传成功后的回调
        	console.log(vm.$data.attachmentFileListStr);
        	if(vm.$data.attachmentFileListStr.length < 5) {
                if (result.STATUS == "SUCCESS") {
                    for (var i = 0; i < result.data.length; i++) {
                    	 var tempFile = {};
                         tempFile.attachmentName = result.data[i].MALL_FILE_NAME;
                         tempFile.attachmentId = result.data[i].MALL_FILE_ATTACHMENT_ID;
                         vm.$data.attachmentFileListStr.push(tempFile);
                        var attachmentFileListStr = tempFile.attachmentId + "|" + tempFile.attachmentName;
                    }
                } else {
                    alert("上传过程中出现异常，请稍后再试");
                }
            }else{
                alert("合同只能上传5份");
            }
        }
    });

});

function downLoadFile(id) {
    var param = {};
    param.fileAttachmentId = id;
    postUtil.submit("/file_server/mall/generalFileDownload",param);
}

//删除附件
function deleteAttachmentFile(attachmentId){
	console.log(attachmentId);
    layer.open({
        title: '操作提示',
        skin: 'myskin',
        area: ['450px', '280px'],
        btnAlign: 'c',
        content: '<p style="text-align: center;margin-top: 50px;" >确定删除此附件吗？</p>',
        btn: ['确认', '取消'],
        yes: function (index, layero) {
            var attachmentList = vm.$data.attachmentFileListStr;
            console.log(attachmentList);
            for (var i = 0; i < attachmentList.length; i++) {
                var tempAttachmentFile = attachmentList[i];
                if (tempAttachmentFile.attachmentId == attachmentId) {
                    vm.$data.attachmentFileListStr.splice(i, 1);
                    break;
                }
            }
            layer.close(index);
        }, btn2: function (index, layero) {
            layer.close(index);
        },
        cancel: function () {
            //右上角关闭回调
        }
    });
}

//获取已上传附件
function getAttachments(){
    var attachmentFileListStr = [];
    if(currentAttachmentList.length > 0) {
        for(var i =0;i<currentAttachmentList.length;i++) {
            var attachmentId = currentAttachmentList[i].attachmentId;
            var attachmentName = currentAttachmentList[i].attachmentName;
            var item={
                'attachmentId':attachmentId,
                'attachmentName':attachmentName
            };
            attachmentFileListStr.push(item);
        }
    }

    return attachmentFileListStr;
}


$(document).on('click','#choseBidder div',function () {
    $(this).find("span").eq(0).removeClass("layui-btn-itoc");
    $(this).siblings().find("span").eq(0).addClass("layui-btn-itoc");
    $(this).find("a").show();
    $(this).siblings().find("a").hide();
    if($(this).find("span").eq(0).text()=="平台报价"){
        vm.$data.msg3=true;
        var newDate=moment().add(15,'days').format('YYYY-MM-DD');
        $("#enquire_offerValidUntil").val(newDate);

        vm.$data.datas.buyerSellerInfo.offerAccountName="";
        vm.offerersAccountId='';
        offerType='platform'; //报价类型是平台
        
        if(vm.vendorAccountId){
        	vm.$data.selectDistributor='修改';
        }else{
        	vm.$data.selectDistributor='选择分销商';
        }      
    }
    if($(this).find("span").eq(0).text()=="分销商报价"){
        vm.$data.msg3=false;
        offerType='distributor'; //报价类型是分销商
        vm.$data.vendorAccountName="";
        vm.$data.vendorAccountId="";
        vm.$data.msg4='+分销商报价';
    }
})

//
var chooseIndex=0;
function chooseDistributor() {
    layer.open({
        title:"请选择分销商",
        type: 2,
        area: ['1000px', '500px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/systemAccount/chooseSingleDistributorPage'
    });
}
//
// //选择分销商的回调方法
function chooseDistributorCallback(distributorList) {
    if(distributorList) {
        var html = "";
        if(distributorList.length==1){
        	if(offerType=='platform'){
        		vm.$data.selectDistributor="修改";
                vm.$data.vendorAccountName=distributorList[0].accountName;
                vm.vendorAccountId=distributorList[0].accountId;
        	}else{
                $.each(distributorList, function (index, item) {
                    var isExist = false;
                    $.each($('input:checkbox[name="selectedDistributor"]'), function (idx, sellerOffer) {
                        if(item.accountId == $(sellerOffer).val()) {
                            isExist = true;
                            return true;
                        }
                    });
                    if(isExist) {
                        return true;
                    }
                    console.log(item)
                    vm.$data.msg4="修改";
                    if(offerId){
                        vm.$data.datas.buyerSellerInfo.offerAccountName=item.accountName;
                    }else {
                        $("#offerAccountName").html(item.accountName);
                    }
                    vm.offerersAccountId=item.accountId;
                });
        	}
        }else{
            layer.msg('最多选择一个分销商啦', {icon: 5});
        }
    }

    $("#selectAll").attr("checked",'checked');
    return true;
}
$(document).on("click", ".chooseSystemAccount", function () {
    layer.open({
        title: '请选择工程商',
        skin: 'msgskin',
        area: ['900px', '496px'],
        type: 2,
        content: ['/systemAccount/preSystemAccountlist','no'],
    })

})
function backChooseSystemAccountRecordCallback(data){
    bindAccountInfo(data);
}
function isExitsVariable(variableName) {
    try {
        if (typeof (variableName) == "undefined") {
            return "";
        } else {
            return variableName;
        }
    } catch (e) {
    }
    return "";
}

function bindAccountInfo(data) {
    if(data){
        vm.$data.msg1=true;
    }
    console.log(data)
     _accountId=data.accountId;
    buyerAccountId = data.accountId;
     _userId=data.userId;
     _entrustOrderContact=data.userRealName;
     _entrustOrderContactMobile=data.mobile;
    vm.$data.chooseSystemAccount={
        mobile:isExitsVariable(data.mobile),
        accountManagerName:isExitsVariable(data.accountManagerName),
        linkman:isExitsVariable(data.linkman),
        email:isExitsVariable(data.email),
        accountName:isExitsVariable(data.accountName),
        accountResourceCname:isExitsVariable(data.accountResourceCname),
        createDate:isExitsVariable(data.createDate)
    };
}

function returnBackToList(offerId){
	cardUtil.closeCard("复制询价单-"+offerId);
    cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
    cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
}

//日期加上天数得到新的日期
//dateTemp 需要参加计算的日期，days要添加的天数，返回新的日期，日期格式：YYYY-MM-DD
// function getNewDay(dateTemp, days) {
//     var dateTemp = dateTemp.split("-");
//     var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式
//     var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
//     var rDate = new Date(millSeconds);
//     var year = rDate.getFullYear();
//     var month = rDate.getMonth() + 1;
//     if (month < 10) month = "0" + month;
//     var date = rDate.getDate();
//     if (date < 10) date = "0" + date;
//     return (year + "-" + month + "-" + date);
// }

$(function(){
    //需求描述字数统计
    var textArea = $('.demandDescribe');
    var word = $('#demandDescribeWord');
    //调用
    statInputNum(textArea,word);

});

function statInputNum(textArea,numItem) {
    var max = numItem.text(), curLength;
    textArea[0].setAttribute("maxlength", max);
    curLength = textArea.val().length;
    numItem.text(max - curLength);
    textArea.on('input propertychange', function () {
        var _value = $(this).val().replace(/\n/gi,"  ");
        numItem.text(max - _value.length);
    });
}