
//全局变量定义

//商品列表
var productDetails = [];

var customRowNum = 0;


function watchAttachments() {
	
	layer.open({
        title: "附件列表",
        type: 2,
        area: '745px',
        fixed: false, //不固定
        maxmin: true,
        content: '/projectReport/attachList?backupId=' + _backupId,
        btn : [ '关闭' ],
        yes : function(index, layero) {
        	layer.close(index);
        } ,
	   cancel : function() {
	   
	   }
    });
}

function queryProjectDetail(_backupId) {
        postUtil.call("/projectReport/getProjectDetail", {"backupId" : _backupId}, function (result) {
            if (result.STATUS == "SUCCESS") {
                var data = result.DATA;
                bindSalesEmployee(data);
                bindDistributorAccout(data.distributorAccout,data.orderProjectBackup);
                bindOrderProjectBackup(data);
                bindOrderProjectBackupProprietors(data);
                bindOrderProjectBackupIntegrators(data);
                bindOrderProjectBackupFollows(data.orderProjectBackupFollows);
                bindOrderProjectBackupSkus(data.orderProjectBackupSkus);
                renderSecret(data);
            } else {
                alert(result.MSG);
            }
        });
    }

    function bindSalesEmployee(data) {
    	var salesEmployee = data.salesEmployee;
        var html = '';
        html += '<span class="c-2 mr20" style="flex: 1;">提报人：'+data.mentioner+'</span><span class="c-2 mr20" style="flex: 1;">销售代表：'+salesEmployee.userRealName+'</span>'+'<span style="flex: 1;" class="c-2">联系电话：'+salesEmployee.mobile+'</span>';
        $("#bindSalesEmployee").empty();
        $("#bindSalesEmployee").html(html);
    }

    function bindDistributorAccout(distributorAccout,orderProjectBackup) {
        var html = '';
        var accountName = distributorAccout==null?"":distributorAccout.accountName;
        if(accountName == ""){
            $("#bindDistributorAccout").parent().parent().hide();
        }
        html += '<span class="fz12  frt mt5">公司名称：'+accountName+"         "+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分销商本项目负责人：'+orderProjectBackup.distributorPrincipalName
        +"         "+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：'+orderProjectBackup.distributorPrincipalMobile+"         "+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邮箱：'+orderProjectBackup.distributorPrincipalEmail+'</p>';
        $("#bindDistributorAccout").empty();
        $("#bindDistributorAccout").html(html);
    }
    
    function bindOrderProjectBackup(data) {
        orderProjectBackup = data.orderProjectBackup;
        var projectChangeMap = data.projectChangeMap;
        var html = '';
        if(projectChangeMap && projectChangeMap.projectName){
        	html += '<p>项目名称：<span class="bg-fb">'+orderProjectBackup.projectName+'</span></p>';
        }else{
        	html += '<p>项目名称：<span class="c-2">'+orderProjectBackup.projectName+'</span></p>';
        }
        $("#orderProjectBackup-1").empty();
        $("#orderProjectBackup-1").html(html);

        $("#orderProjectBackup-head-2").html('（编号：'
                        + orderProjectBackup.backupId + '，'
                        + new Date(orderProjectBackup.commitDate).format('yyyy-MM-dd hh:mm:ss') + '）');

        var html = '';
        html += '<p>项目编号：<span class="c-2">'+orderProjectBackup.projectNumber+'</span></p>';
        html += '<p>报备状态：<span class="c-f">'+orderProjectBackup.status+'</span></p>';
        if(projectChangeMap && projectChangeMap.projectLevel){
        	html += '<p>项目等级：<span class="bg-fb">'+orderProjectBackup.projectLevel+'</span></p>';
        }else{
        	html += '<p>项目等级：<span class="c-2">'+orderProjectBackup.projectLevel+'</span></p>';
        }
        
        if(orderProjectBackup.changeStatus){
        	html += '<p>项目变更状态：<span class="c-f">'+orderProjectBackup.changeStatus+'</span></p>';
        }
        
        $("#orderProjectBackup-2").empty();
        $("#orderProjectBackup-2").html(html);
        var html = '';
        var location='';
        if(isExitsVariable(orderProjectBackup.projectProvince)==isExitsVariable(orderProjectBackup.projectCity)){
        	location=isExitsVariable(orderProjectBackup.projectProvince);
        }else{
        	location=isExitsVariable(orderProjectBackup.projectProvince)+isExitsVariable(orderProjectBackup.projectCity);
        }
        html += '<p>项目地：<span class="c-2">'+location+'</span></p>';
        html += '<p>要求保护期：<span class="c-f">'+(new Date(orderProjectBackup.projectProtectDate)).format('yyyy-MM-dd')+'</span></p>';
        html += '<p>授权状态：<span class="c-f">' + data.authorizationStatus + '</span></p>';
        $("#orderProjectBackup-3").empty();
        $("#orderProjectBackup-3").html(html);

        //项目保密和公开商品

        var SECRETIVE_check = "";
        var OPEN_TO_SOMEAREA_check = "";
        var OPEN_TO_ALL_check = "";
        if(orderProjectBackup.secrecyOpt == "SECRETIVE") {
            SECRETIVE_check = "checked";
        }
        if(orderProjectBackup.secrecyOpt == "OPEN_TO_SOMEAREA") {
            OPEN_TO_SOMEAREA_check = "checked";
        }
        if(orderProjectBackup.secrecyOpt == "OPEN_TO_ALL") {
            OPEN_TO_ALL_check = "checked";
        }
        var isOpenSku_N = ""
        var isOpenSku_Y = "";
        if(orderProjectBackup.isOpenSku == "N") {
            isOpenSku_N = "checked";
        }
        if(orderProjectBackup.isOpenSku == "Y") {
            isOpenSku_Y = "checked";
        }
        var html =  "";
        html += '<p class="fz12 flt" style="line-height:35px;margin-left:30px;">项目保密选择：';
        html += '</p>';
        html += '<div class="layui-form flt">';
        html += '<input disabled  lay-filter="secrecyOpt" type="radio" name="secrecyOpt" value="SECRETIVE" title="保密" '+SECRETIVE_check+' />';
        html += '<input disabled  lay-filter="secrecyOpt" type="radio" name="secrecyOpt" value="OPEN_TO_SOMEAREA" title="对某些区域公开" '+OPEN_TO_SOMEAREA_check+'/>';
        html += '<input disabled  style="height: 28px;margin-right:20px;"  type="text" name="city" value="'+isExitsVariable(orderProjectBackup.secrecyArea)+'" readonly/>';
        html += '<input disabled  lay-filter="secrecyOpt" type="radio" name="secrecyOpt" value="OPEN_TO_ALL" title="对所有区域公开" '+OPEN_TO_ALL_check+' />';
        html += '</div>';


        $("#orderProjectBackup-4").empty();
        $("#orderProjectBackup-4").html(html);

        var html =  "";

        html += '<p class="fz12 flt" style="line-height:35px;margin-left:30px;">公开商品：';
        html += '</p>';
        html += '<div class="layui-form flt">';
        html += '<input disabled  lay-filter="isOpenSku" type="radio" name="isOpenSku" value="N" title="否" '+isOpenSku_N+' />';
        html += '<input disabled  lay-filter="isOpenSku" type="radio" name="isOpenSku" value="Y" title="是" '+isOpenSku_Y+' />';
        html += '</div>';
//        html += '</p>';
        if(orderProjectBackup.secrecyOpt == "SECRETIVE") {
            $("#orderProjectBackup-5").empty();
        }else {
            $("#orderProjectBackup-5").empty();
            $("#orderProjectBackup-5").html(html);
        }


        //项目描述
        $("#projectDecription").empty();
        $("#projectDecription").html(orderProjectBackup.projectDecription);
        
        //
        var html = '';
        html += '<p>预计芯公里（光缆）：<span class="c-2">'+orderProjectBackup.predictFiberKilometers+'</span></p>';
        html += '<p>预计金额（光配、铜配）：<span class="c-2">'+orderProjectBackup.predictAmount+'</span></p>';
        $("#predict").empty();
        $("#predict").html(html);
    }

    function renderSecret() {

        layui.use(['form','laydate'], function() {
            form = layui.form();
            $form = $('form');

            form.on('radio(secrecyOpt)', function(data){

            });

            setTimeout('form.render()',1000);
        });
    }
    
    function bindOrderProjectBackupProprietors(data) {
    	var dataList = data.orderProjectBackupProprietorsMap;
    	var projectChangeMap = data.projectChangeMap;
    	var proprietorChangeIdList = [];
    	if(projectChangeMap && projectChangeMap.proprietorChangeIdList){
    		proprietorChangeIdList = projectChangeMap.proprietorChangeIdList;
    	}
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1];
                var class1='';
                for (var j=0;j<proprietorChangeIdList.length;j++){
                	if(proprietorChangeIdList[j]== data.proprietorId){
                		class1='bg-fb';
                	}
                }
                if(!data.found){
                    html+='  <tr class="'+class1+'" style="background-color: #fefdb4">';
                }else{
                	html+='  <tr class="'+class1+'">';
                }
                html+=	 '   <td>'+isExitsVariable(data.proprietorCompanyName)+'</td>'+
			             '   <td>'+isExitsVariable(data.proprietorCreditId)+'</td>'+
			             '   <td>'+isExitsVariable(data.proprietorLinkMan)+'</td>'+
			             '   <td>'+isExitsVariable(data.proprietorLinkMobile)+'</td>'+
			             '   <td>'+isExitsVariable(data.proprietorLinkPosition)+'</td>'+
			             '  </tr>'
           }
        }
        $("#orderProjectBackupProprietors").empty();
        $("#orderProjectBackupProprietors").html(html);
    }
    
    function bindOrderProjectBackupIntegrators(data) {
    	var dataList = data.orderProjectBackupIntegratorsMap;
    	var projectChangeMap = data.projectChangeMap;
    	var integratorChangeIdList = [];
    	if(projectChangeMap && projectChangeMap.integratorChangeIdList){
    		integratorChangeIdList = projectChangeMap.integratorChangeIdList;
    	}
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1];
                var class1='';
                for (var j=0;j<integratorChangeIdList.length;j++){
                	if(integratorChangeIdList[j]== data.integratorId){
                		class1='bg-fb';
                	}
                }
                if(!data.found){
                    html+='  <tr class="'+class1+'" style="background-color: #fefdb4">';
                }else{
                	html+='  <tr class="'+class1+'">';
                }
                html+=   '   <td>'+isExitsVariable(data.integratorCompanyName)+'</td>'+
			             '   <td>'+isExitsVariable(data.integratorCreditId)+'</td>'+
			             '   <td>'+isExitsVariable(data.integratorLinkMan)+'</td>'+
			             '   <td>'+isExitsVariable(data.integratorLinkMobile)+'</td>'+
			             '   <td>'+isExitsVariable(data.integratorLinkPosition)+'</td>'+
			             '  </tr>'
           }
        }
        $("#orderProjectBackupIntegrators").empty();
        $("#orderProjectBackupIntegrators").html(html);
    }
    
    function bindOrderProjectBackupSkus(dataList) {
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1]; 
                html+='  <tr>'+
                		 '   <td  style="width:20%">'+isExitsVariable(data.skuModel)+'</td>'+
			             '   <td  style="width:10%">'+isExitsVariable(data.skuBrandName)+'</td>'+
			             '   <td  style="width:30%">'+isExitsVariable(data.skuName)+'</td>'+
			             '   <td  style="width:10%">'+isExitsVariable(data.skuQuantity)+'</td>'+
			             '   <td  style="width:10%">'+isExitsVariable(data.skuUnitName)+'</td>'+
			             '   <td  style="width:10%">'+isExitsVariable(data.expectSkuPrice)+'</td>'+
			             '  </tr>'
           }
        }
        $("#orderProjectBackupSkus").empty();
        $("#orderProjectBackupSkus").html(html);
    }
    
    
    function bindOrderProjectBackupFollows(dataList) {
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1];
                var fllowDate = isExitsVariable(data.followDate);
                if(fllowDate != ''){
                    fllowDate = new Date(fllowDate).format("yyyy-MM-dd hh:mm:ss")
                }
                html+='  <tr>'+
                		 '   <td >'+isExitsVariable(data.followMan)+'</td>'+
			             '   <td >'+fllowDate+'</td>'+
                '   <td >'+((isExitsVariable(data.visitType) == "HOUSE") ? "登门拜访":"电话联系")+'</td>'+
			             '   <td >'+isExitsVariable(data.visitMainObject)+'</td>'+
			             '   <td >'+isExitsVariable(data.visitCompanyName)+'</td>'+
			             '   <td >'+isExitsVariable(data.visitLinkMan)+'</td>'+
			             '   <td >'+isExitsVariable(data.visitLinkMobile)+'</td>'+
			             '   <td >'+isExitsVariable(data.visitContentDescriptor)+'</td>'+
			             '  </tr>'
           }
        }
        $("#orderProjectBackupFollows").empty();
        $("#orderProjectBackupFollows").html(html);
    }
    
    function isExitsVariable(variableName) {  
        try {  
            if (typeof (variableName) == "undefined"||variableName==null) {  
                return "";  
            } else {  
                return variableName;  
            }  
        } catch (e) {  
        }  
        return "";  
    }

    