function getAddress(consigneeAddressId,buyerAccountId,province,city){
    var data1 = province+city;
    postUtil.call('/mallOrder/api/mallConsigneeAddress/getAccountConsigneeAddressList',{"projectPlace":data1,"buyerAccountId":buyerAccountId},function(data){
        if(data.STATUS=="SUCCESS"){
            var list = data.DATA;
            var status='';
            var html = '';
            html += '<dl class="dl-form mb5-i deliveryDetailAddress">';
            html += '<dt class="flt">详细地址：</dt>';
            html += '<dd class="flt c-2 jun-list pt5 content1" style="margin-bottom:0px;">';
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                  if(consigneeAddressId!=""&&list[i].consigneeAddressId==consigneeAddressId){
                      status = 'on';
                    }else{
                      status = '';
                    }
                    html += renderDeliveryAddress(list[i],status,true);

                }
            }
            html += '<span class="form-btn form-btn layui-btn-itoc layui-btn-big" onclick="addDeliveryAddress(\''+province+'\',\''+city+'\')">新增收货地址</span>';
            html += ' <div id="deliveryAddress-tips" class="deliveryAddress-tips ml20" style="display:none;width: 120px;"><span class="c-f">*请填写收货地址</span></div>';
            html += '</dd>';
            html += '</dl>';
            $("#detailAddressArea").html(html);
        }
    });
}

function addDeliveryAddress(province,city){
	var consigneeAddressPageUrl = "/mallOrder/api/mallConsigneeAddress/consigneeAddressPage?choosedProvince="+province+"&choosedCity="+city;
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
            postUtil.call('/mallOrder/api/mallConsigneeAddress/addConsigneeAddress?offerId='+offerId+'&buyerAccountId='+vm.$data.datas.buyerAccountId,data,function(data){
            	layer.closeAll('loading');
            	if(data.success){
                    	$("#detailAddressArea").find('.content1').prepend(renderDeliveryAddress(data.data,'',true));
                     layer.close(index);
                }else{
                	layer.msg('新增收获地址失败',{icon:5})
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}

function renderDeliveryAddress(data,status,opre){
    var html="";
    if(opre){
        html += '<div class="mb5" id="deliveryAddress_'+data.consigneeAddressId+'" inquiryOrderProvince="'+ data.prov +
            '" inquiryOrderCity="'+ data.city+'" inquiryOrderAddress="'+ data.consigneeAddress + '" consignee="'+data.consignee + '" consigneeMobile="' + data.consigneeMobile +
            '"><label><span class="pay_list_c2 '+status+'"><input type="radio" name="deliveryAddress"  class="radioclass" style="height:12px;" /></span><span>'+
            data.consigneeAddress + '</span><span class="ml20">'+ data.consignee+'</span><span class="ml20">'+
            data.consigneeMobile+'</span></label><span class="ml20 c-h cs-p"'+
            'onclick="updateBuyerConsigneeAddress(\''+data.consigneeAddressId+'\')">修改</span>'+
            '<span class="ml20 c-h cs-p"'+
            'onclick="deleteBuyerConsigneeAddress(\''+data.consigneeAddressId+'\')">删除</span></div>';
             vm.$data.consigneeAddressId=data.consigneeAddressId;
    }else{

        html += '<label><span class="pay_list_c2 '+status+'"><input type="radio" name="deliveryAddress"  class="radioclass" style="height:12px;" /></span><span>'+
            data.consigneeAddress + '</span><span class="ml20">'+ data.consignee+'</span><span class="ml20">'+
            data.consigneeMobile+'</span></label><span class="ml20 c-h cs-p"'+
            'onclick="updateBuyerConsigneeAddress(\''+data.consigneeAddressId+'\')">修改</span>'+
            '<span class="ml20 c-h cs-p"'+
            'onclick="deleteBuyerConsigneeAddress(\''+data.consigneeAddressId+'\')">删除</span>';
           vm.$data.consigneeAddressId=data.consigneeAddressId;
    }
    return html;
}

//下载附件
function downLoadMallAttachment(mallFileAttachmentId) {
    var param = {};
    param.fileAttachmentId = mallFileAttachmentId;
    postUtil.submit("${request.contextPath}/file_server/mall/generalFileDownload", param);
}

//修改收货地址
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
        postUtil.call('/mallOrder/api/mallConsigneeAddress/updateConsigneeAddress?offerId='+offerId+'&consigneeAddressId='+consigneeAddressId+"&consigneeAddressIdOld="+vm.$data.datas.consigneeAddressId,data,function(data){
        	layer.closeAll('loading');
        	if(data.success){
        		var selected = $("#deliveryAddress_"+consigneeAddressId).find('.pay_list_c2').hasClass('on');
                if(selected){
                  $("#deliveryAddress_"+consigneeAddressId).html(renderDeliveryAddress(data.data,'on',false));
                }else{
                   $("#deliveryAddress_"+consigneeAddressId).html(renderDeliveryAddress(data.data,'',false));
                }
         		layer.close(index); 
            }else{
            	layer.msg('修改收获地址失败',{icon:5})
            }
        })
    }
    ,btn2: function(index, layero){
           
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
          postUtil.call('/mallOrder/api/mallConsigneeAddress/deleteConsigneeAddress',{consigneeAddressId:id,offerId:offerId,consigneeAddressIdOld:vm.$data.datas.consigneeAddressId},function(data){
              if(data.success){
            	  $('.deliveryDetailAddress').find("#deliveryAddress_"+id).remove();
              }else{
            	  layer.msg("删除收货地址失败",{icon:5});
              }
          });
      }
});
}

function addBuyerInvoice(buyerAccountId){
	layer.open({
        title:"新增开票信息",
        type: 2,
        skin:'myskin',
        //scrollbar:false,
        area: ['600px', '540px'],
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
            postUtil.call('/mallOrder/api/mallInvoice/addInvoice?offerId='+offerId+'&buyerAccountId='+buyerAccountId,data,function(data){
                layer.closeAll('loading');
                if(data.success){
                    	$(".invoiceDetail-info").find('.content1').prepend(renderBuyerInvoice(data.data,'',true));
                     layer.close(index);

               }else{
                   
               }
            })
        }
        ,btn2: function(index, layero){
               
        }
    });
}


function renderBuyerInvoice(data,status,oper){
	 var html='';
	  if(oper){
	     html += '<div id="invoice_'+data.invoiceId+'" invoiceCorporationName="'+data.corporationName+
	            '" invoiceEaxpayerIdentificationNumber="'+ data.taxpayerIdentificationNumber+
	            '" invoiceCorporationAddress="'+ data.corporationAddress+
	            '" invoiceCorporationPhoneNumber="'+data.corporationPhoneNumber+
	            '" invoiceCorporationBankAccount="'+data.corporationBankAccount+
	            '" invoiceCorporationBankDesc="'+data.corporationBankDesc+'"><label>'+
	            '<span class="pay_list_c2  '+ status +'">'+
	            '<input type="radio" name="buyerInvoice"  class="radioclass" checked="checked" style="height:12px;" /></span>'+
	            '<textarea readonly="readonly">开票单位名称：'+data.corporationName+'/纳税人识别码：'+ 
	            data.taxpayerIdentificationNumber+'/注册地址：'+data.corporationAddress+'/开户银行：'+
	            data.corporationBankDesc+'/银行账号：'+data.corporationBankAccount+'</textarea>'+ 
	            '</label>'+
	            '<span class="ml20 c-h cs-p"'+
	            'onclick="updateBuyerInvoice(\''+data.invoiceId+'\')" style="vertical-align:top;">修改</span>'+
	            '<span class="ml20 c-h cs-p"'+
	            'onclick="deleteBuyerInvoice(\''+data.invoiceId+'\')" style="vertical-align:top;">删除</span></div>';
	    }else{

	     html += '<label><span class="pay_list_c2  '+ status +'">'+
	            '<input type="radio" name="buyerInvoice"  class="radioclass" checked="checked"  style="height:12px;" /></span>'+
	            '<textarea readonly="readonly">开票单位名称：'+data.corporationName+'/纳税人识别码：'+ 
	            data.taxpayerIdentificationNumber+'/注册地址：'+data.corporationAddress+'/开户银行：'+
	            data.corporationBankDesc+'/银行账号：'+ data.corporationBankAccount+'</textarea>'+
	            '</label>'+
	            '<span class="ml20 c-h cs-p"'+
	            'onclick="updateBuyerInvoice(\''+data.invoiceId+'\')" style="vertical-align:top;">修改</span>'+
	            '<span class="ml20 c-h cs-p"'+
	            'onclick="deleteBuyerInvoice(\''+data.invoiceId+'\')" style="vertical-align:top;">删除</span></label>';
	    }   
	    return html;
}

function updateBuyerInvoice(invoiceId){
    layer.open({
        title:"修改增票信息",
        type: 2,
        skin:'myskin',
        area: ['600px', '540px'],
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
            postUtil.call('/mallOrder/api/mallInvoice/updateInvoice?offerId='+offerId+'&invoiceId='+invoiceId+"&invoiceIdOld="+vm.$data.datas.invoiceId,data,function(data){
            	layer.closeAll('loading');
            	if(data.success){
            		var invoice = data.data;
            		invoiceId= invoice.invoiceId;
            		var selected = $("#invoice_"+invoiceId).find('.pay_list_c2').hasClass('on');
                    if(selected){
                    	$("#invoice_"+invoiceId).html(renderBuyerInvoice(data.data,'on',false));
                    }else{
                    	$("#invoice_"+invoiceId).html(renderBuyerInvoice(data.data,'',false));
                    }
                    layer.close(index);
                }else{
                	layer.msg('修改开票信息失败',{icon:5})
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
            postUtil.call('/mallOrder/api/mallInvoice/deleteInvoice',{"invoiceId":id,"offerId":offerId,"invoiceIdOld":vm.$data.datas.invoiceId},function(data){
                if(data.success){
                	  $('.invoiceDetail-info').find("#invoice_"+id).remove();
                }
            });
        }
    });
}
/*
 *新增收票地址
 */
function addBuyerInvoiceAddress(buyerAccountId){

    layer.open({
        title:"新增收票地址",
        type: 2,
        skin:'myskin',
        area: ['600px', '489px'],
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
            postUtil.call('/mallOrder/api/mallInvoice/address/addInvoiceAddress?offerId='+offerId+"&buyerAccountId="+buyerAccountId,data,function(data){
                if(data.success){
                    	$('.invoiceAddress-tips').hide();
                    	$(".invoiceAddress-info").find('.content1').prepend(renderBuyerInvoiceAddress(data.data,'',true));
                    layer.close(index);
                }else{
                	 layer.msg("新增开票信息出错！");
                }
            })
        }
        ,btn2: function(index, layero){

        }
    });

}

function renderBuyerInvoiceAddress(data,status,opre){

    var html="";

    if(opre){
        html += '<div class="mb5" id="invoiceAddress_'+data.invoiceAddressId+'" invoiceConsignee="'+ data.consignee +
            '" invoiceConsigneeMobile="'+ data.consigneeMobile+'" invoiceConsigneeAddress="'+ data.consigneeAddress +
            '"><label><span class="pay_list_c2 '+status+'"><input type="radio" name="buyerInvoiceAddress"  class="radioclass" style="height:12px;" /></span><span>'+
            data.consigneeAddress + '</span><span class="ml20">'+ data.consignee+'</span><span class="ml20">'+
            data.consigneeMobile+'</span></label><span class="ml20 c-h cs-p"'+
            'onclick="updateBuyerInvoiceAddress(\''+data.invoiceAddressId+'\')">修改</span>'+
            '<span class="ml20 c-h cs-p"'+
            'onclick="deleteBuyerInvoiceAddress(\''+data.invoiceAddressId+'\')">删除</span></div>';
            vm.$data.invoiceAddressId=data.invoiceAddressId;
    }else{
        html += '<label><span class="pay_list_c2 '+status+'"><input type="radio" name="buyerInvoiceAddress"  class="radioclass" style="height:12px;" /></span><span>'+
            data.consigneeAddress + '</span><span class="ml20">'+ data.consignee+'</span><span class="ml20">'+
            data.consigneeMobile+'</span></label><span class="ml20 c-h cs-p"'+
            'onclick="updateBuyerInvoiceAddress(\''+data.invoiceAddressId+'\')">修改</span>'+
            '<span class="ml20 c-h cs-p"'+
            'onclick="deleteBuyerInvoiceAddress(\''+data.invoiceAddressId+'\')">删除</span>';
        vm.$data.invoiceAddressId=data.invoiceAddressId;
    }

    return html;
}

function updateBuyerInvoiceAddress(invoiceAddressId){
    layer.open({
        title:"修改增票信息",
        skin:'myskin',
        type: 2,
        area: ['600px', '489px'],
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
            postUtil.call('/mallOrder/api/mallInvoice/address/updateInvoiceAddress?offerId='+offerId+'&invoiceAddressId='+invoiceAddressId+"&invoiceAddressIdOld="+vm.$data.datas.invoiceAddressId,data,function(data){
                if(data.success){
                    var selected = $("#invoiceAddress_"+invoiceAddressId).find('.pay_list_c2').hasClass('on');
                    if(selected){
                      $("#invoiceAddress_"+invoiceAddressId).html(renderBuyerInvoiceAddress(data.data,'on',false));
                    }else{
                      $("#invoiceAddress_"+invoiceAddressId).html(renderBuyerInvoiceAddress(data.data,'',false));
                    }
                    layer.close(index);

                }else{

                }
            })
        }
        ,btn2: function(index, layero){

        }
    });
}


function deleteBuyerInvoiceAddress(invoiceAddressId){
    layer.open({
        title: '操作提示',
        skin: 'myskin',
        area: ['430px', '260px'],
        btnAlign: 'c',
        content: '<p style="text-align: center;margin-top: 50px;font-size:16px;color:#222222">是否确定删除此地址信息？</p>',
        btn: ['确定','取消'],
        yes: function(index, layero){
            layer.close(index);
            postUtil.call('/mallOrder/api/mallInvoice/address/deleteInvoiceAddress',{invoiceAddressId:invoiceAddressId,"offerId":offerId,"invoiceAddressIdOld":vm.$data.datas.invoiceAddressId},function(data){
                if(data.success){
                    $('.invoiceAddress-info').find("#invoiceAddress_"+invoiceAddressId).remove();
                }
            });
        }
    });
}

//单选        
$(document).on("click",".content1 .pay_list_c2",function(){
var hasClass = $(this).hasClass('on');
if(hasClass){
//  $(this).removeClass('on');
}else{
$(this).addClass("on").parent().parent().siblings().find(".pay_list_c2").removeClass("on");
}

})

//获取收货地址和项目地信息
function getDeliveryAddress(){
var isOrnot = $('.deliveryDetailAddress').find('.content1').find('.mb5').length;
var deliveryAddressInfo = {};
    deliveryAddressInfo.inquiryOrderAddress = '';
    deliveryAddressInfo.consignee = '';
    deliveryAddressInfo.consigneeMobile = '';
    deliveryAddressInfo.consigneeAddress = '';  
    deliveryAddressInfo.isChooseDeliveryAddressInfo='N';
    
if(isOrnot){
    var hasAddress = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').length;
    if(hasAddress){
     var selected = $('.deliveryDetailAddress').find('.content1').find('.pay_list_c2.on').parent().parent();
     deliveryAddressInfo.inquiryOrderAddress = selected.attr('inquiryorderaddress');
     deliveryAddressInfo.consignee = selected.attr('consignee');
     deliveryAddressInfo.consigneeMobile = selected.attr('consigneemobile');
     deliveryAddressInfo.consigneeAddress = selected.attr('inquiryorderaddress');  
     deliveryAddressInfo.isChooseDeliveryAddressInfo='Y';
     var consigneeAddressId=selected.attr('id');
     vm.$data.todos.consigneeAddressId=consigneeAddressId.substring(consigneeAddressId.indexOf("_")+1);
    }
}
return deliveryAddressInfo;
}

//获取发票信息和收票地址
function getInoviceInfo(){
   var invoiceInfo = {};
     invoiceInfo.invoiceCorporationName = "";
     invoiceInfo.invoiceEaxpayerIdentificationNumber = "";
     invoiceInfo.invoiceCorporationAddress = "";
     invoiceInfo.invoiceCorporationPhoneNumber = "";
     invoiceInfo.invoiceCorporationBankAccount = "";
     invoiceInfo.invoiceCorporationBankDesc = "";
     invoiceInfo.invoiceConsignee = "";
     invoiceInfo.invoiceConsigneeAddress = "";
     invoiceInfo.invoiceConsigneeMobile  = "";
     invoiceInfo.isChooseInvoiceAddress="N";//是否选择收票地址
     invoiceInfo.isChooseInvoiceInfo = "N";//是否选择发票信息
     if(vm.$data.todos.isNeedInvoice=="Y"){
		     invoiceInfo.isNeedInvoice = "Y";
		     //发票信息
		     var isInvoiceINfo = $('.invoiceDetail-info').find('.content1').find('div').length;
		     if(isInvoiceINfo){
		         var hasInvoice = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').length;
		         if(hasInvoice){
		            var selected = $('.invoiceDetail-info').find('.content1').find('.pay_list_c2.on').parent().parent();
		            invoiceInfo.invoiceCorporationName = selected.attr('invoicecorporationname');
		            invoiceInfo.invoiceEaxpayerIdentificationNumber = selected.attr('invoiceeaxpayeridentificationnumber');
		            invoiceInfo.invoiceCorporationAddress = selected.attr('invoicecorporationaddress');
		            invoiceInfo.invoiceCorporationPhoneNumber = selected.attr('invoicecorporationphonenumber');
		            invoiceInfo.invoiceCorporationBankAccount = selected.attr('invoicecorporationbankaccount');
		            invoiceInfo.invoiceCorporationBankDesc = selected.attr('invoicecorporationbankdesc');
		            invoiceInfo.isChooseInvoiceInfo = "Y";
		            var invoiceId=selected.attr('id');
		            vm.$data.invoiceId=invoiceId.substring(invoiceId.indexOf("_")+1);
		         }
		     }
		 
		    //收票地址
		    var isInvoiceAddress = $('.invoiceAddress-info').find('.content1').find('div').length;
		     if(isInvoiceAddress){
		        var hasOn = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').length;
		        if(hasOn){
		         var selINvoiceAddress = $('.invoiceAddress-info').find('.content1').find('.pay_list_c2.on').parent().parent();
		          invoiceInfo.invoiceConsignee =  selINvoiceAddress.attr('invoiceconsignee');
		          invoiceInfo.invoiceConsigneeAddress = selINvoiceAddress.attr('invoiceconsigneeaddress');
		          invoiceInfo.invoiceConsigneeMobile = selINvoiceAddress.attr('invoiceConsigneeMobile');
		          invoiceInfo.isChooseInvoiceAddress="Y";
		          var invoiceAddressId=selected.attr('id');
		          vm.$data.invoiceAddressId=invoiceAddressId.substring(invoiceAddressId.indexOf("_")+1);
		        }
		     }
   }else{
	   invoiceInfo.isNeedInvoice = "N";
   }
   return invoiceInfo;

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

$(document).on('click','.needInvoice label',function(){
		$('.needInvoice label').find('.pay_list_c2').removeClass('on');
		$(this).find('.pay_list_c2').addClass('on');
		var isNeedInvoice = $(this).find('span:last-child').text();
		if(isNeedInvoice=="不开票"){
		    $('.invoiceDetail-info,.invoiceAddress-info').css('display','none');
		}else{
		    $('.invoiceDetail-info,.invoiceAddress-info').css('display','block');      
		}
})

//初始化加载已有开票信息
function initBuyerInvoice(buyerAccountId,invoiceId){
postUtil.call('/mallOrder/api/mallInvoice/list',{"buyerAccountId":buyerAccountId},function(data){
  if(data.success){
    var list = data.data;
    var status='';
    var html = '';
    if(list.length>0){
      for(var i=0;i<list.length;i++){
        if(list[i].invoiceId==invoiceId){
          status = 'on';
        }else{
             if(list[i].isDefault=="Y"){
                status = 'on';
              }else{ 
                status = '';
              }
        }
        html += renderBuyerInvoice(list[i],status,true);
      }
      $(".invoiceDetail-info").find('.content1').prepend(html);
    }
  }
});

}


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

function initBuyerInvoiceAddress(buyerAccountId,invoiceAddressId){
postUtil.call('/mallOrder/api/mallInvoice/address/list',{"buyerAccountId":buyerAccountId},function(data){
	if(data.success){
    var list = data.data;
    var status='';
    var html = '';
    if(list.length>0){
      for(var i=0;i<list.length;i++){
        if(list[i].invoiceAddressId==invoiceAddressId){
          status = 'on';
        }else{
          status = '';
        }
        html += renderBuyerInvoiceAddress(list[i],status,true);
      }
      $(".invoiceAddress-info").find('.content1').prepend(html);
    }
  }
});

}