/**
 * 增加收货地址
 */
function addDeliveryAddress(){
	if(!buyerAccountId){
		layer.msg('请先选择工程商',{icon:5});
		return;
	}
    var choosedProvince = $form.find('select[name=province]').val()
    var choosedCity = $form.find('select[name=city]').val()
    var consigneeAddressPageUrl = "/mallOrder/api/mallConsigneeAddress/consigneeAddressPage?choosedProvince="+choosedProvince+"&choosedCity="+choosedCity;
    layer.open({
        title:"新增收货地址",
        type: 2,
        skin:'msgskin',
        area: ['600px', '480px'],
        fixed: true, //不固定
        maxmin: false,
        content: encodeURI(encodeURI(consigneeAddressPageUrl)),
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateForm(body)){
                return;
            }
            body.find('#s_province').removeAttr("disabled");
            body.find('#s_city').removeAttr("disabled");
            var data = body.find("#addressForm").serialize();
            body.find('#s_city').attr("disabled","disabled");
            body.find('#s_province').attr("disabled","disabled");

            layer.load();
            postUtil.call('/mallOrder/api/mallConsigneeAddress/addConsigneeAddressForCopy?buyerAccountId='+buyerAccountId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var address = data.data;
                    vm.datas.consigneeAddressId = address.consigneeAddressId
                    vm.datas.consignee = address.consignee;
                    vm.datas.consigneeAddress =address.consigneeAddress;
                    vm.datas.consigneeMobile = address.consigneeMobile;
                    $("#deliveryAddress").html("<span>"+address.consignee+"</span>"+"<span class='ml10'>"+address.consigneeMobile+"</span>"+"<span class='ml10'>"+address.consigneeAddress+"</span>"+
                        "<span class='ml10'><a href='javascript:updateBuyerConsigneeAddress(\""+address.consigneeAddressId+"\")'>修改</a><span class='ml10'><a href='javascript:deleteBuyerConsigneeAddress(\""+address.consigneeAddressId+"\")'>删除</a>")

                    layer.close(index);

                }else{
                    layer.msg('新增收货地址失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

//修改收货地址
function updateBuyerConsigneeAddress(consigneeAddressId){
    var consigneeAddressPageUrl = "/mallOrder/api/mallConsigneeAddress/consigneeAddressPage?consigneeAddressId="+consigneeAddressId+"&fixed=Y";
    layer.open({
        title:"修改收货地址信息",
        type: 2,
        skin:'msgskin',
        area: ['600px', '480px'],
        fixed: false, //不固定
        maxmin: false,
        content: consigneeAddressPageUrl,
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateForm(body)){
                return;
            }
            body.find('#s_province').removeAttr("disabled");
            body.find('#s_city').removeAttr("disabled");
            var data = body.find("#addressForm").serialize();
            body.find('#s_city').attr("disabled","disabled");
            body.find('#s_province').attr("disabled","disabled");
            layer.load();
            postUtil.call('/mallOrder/api/mallConsigneeAddress/updateConsigneeAddressForCopy?consigneeAddressId='+consigneeAddressId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var address = data.data;
                    vm.datas.consigneeAddressId = address.consigneeAddressId;
                    vm.datas.consignee = address.consignee;
                    vm.datas.consigneeAddress =address.consigneeAddress;
                    vm.datas.consigneeMobile = address.consigneeMobile;
                    $("#deliveryAddress").html("<span>"+address.consignee+"</span>"+"<span class='ml10'>"+address.consigneeMobile+"</span>"+"<span class='ml10'>"+address.consigneeAddress+"</span>"+
                        "<span class='ml10'><a href='javascript:updateBuyerConsigneeAddress(\""+address.consigneeAddressId+"\")'>修改</a></span><span class='ml10'><a href='javascript:deleteBuyerConsigneeAddress(\""+address.consigneeAddressId+"\")'>删除</a></span>")
                    layer.close(index);
                }else{
                    layer.msg('修改收货地址失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

//删除收货地址
function deleteBuyerConsigneeAddress(id){
    layer.open({
        title: '操作提示',
        skin: 'msgskin',
        area: ['430px', '260px'],
        btnAlign: 'c',
        content: '<p style="text-align: center;margin-top: 50px;font-size:16px;color:#222222">是否确认删除该收货地址？</p>',
        btn: ['确定','取消'],
        yes: function(index, layero){
            layer.close(index);
            postUtil.call('/mallOrder/api/mallConsigneeAddress/deleteConsigneeAddressForCopy',{consigneeAddressId:id},function(data){
                if(data.success){                    
                    vm.datas.consigneeAddressId ='';
                    vm.datas.consignee = '';
                    vm.datas.consigneeAddress ='';
                    vm.datas.consigneeMobile = '';
                    $("#deliveryAddress").html('<span onclick="javascript:addDeliveryAddress()" class="form-btn  layui-btn-primary layui-btn-small2 ml5">新增收货地址</span>');
                }else{
                    layer.msg("删除收货地址失败",{icon:5});
                }
            });
        }
    });
}

function validateForm(form){
    var input = form.find(".inputxt");
    var flag = true;
    $.each(input,function(index,element){
        var v = $(element).val();
        if(index==6){ //邮编不校验
            return;
        }
        if(!v){
            if(index!=6){
                $(element).css("border","1px solid #ff4800");
                $(element).next().hide();
                $(element).next().next().show();
                $(element).attr("validate","false");
            }
        }else{
            if(index==1){
                var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
                if(!reg1.test(v)&&!reg2.test(v)){
                    $(element).css("border","1px solid #ff4800");
                    $(element).next().hide();
                    $(element).next().next().show();
                    $(element).attr("validate","false");
                }else{
                    $(element).next().show();
                    $(element).next().next().hide();
                    $(element).css("border","1px solid #e6e6e6");
                    $(element).attr("validate","true");
                }
            }
            else if(index==2){
                if(v=="省份"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }
            else if(index==3){
                if(v=="地级市"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }
            else if(index==4){
                if(v=="请选择"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }else{
                $(element).next().show();
                $(element).next().next().hide();
                $(element).css("border","1px solid #e6e6e6");
                $(element).attr("validate","true");
            }
        }
    });
    $.each(input,function(index,element){
        var validate = $(element).attr("validate");
        if(validate=="false"){
            flag =false;
            return;
        }
    });
    return flag;
}
/**
 * 新增增票信息
 */
function addBuyerInvoice(){
	if(!buyerAccountId){
		layer.msg('请先选择工程商',{icon:5});
		return;
	}
    layer.open({
        title:"新增增票信息",
        type: 2,
        skin:'msgskin',
        area: ['600px', '525px'],
        fixed: false, //不固定
        maxmin: false,
        content: '/mallOrder/api/mallInvoice/buyerInvoicePage',
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateInvoiceInfoForm(body)){
                return;
            }
            var data = body.find("#invoiceForm").serialize();
            layer.load();
            postUtil.call('/mallOrder/api/mallInvoice/addInvoiceForCopy?buyerAccountId='+buyerAccountId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var invoice = data.data;
                    vm.datas.invoiceId = invoice.invoiceId;
                    vm.datas.invoiceCorporationAddress = invoice.corporationAddress;
                    vm.datas.invoiceCorporationBankAccount = invoice.corporationBankAccount;
                    vm.datas.invoiceCorporationBankDesc = invoice.corporationBankDesc;
                    vm.datas.invoiceCorporationName = invoice.corporationName;
                    vm.datas.invoiceCorporationPhoneNumber = invoice.corporationPhoneNumber;
                    vm.datas.invoiceEaxpayerIdentificationNumber = invoice.taxpayerIdentificationNumber;
                    $("#buyerInvoice").html("<span>"+invoice.corporationName+"</span>"+"<span class='ml10'>"+invoice.taxpayerIdentificationNumber+"</span>"+"<span class='ml10'>"+invoice.corporationBankDesc+"</span>"+
                        "<span class='ml10'>"+invoice.corporationBankAccount+"</span>"+"<span class='ml10'><a href='javascript:updateBuyerInvoice(\""+invoice.invoiceId+"\")'>修改</a></span><span class='ml10'><a href='javascript:deleteBuyerInvoice(\""+invoice.invoiceId+"\")'>删除</a></span>")
                    layer.close(index);
                }else{
                    layer.msg('新增增票信息失败',{icon:5});
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

function updateBuyerInvoice(invoiceId){
    layer.open({
        title:"修改增票信息",
        type: 2,
        skin:'msgskin',
        area: ['600px', '525px'],
        fixed: false, //不固定
        maxmin: false,
        content: '/mallOrder/api/mallInvoice/buyerInvoicePage?invoiceId='+invoiceId,
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateInvoiceInfoForm(body)){
                return;
            }
            var data = body.find("#invoiceForm").serialize();
            layer.load();
            postUtil.call('/mallOrder/api/mallInvoice/updateInvoiceForCopy?invoiceId='+invoiceId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var invoice = data.data;
                    vm.datas.invoiceId = invoice.invoiceId;
                    vm.datas.invoiceCorporationAddress = invoice.corporationAddress;
                    vm.datas.invoiceCorporationBankAccount = invoice.corporationBankAccount;
                    vm.datas.invoiceCorporationBankDesc = invoice.corporationBankDesc;
                    vm.datas.invoiceCorporationName = invoice.corporationName;
                    vm.datas.invoiceCorporationPhoneNumber = invoice.corporationPhoneNumber;
                    vm.datas.invoiceEaxpayerIdentificationNumber = invoice.taxpayerIdentificationNumber;
                    $("#buyerInvoice").html("<span>"+invoice.corporationName+"</span>"+"<span class='ml10'>"+invoice.taxpayerIdentificationNumber+"</span>"+"<span class='ml10'>"+invoice.corporationBankDesc+"</span>"+
                        "<span class='ml10'>"+invoice.corporationBankAccount+"</span>"+"<span class='ml10'><a href='javascript:updateBuyerInvoice(\""+invoice.invoiceId+"\")'>修改</a></span><span class='ml10'><a href='javascript:deleteBuyerInvoice(\""+invoice.invoiceId+"\")'>删除</a></span>");
                    layer.close(index);
                }else{
                    layer.msg('修改增票信息失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

function deleteBuyerInvoice(id){
    layer.open({
        title: '操作提示',
        skin: 'msgskin',
        area: ['430px', '260px'],
        btnAlign: 'c',
        content: '<p style="text-align: center;margin-top: 50px;font-size:16px;color:#222222">是否确定删除此增票信息？</p>',
        btn: ['确定','取消'],
        yes: function(index, layero){
            layer.close(index);
            postUtil.call('/mallOrder/api/mallInvoice/deleteInvoiceForCopy',{invoiceId:id},function(data){
                if(data.success){
                	 vm.datas.invoiceId = '';
                     vm.datas.invoiceCorporationAddress = '';
                     vm.datas.invoiceCorporationBankAccount = '';
                     vm.datas.invoiceCorporationBankDesc = '';
                     vm.datas.invoiceCorporationName = '';
                     vm.datas.invoiceCorporationPhoneNumber = '';
                     vm.datas.invoiceEaxpayerIdentificationNumber = '';
                    $("#buyerInvoice").html('<span onclick="javascript:addBuyerInvoice()" class="form-btn  layui-btn-primary layui-btn-small2 ml5">新增增票信息</span>');
                }
            });
        }
    });
}
/*
 *新增收票地址
 */
function addBuyerInvoiceAddress(){
	if(!buyerAccountId){
		layer.msg('请先选择工程商',{icon:5});
		return;
	}
    layer.open({
        title:"新增收票地址",
        type: 2,
        skin:'msgskin',
        area: ['600px', '498px'],
        fixed: false, //不固定
        maxmin: false,
        scrolling:'no',
        content: '/mallOrder/api/mallInvoice/buyerInvoiceAddressPage',
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateInvoiceAddressForm(body)){
                return;
            }
            var data = body.find("#addressForm").serialize();
            layer.load();
            postUtil.call('/mallOrder/api/mallInvoice/address/addInvoiceAddressForCopy?buyerAccountId='+buyerAccountId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var address = data.data;
                    vm.datas.invoiceAddressId = address.invoiceAddressId;
                    vm.datas.invoiceConsignee = address.consignee;
                    vm.datas.invoiceConsigneeAddress = address.consigneeAddress;
                    vm.datas.invoiceConsigneeMobile = address.consigneeMobile;
                    $('#buyerInvoiceAddress').html("<span>"+address.consignee+"</span>"+"<span class='ml10'>"+address.consigneeMobile+"</span>"+"<span class='ml10'>"+address.consigneeAddress+"</span>"+
                        "<span class='ml10'><a href='javascript:updateBuyerInvoiceAddress(\""+address.invoiceAddressId+"\")'>修改</a></span><span class='ml10'><a href='javascript:deleteBuyerInvoiceAddress(\""+address.invoiceAddressId+"\")'>删除</a></span>")
                    layer.close(index);
                }else{
                    layer.msg('新增收票地址失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });

}

function updateBuyerInvoiceAddress(invoiceAddressId){
    layer.open({
        title:"修改收票信息",
        skin:'msgskin',
        type: 2,
        area: ['600px', '498px'],
        fixed: false, //不固定
        maxmin: false,
        content: '/mallOrder/api/mallInvoice/buyerInvoiceAddressPage?invoiceAddressId='+invoiceAddressId,
        btn: ['确定','取消'],
        btnAlign: 'c',
        yes: function(index, layero){
            var body = layer.getChildFrame('body', index);
            if(!validateInvoiceAddressForm(body)){
                return;
            }
            var data = body.find("#addressForm").serialize();
            layer.load();
            postUtil.call('/mallOrder/api/mallInvoice/address/updateInvoiceAddressForCopy?invoiceAddressId='+invoiceAddressId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    var address = data.data;
                    vm.datas.invoiceAddressId = address.invoiceAddressId;
                    vm.datas.invoiceConsignee = address.consignee;
                    vm.datas.invoiceConsigneeAddress = address.consigneeAddress;
                    vm.datas.invoiceConsigneeMobile = address.consigneeMobile;
                    $('#buyerInvoiceAddress').html("<span>"+address.consignee+"</span>"+"<span class='ml10'>"+address.consigneeMobile+"</span>"+"<span class='ml10'>"+address.consigneeAddress+"</span>"+
                        "<span class='ml10'><a href='javascript:updateBuyerInvoiceAddress(\""+address.invoiceAddressId+"\")'>修改</a></span><span class='ml10'><a href='javascript:deleteBuyerInvoiceAddress(\""+address.invoiceAddressId+"\")'>删除</a></span>")

                    layer.close(index);
                }else{
                    layer.msg('新增增票地址失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

function deleteBuyerInvoiceAddress(id){
    layer.open({
        title: '操作提示',
        skin: 'msgskin',
        area: ['430px', '260px'],
        btnAlign: 'c',
        content: '<p style="text-align: center;margin-top: 50px;font-size:16px;color:#222222">是否确定删除此地址信息？</p>',
        btn: ['确定','取消'],
        yes: function(index, layero){
            layer.close(index);
            postUtil.call('/mallOrder/api/mallInvoice/address/deleteInvoiceAddressForCopy',{invoiceAddressId:id},function(data){
                if(data.success){
                	vm.datas.invoiceAddressId ='';
                    vm.datas.invoiceConsignee = '';
                    vm.datas.invoiceConsigneeAddress = '';
                    vm.datas.invoiceConsigneeMobile = '';
                    $('#buyerInvoiceAddress').html('<span onclick="javascript:addBuyerInvoiceAddress()" class="form-btn  layui-btn-primary layui-btn-small2 ml5">新增收票地址</span>');
                }
            });
        }
    });
}

function validateInvoiceInfoForm(form){
    var input = form.find(".inputxt");
    var flag = true;
    $.each(input,function(index,element){
        var v = $(element).val();
        if(!v){
            $(element).css("border","1px solid #ff4800");
            $(element).next().hide();
            $(element).next().next().show();
            $(element).attr("validate","false");
        }else{
            if(index==3){
                var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
                if(!reg1.test(v)&&!reg2.test(v)){
                    $(element).css("border","1px solid #ff4800");
                    $(element).next().hide();
                    $(element).next().next().show();
                    $(element).attr("validate","false");
                }else{
                    $(element).next().show();
                    $(element).next().next().hide();
                    $(element).css("border","1px solid #e6e6e6");
                    $(element).attr("validate","true")
                }
            }else{
                $(element).next().show();
                $(element).next().next().hide();
                $(element).css("border","1px solid #e6e6e6");
                $(element).attr("validate","true")
            }
        }
    });
    $.each(input,function(index,element){
        var validate = $(element).attr("validate");
        if(validate=="false"){
            flag =false;
            return;
        }
    });
    return flag;
}

function validateInvoiceAddressForm(form){
    var input = form.find(".inputxt");
    var flag = true;
    $.each(input,function(index,element){
        var v = $(element).val();
        if(index==6){ //邮编不校验
            return;
        }
        if(!v){
            if(index!=6){
                $(element).css("border","1px solid #ff4800");
                $(element).next().hide();
                $(element).next().next().show();
                $(element).attr("validate","false");
            }
        }else{
            if(index==1){
                var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
                if(!reg1.test(v)&&!reg2.test(v)){
                    $(element).css("border","1px solid #ff4800");
                    $(element).next().hide();
                    $(element).next().next().show();
                    $(element).attr("validate","false");
                }else{
                    $(element).next().show();
                    $(element).next().next().hide();
                    $(element).css("border","1px solid #e6e6e6");
                    $(element).attr("validate","true");
                }
            }
            else if(index==2){
                if(v=="省份"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }
            else if(index==3){
                if(v=="地级市"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }
            else if(index==4){
                if(v=="请选择"){
                    $(element).css("border","1px solid #ff4800");
                    $(element).parent().next().show();
                    $(element).attr("validate","false");
                }
            }else{
                $(element).next().show();
                $(element).next().next().hide();
                $(element).css("border","1px solid #e6e6e6");
                $(element).attr("validate","true");
            }
        }
    });
    $.each(input,function(index,element){
        var validate = $(element).attr("validate");
        if(validate=="false"){
            flag =false;
            return;
        }
    });
    return flag;
}