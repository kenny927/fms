layui.use(['form','laydate'], function() {
    var form = layui.form();
    laydate = layui.laydate;


    form.on('radio(inquiry)', function(data){
        if(data.value="是"){
            vm.$data.msg5=false;
        }
    });
    form.on('radio(inquiry2)', function(data){
        if(data.value="否"){
            vm.$data.msg5=true;
        }
    });
    form.on('radio(isNeedInvoiceY)', function(data){
        vm.datas.isNeedInvoice=data.value;
    });
    form.on('radio(isNeedInvoiceN)', function(data){
        vm.datas.isNeedInvoice=data.value;
    });
    form.on('submit(demo2)', function(data){
        cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
        cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
        cardUtil.closeCard("修改询价单-"+vm.datas.offerId);
    })
    form.on('submit(demo3)', function(data){
        cardUtil.openCard("复制询价单-" + offerId,"/mallOrder/api/mallInquiry/preCopy", {offerId:offerId});
        cardUtil.changeCard("复制询价单-" + offerId);
    })
    //点击生成询单
    form.on('submit(demo1)', function(data){
    	var result = validate();
        if(!result.isPass) {
            layer.open({
                title: '数据填写有误',
                icon: 5,
                skin: 'youskin',
                area: ['550px', '300px'],
                btnAlign: 'c',
                content: result.msg,
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

            param.purchasingRequisitionDesc = vm.datas.purchasingRequisitionDesc;
            var expectDeliveryTime = $('#enquire_expectDeliveryTime').val();
            var offerValidUntil = $('#enquire_offerValidUntil').val();
            param.offerValidUntil=offerValidUntil;
            param.deliverDays = $('#deliverDays').val();
            if(vm.$data.msg3){
                if(vm.datas.offerType=="DISTRIBUTOR_OFFER"&&vm.datas.inquiryOrderStatusPercent=="80%"){
                    param.offerType="DISTRIBUTOR_OFFER";
                    param.offerersAccountId=vm.offerersAccountId
                    param.offerAccountName=vm.datas.buyerSellerInfo.offerAccountName;
                }else{
                    param.offerType="PLATFORM_OFFER";
                    param.offerersAccountId="11";
                }
                param.offerFreight=vm.datas.offerFreight;
                param.offerSkuTotalPrice=vm.offerSkuTotalPrice;
                param.offerTotalPrice=vm.offerTotalPrice;
            }else{
                if($("#offerAccountName").html()==""){
                    param.offerType="";
                }else {
                    param.offerType="DISTRIBUTOR_OFFER";
                }
                param.offerAccountName=vm.datas.buyerSellerInfo.offerAccountName;
                param.offerersAccountId=vm.offerersAccountId;
            }
            param.entrustOrderContactMobile=vm.datas.buyerSellerInfo.entrustOrderContactMobile;
            param.entrustOrderContact=vm.datas.buyerSellerInfo.entrustOrderContact;
            param.buyerUserId=vm.datas.buyerSellerInfo.buyerUserId;
            param.buyerAccountId=vm.datas.buyerSellerInfo.buyerAccountId;
            param.buyerAccountName=vm.$data.buyerAccountName;
            param.offerVersionNumber=vm.datas.offerVersionNumber;
            param.offerId=vm.datas.offerId;
            param.purchasingRequisitionDesc=$("#remark").val();;//备注
            param.inquiryOrderProvince = projectProvince;
    	    param.inquiryOrderCity = projectCity;
            param.expectDeliveryDate=$('#enquire_expectDeliveryTime').val();//期望交期
            param.offerOtherFeesDesc = vm.datas.offerOtherFeesDesc;//qit描
            param.offerOtherFees=vm.datas.offerOtherFees;
            param.attachmentFileListStr=vm.attachmentFileListStr;//附件
            param.customSkuDataList=vm.diys;//自定义商品
            param.skuDataList = vm.malls;//商城商品
            
            if(offerType=='platform'){
            	param.vendorAccountId=vm.$data.vendorAccountId;
            }else{
            	param.vendorAccountId=""
            }
            param.dealSign="ForOther";
      	    //收货地址
            var hasAddress = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').length;
            if(hasAddress){
            	var selected = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').parent().parent();
     	    	 var consigneeAddressId=selected.attr('id');
          	    param.consigneeAddressId =consigneeAddressId.substring(consigneeAddressId.indexOf("_")+1);
          	    param.consignee = selected.attr('consignee');
          	    param.consigneeAddress =  selected.attr('inquiryorderaddress');
          	    param.consigneeMobile = selected.attr('consigneemobile');
               param.inquiryOrderAddress=selected.attr('inquiryOrderAddress');
      	    }
      	    //是否开票
      	    var isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val();
      	    param.isNeedInvoice = isNeedInvoice;
      	    if($.trim(isNeedInvoice) == "Y"){
      	    	 var isInvoiceINfo = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').length;
    		     if(isInvoiceINfo){
    		    	 var selInvoice = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').parent().parent();
       	    		param.invoiceCorporationName = selInvoice.attr('invoicecorporationname');
           	    	param.invoiceEaxpayerIdentificationNumber = selInvoice.attr('invoiceeaxpayeridentificationnumber');
           	    	param.invoiceCorporationAddress = selInvoice.attr('invoicecorporationaddress');
           	    	param.invoiceCorporationPhoneNumber = selInvoice.attr('invoicecorporationphonenumber');
           	    	param.invoiceCorporationBankAccount = selInvoice.attr('invoicecorporationbankaccount');
           	    	param.invoiceCorporationBankDesc = selInvoice.attr('invoicecorporationbankdesc');
           	    	var invoiceId=selInvoice.attr('id');
              	    param.invoiceId =invoiceId.substring(invoiceId.indexOf("_")+1);
    		     }
    		     var isInvoiceAddress = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').length;
    		     if(isInvoiceAddress){
    		    	var selInvoiceAddress = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').parent().parent();
       	    		param.invoiceConsignee =  selInvoiceAddress.attr('invoiceconsignee');
           	    	param.invoiceConsigneeAddress = selInvoiceAddress.attr('invoiceconsigneeaddress');
           	    	param.invoiceConsigneeMobile = selInvoiceAddress.attr('invoiceConsigneeMobile');
              	    var invoiceAddressId=selInvoiceAddress.attr('id');
            	    param.invoiceAddressId =invoiceAddressId.substring(invoiceAddressId.indexOf("_")+1);
    		     }
      	    }else{
          	    param.invoiceId = "";
          	    param.invoiceAddressId = "";
          	    param.invoiceCorporationName = "";
    	    	param.invoiceEaxpayerIdentificationNumber ="";
    	    	param.invoiceCorporationAddress ="";
    	    	param.invoiceCorporationPhoneNumber ="";
    	    	param.invoiceCorporationBankAccount = "";
    	    	param.invoiceCorporationBankDesc ="";
    	    	param.invoiceConsignee = "";
    	    	param.invoiceConsigneeAddress ="";
    	    	param.invoiceConsigneeMobile ="";
      	    }
            //param.isForReplace="true"; //报价的时候，不校验付款后多少天发货
            postUtil.call("/mallOrder/api/mallInquiry/updateMallInquiry", {"jsonData" : JSON.stringify(param)}, function (result) {
                if (result.STATUS == "SUCCESS") {
                    layer.msg("修改成功,询单ID:"+vm.datas.offerId);
                    setTimeout(function () {
                        cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
                        cardUtil.changeCard("询价单");
                        cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
                        cardUtil.changeCard("我的询价单");
                        cardUtil.closeCard("修改询价单-"+vm.datas.offerId);
                    },1500);
                }else {
                    layer.msg(result.MSG + "");
                }
            });

            console.log(param);
        }
    });
    form.on('submit(transferToOrder)', function(data){
        vm.isOrderTransfer = true;
    	var result = validate('ORDER');
        if(!result.isPass) {
            layer.open({
                title: '数据填写有误',
                icon: 5,
                skin: 'youskin',
                area: ['550px', '300px'],
                btnAlign: 'c',
                content: result.msg,
                btn: ['我知道了'],
                yes: function(index1, layero){
                    layer.close(index1);
                },
                cancel: function(){
                    //右上角关闭回调
                }
            });
        }else{
        	if(!vm.$data.vendorAccountId){
        		layer.msg('请选择发货的分销商',{icon:5});
    			return false;
        	}
            /*if(!consigneeAddressId){
                layer.msg('请增加收货地址',{icon:5});
                return false;
            }
            if(!invoiceId && vm.datas.isNeedInvoice=='Y'){
                layer.msg('请增加开票信息',{icon:5});
                return false;
            }
            if(!invoiceAddressId && vm.datas.isNeedInvoice=='Y'){
                layer.msg('请增加收票地址',{icon:5});
                return false;
            }*/
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
            param.offerValidUntil=offerValidUntil;
            param.deliverDays = $('#deliverDays').val();
            if(vm.$data.msg3){
                if(vm.datas.offerType=="DISTRIBUTOR_OFFER"&&vm.datas.inquiryOrderStatusPercent=="80%"){
                    param.offerType="DISTRIBUTOR_OFFER";
                    param.offerersAccountId=vm.offerersAccountId
                    param.offerAccountName=vm.datas.buyerSellerInfo.offerAccountName;
                }else{
                    param.offerType="PLATFORM_OFFER";
                    param.offerersAccountId="11";
                }
                // param.offerersAccountId="11";
                param.offerFreight=vm.datas.offerFreight;
                param.offerSkuTotalPrice=vm.offerSkuTotalPrice;
                param.offerTotalPrice=vm.offerTotalPrice;
            }else{
                if($("#offerAccountName").html()==""){
                    param.offerType="";
                }else {
                    param.offerType="DISTRIBUTOR_OFFER";
                }

                param.offerAccountName=vm.datas.buyerSellerInfo.offerAccountName;
                param.offerersAccountId=vm.offerersAccountId;

            }
            param.entrustOrderContactMobile=vm.datas.buyerSellerInfo.entrustOrderContactMobile;
            param.entrustOrderContact=vm.datas.buyerSellerInfo.entrustOrderContact;
            param.buyerUserId=vm.datas.buyerSellerInfo.buyerUserId;
            param.buyerAccountId=vm.datas.buyerSellerInfo.buyerAccountId;
            param.buyerAccountName=vm.$data.buyerAccountName;
            param.offerVersionNumber=vm.datas.offerVersionNumber;
            param.offerId=vm.datas.offerId;
            param.purchasingRequisitionDesc= $("#remark").val();;//备注
            param.inquiryOrderProvince = projectProvince;
    	    param.inquiryOrderCity = projectCity;
            param.expectDeliveryDate=$('#enquire_expectDeliveryTime').val();//期望交期
            param.offerOtherFeesDesc = vm.datas.offerOtherFeesDesc;//qit描
            param.offerOtherFees=vm.datas.offerOtherFees;
            param.attachmentFileListStr=vm.attachmentFileListStr;//附件
            param.customSkuDataList=vm.diys;//自定义商品
            param.skuDataList = vm.malls;//商城商品
            
            if(offerType=='platform'){
            	param.vendorAccountId=vm.$data.vendorAccountId;
            }else{
            	param.vendorAccountId=""
            }
            param.dealSign="ForOther";
            //收货地址
      	    var selected = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').parent().parent();
      	    var consigneeAddressId=selected.attr('id');
      	    param.consigneeAddressId =consigneeAddressId.substring(consigneeAddressId.indexOf("_")+1);
      	    param.consignee = selected.attr('consignee');
     	    param.consigneeAddress =  selected.attr('inquiryorderaddress');
      	    param.consigneeMobile = selected.attr('consigneemobile');
              param.inquiryOrderAddress=selected.attr('inquiryOrderAddress');
      	    //是否开票
      	    var isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val();
      	    param.isNeedInvoice = isNeedInvoice;
      	    if($.trim(isNeedInvoice) == "Y"){
      	    	var selInvoice = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').parent().parent();
      	    	param.invoiceCorporationName = selInvoice.attr('invoicecorporationname');
      	    	param.invoiceEaxpayerIdentificationNumber = selInvoice.attr('invoiceeaxpayeridentificationnumber');
      	    	param.invoiceCorporationAddress = selInvoice.attr('invoicecorporationaddress');
      	    	param.invoiceCorporationPhoneNumber = selInvoice.attr('invoicecorporationphonenumber');
      	    	param.invoiceCorporationBankAccount = selInvoice.attr('invoicecorporationbankaccount');
      	    	param.invoiceCorporationBankDesc = selInvoice.attr('invoicecorporationbankdesc');
      	    	var selInvoiceAddress = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').parent().parent();
      	    	param.invoiceConsignee =  selInvoiceAddress.attr('invoiceconsignee');
      	    	param.invoiceConsigneeAddress = selInvoiceAddress.attr('invoiceconsigneeaddress');
      	    	param.invoiceConsigneeMobile = selInvoiceAddress.attr('invoiceConsigneeMobile');
      	    	var invoiceId=selInvoice.attr('id');
             	param.invoiceId =invoiceId.substring(invoiceId.indexOf("_")+1);
             	var invoiceAddressId=selInvoiceAddress.attr('id');
           	    param.invoiceAddressId =invoiceAddressId.substring(invoiceAddressId.indexOf("_")+1);
      	    }else{
          	    param.invoiceId = "";
          	    param.invoiceAddressId = "";
          	    param.invoiceCorporationName = "";
        	    	param.invoiceEaxpayerIdentificationNumber ="";
        	    	param.invoiceCorporationAddress ="";
        	    	param.invoiceCorporationPhoneNumber ="";
        	    	param.invoiceCorporationBankAccount = "";
        	    	param.invoiceCorporationBankDesc ="";
        	    	param.invoiceConsignee = "";
        	    	param.invoiceConsigneeAddress ="";
        	    	param.invoiceConsigneeMobile ="";
      	    }
            layer.open({
                title: '核对信息',
                skin: 'msgskin',
                area: ['480px', '300px'],
                btnAlign: 'c',
                content: '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin:30px;font-size:16px;color:#222222">请认真核对<span class="c-f">详细地址、结算信息、开票信息、公司名称</span>以及<span class="c-f ">所选分销商</span>，准确无误后再继续提交！</p>',
                btn: ['提交', '取消'],
                yes:function(index1, layero){
                    layer.load();
                    postUtil.call("/mallOrder/api/mallInquiry/updateMallInquiry", {"jsonData" : JSON.stringify(param)}, function (result) {
                        if (result.STATUS == "SUCCESS") {
                            postUtil.call('/mallOrder/api/inquiryTransferToOrder',{offerId:offerId,offerType:param.offerType,offerersAccountId:param.offerersAccountId,buyerAccountId:param.buyerAccountId},function(result){
                            	layer.closeAll('loading');
                            	if (result.STATUS == "SUCCESS") {
                                    layer.msg("转订单成功,询单ID:"+vm.datas.offerId,{icon:6},function(){
                                        cardUtil.refreshCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList");
                                        cardUtil.changeCard("询价单");
                                        cardUtil.refreshCard("我的询价单","/mallOrder/api/mallInquiry/preMyMallInquiryOrderList");
                                        cardUtil.changeCard("我的询价单");
                                        cardUtil.closeCard("修改询价单-"+vm.datas.offerId);                             
                                    });
                            	}else{
                            		layer.msg("转订单失败，原因："+result.MSG ,{icon:5});
                            	}
                            });
                        }else {
                        	layer.closeAll('loading');
                            layer.msg(result.MSG + "");
                        }
                    });
                    console.log(param);
                },
                cancel:function(index1, layero){
                    layer.close(index1);
                 }
            });
        }
    });
})

function validate(operationType){
	var isPass = true;
    var msg = "";
    var errorCount=0;
    if(!offerType){
    	errorCount++;
        msg += "<"+errorCount+">请选择报价人";
        if(errorCount%3==0){
            msg+="</br>";
        }
        isPass = false;
    }else{
    	if(offerType=='platform'){
            //平台商品和自定义商品不能都为空
            if(vm.$data.malls.length == 0 && vm.$data.diys.length == 0) {
                errorCount++;
                msg += "<"+errorCount+">商城商品和自定义商品不能都为空";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            //商城商品
            $.each(vm.malls, function(index,item) {
                //描述长度不能超过100
                // if (item.skuremark.length>100) {
                //     layer.msg('描述长度不能为超过100', {icon: 5});
                //     isPass=false;
                // }
                //数量为数字
                if (item.skuOfferPrice=="") {
                    errorCount++;
                    msg += "<"+errorCount+">商城商品报价不能为空";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
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
                //     msg += "<"+errorCount+">自定义商品名称型号不能为空";
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
            });
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
            
            //选择有效期
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
          /*  var replyDeliveryDate = $('#enquire_replyDeliveryDate').val();
	            if ($.trim(replyDeliveryDate) == "") {
	                errorCount++;
	                msg += "<" + errorCount + ">请选择回复交期";
	                if (errorCount % 3 == 0) {
	                    msg += "</br>";
	                }
	                isPass = false;
	            }*/
//    	  if(operationType=='ORDER'){
	   /*         var deliverDays = $('#deliverDays').val();
	            if ($.trim(deliverDays) == "") {
	                errorCount++;
	                msg += "<" + errorCount + ">请输入付款后多少天发货";
	                if (errorCount % 3 == 0) {
	                    msg += "</br>";
	                }
	                isPass = false;
	            }*/
//    	  }
            //收货地址
           if(operationType=='ORDER'){
                var hasAddress = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').length;
                if(!hasAddress){
                	 errorCount++;
                     msg += "<"+errorCount+">请选择详细地址";
                     if(errorCount%3==0){
                         msg+="</br>";
                     }
                     isPass = false;
                }	
            }
            //公司名称
            var buyerAccountName=vm.$data.buyerAccountName;
            if(operationType=='ORDER'){
                if ($.trim(buyerAccountName) == "") {
                    errorCount++;
                    msg += "<" + errorCount + ">请输入公司名称";
                    if (errorCount % 3 == 0) {
                        msg += "</br>";
                    }
                    isPass = false;
                }
            }
            //运费,商品总价,报价总价金额
            if(vm.datas.offerFreight==undefined||vm.datas.offerFreight.length==0){
                errorCount++;
                msg += "<" + errorCount + ">请填写运费";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
            if(isNaN(vm.offerSkuTotalPrice)){
                errorCount++;
                msg += "<" + errorCount + ">请填写商品报价";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
            }
            //省份
            if($.trim(projectProvince) == "") {
                errorCount++;
                msg += "<"+errorCount+">选择项目地省份";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }
            if($.trim(projectCity) == "") {
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
            if(operationType=='ORDER'){
            	if($.trim(isNeedInvoice) == "Y"){
                	var hasInvoice = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').length;
                    if(!hasInvoice){
                    	errorCount++;
                        msg += "<"+errorCount+">请选择发票信息";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    var hasOn = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').length;
                    if(!hasOn){
                    	errorCount++;
                        msg += "<"+errorCount+">请选择收票地址";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                }	
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
    	}
    	if(offerType=='distributor'){
    		if(!vm.offerersAccountId){
                errorCount++;
                msg += "<" + errorCount + ">请选择分销商";
                if (errorCount % 3 == 0) {
                    msg += "</br>";
                }
                isPass = false;
    		}
    	}
    }
    return {isPass:isPass,msg:msg};
}


var areaData = Area;
var $form;
var form;
var $;

function loadProvince() {
    var proHtml = '';
    for(var i = 0; i < areaData.length; i++) {
        if(projectProvince != '' && projectProvince == areaData[i].provinceName) {
            proHtml += '<option value="' + areaData[i].provinceName + '" selected='+'"selected">' +
                areaData[i].provinceName + '</option>';
        } else {
            proHtml += '<option value="' + areaData[i].provinceName + '">' +
                areaData[i].provinceName + '</option>';
        }
    }
    if(projectProvince != '') {
        var cities = getCityByProvince(areaData, projectProvince);
        loadCity(cities);
    }
    //初始化省数据
    $form.find('select[name=province]').append(proHtml);
    form.render();
    form.on('select(province)', function(data) {
    	projectProvince = data.value;
        $form.find('select[name=area]').html('<option value="">请选择县/区</option>').parent().hide();
        var value = data.value;
		if(value && value.length>0){
	        var cities = getCityByProvince(areaData, value);
	        if(cities.length > 0) {
	        	projectCity=cities[0].cityName;
	            loadCity(cities);
	        } else {
	            $form.find('select[name=city]').parent().hide();
	            projectCity='';
	        }
	        $("#province").html(projectProvince);
	        $("#city").html(projectCity);
	        getAddress(consigneeAddressId,buyerAccountId,projectProvince,projectCity);
		}
    });
}

function loadCity(citys) {
    var cityHtml = '';
    for(var i = 0; i < citys.length; i++) {
        if(projectCity != '' && projectCity == citys[i].cityName) {
            cityHtml += '<option value="' + citys[i].cityName + '" selected>' +
                citys[i].cityName + '</option>';
        } else {
            cityHtml += '<option value="' + citys[i].cityName + '">' +
                citys[i].cityName + '</option>';
        }
    }
    $form.find('select[name=city]').html(cityHtml).parent().show();
    form.render();
    form.on('select(city)', function(data) {
    	projectCity= data.value;
        var value = data.value;
		if(value && value.length>0){
			$form.find('select[name=city]').attr("validate","true");
			getAddress(consigneeAddressId,buyerAccountId,projectProvince,projectCity);
		}
		 $("#city").html(projectCity);
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
        maxmin: true,
        content: '/reusable/skuCommodity/chooseSkuCommodityForMallClassifyPage'
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
                // vm.$data.attachment=false;
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
    if(vm.$data.datas.offerType!='DISTRIBUTOR_OFFER'){
    	$(this).find("a").show();
    }
    
    $(this).siblings().find("a").hide();
    if($(this).find("span").eq(0).text()=="平台报价"){
        vm.$data.msg3=true;
        var newDate=moment().add(15,'days').format('YYYY-MM-DD');
        $("#enquire_offerValidUntil").val(newDate);

        //$("#enquire_replyDeliveryDate").val("");
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
    return false;
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
                    vm.$data.msg4="修改";
                    vm.$data.datas.buyerSellerInfo.offerAccountName=item.accountName;
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
    _userId=data.userId;
    // _accountInfo=data;
    if(data!=""){
        vm.$data.msg1=true;
    }
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

$(function(){
    //需求描述字数统计
    var textArea = $('.demandDescribe');
    var word = $('#demandDescribeWord');
    //调用
    statInputNum(textArea,word);

});

function statInputNum(textArea,numItem) {
	if(textArea!=''){
		 var max = numItem.text(), curLength;
		  //  textArea.setAttribute("maxlength", max);
		    curLength = textArea.val().length;
		    numItem.text(max - curLength);
		    textArea.on('input propertychange', function () {
		        var _value = $(this).val().replace(/\n/gi,"  ");
		        numItem.text(max - _value.length);
		    });
	}
}

function openHistoryDetail(offerHistoryId) {
    cardUtil.openCard("原始单据-" + offerHistoryId,"/mallOrder/api/inquiryOrderHistory/enterHistory", {offerHistoryId:offerHistoryId});
    cardUtil.changeCard("原始单据-" + offerHistoryId);
}