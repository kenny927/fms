var seletedItems="";
var html2="";
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

$(function(){ 
	layer = layui.layer;
	var param={};
	param.currentPageIndex=1;
	loadMallCustomerList(param);
}); 


function loadMallCustomerList(param) {
	var signedType=isExitsVariable(_signedType);
	var menuType=isExitsVariable(_menuType);
	if(signedType!=""){
		param.signedType=signedType;
	}
	if(menuType!=""){
		param.menuType=menuType;
	}
    postUtil.call("/mallCustomer/list", param, function (result) {
    	 var pageNumber = result.pageNumber;
         var pageSize = result.pageSize;
         var totalPage = result.totalPage;
         var totalRow = result.totalRow;
         var dataList = result.list;
         renderTable(dataList);
         laypage({
                cont: 'paginationDiv',
                pages: totalPage,
                curr: pageNumber,
                total: totalRow,
                skip: true,
                jump: function (obj, first) {
                    if (!first) {
                    	param.currentPageIndex=obj.curr;
                    	loadMallCustomerList(param);
                    }
                }
            });
 });
}
function renderTable(dataList) {
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1]; 
                var VERIFIED=data.VERIFIED;
                html+='  <tr>';
                		 if(seletedItems.indexOf(data.accountId)>=0){
                			 html+= '   <td><input type="checkbox" name="single" accountId="'+data.accountId+'" checked accountStatus="'+isExitsVariable(data.accountStatus)+'"></td>';
                		 }else{
                			 html+= '   <td><input type="checkbox" name="single" accountId="'+data.accountId+'" accountStatus="'+isExitsVariable(data.accountStatus)+'" ></td>';
                		 }
                          if(VERIFIED=="Y"){
                			 html+='   <td><p><a href="javascript:openDetailTab(\''  + data.accountId + '\')">'+isExitsVariable(data.accountName)+'<span style="color:red;">(已认证)</span></p></a><p style="color:#999999">'+isExitsVariable(data.inteSocialCreditNo)+'</p></td>';
                		 }else{
                			 html+= '   <td><p><a href="javascript:openDetailTab(\''  + data.accountId + '\')">'+isExitsVariable(data.accountName)+'</p></a><p style="color:#999999">'+isExitsVariable(data.inteSocialCreditNo)+'</p></td>';
                		 }
                		 var phoneDisplay = "";
				         if(isExitsVariable(data.linkmanTelephone) != "") {
                             phoneDisplay = isExitsVariable(data.linkmanTelephone);
						 } else {
                             phoneDisplay = isExitsVariable(data.linkmanFixedTelephone);
						 }
                		 html+= '   <td>'+isExitsVariable(data.linkmanName)+'</td>'+
			             '   <td><a href="javascript:void(0);" onclick="searchNum(\''+phoneDisplay+'\');">'+phoneDisplay+'</a></td>'+
			             '   <td>'+isExitsVariable(data.province)+isExitsVariable(data.city)+'</td>'+
			             '   <td>'+isExitsVariable(data.accountStatusCname)+'</td>'+
			             '   <td><a href="javascript:openDemandTab(\''  + data.userName + '\')">'+isExitsVariable(data.demandNum)+'</a></td>'+
			             '   <td>'+isExitsVariable(data.accountResourceCname)+'</td>'+
			             '   <td>'+isExitsVariable(data.accountManagerName)+'</td>'+
			             '   <td>'+isExitsVariable(data.userRealName)+'</td>'+
			             '   <td>'+isExitsVariable(data.createDate)+'</td>'+
			             '  </tr>'
           }
        }else{
        	 html+='<tr>'+
        	 		'<td  colspan="11" height="50px"  align="center">'+
        	 		'<span class="fz16">暂无相关信息</span> '+
        	 		'</td>'+
        	 		'</tr>'
        }
        $(".layui-table tbody").html(html);
    }

function searchNum(data) {
	var num	= $.trim(data);
	if(num && num != "") {
        window.open("https://www.baidu.com/s?wd="+encodeURI(num));
        return false;
	}
}

function openDetailTab(accountId){
	//判断是否存在相应的tab，存在则直接跳转过去
	cardUtil.closeCard("客户详情-" + accountId);
    cardUtil.openCard("客户详情-" + accountId,"/mallCustomer/preDetail?accountId="+accountId+"&menuType="+_menuType);
    cardUtil.changeCard("客户详情-" + accountId);
}

function openDemandTab(userName){
	//判断是否存在相应的tab，存在则直接跳转过去
	cardUtil.closeCard("询价单");
    cardUtil.openCard("询价单","/mallOrder/api/mallInquiry/preMallInquiryOrderList?userName="+userName);
    cardUtil.changeCard("询价单");
}

function searchCustomer(){
	var dateStr=$("#date-range0").val();
	var mainObject=$('#mainObjectOption').find("option:selected").val();
	var accountName=$('#accountName').val();
	var accountResource = $('#statusSelect2 #status_hidden').val();
	var accountStatus = $('#statusSelect3 #status_hidden').val();
	
	var registerType = $('#registerType #status_hidden').val();
	var accountId = $('#accountId #status_hidden').val();
	var hasInviter = $('#hasInviter').find("option:selected").val();
	
    var accountManagerName=$('#accountManagerName').val();
    var createUser=$('#createUser').val();
    var linkPhone=$('#linkPhone').val();
	var param={};
	param.mainObject=mainObject;
	param.accountName=accountName;
	param.accountResource=accountResource;
	param.accountStatus=accountStatus;
	param.province=_province;
	param.city=_city;
	param.accountManagerName=accountManagerName;
	param.createUser=createUser;
	param.linkPhone=linkPhone;
	param.dateStr=dateStr;
	param.currentPageIndex=1;
	param.registerType=registerType;
	param.accountId=accountId;
	param.hasInviter=hasInviter;
	var menuType=isExitsVariable(_menuType);
	if(menuType!=""){
		param.menuType=menuType;
	}
	var signedType=isExitsVariable(_signedType);
	if(signedType!=""){
		param.signedType=signedType;
	}
	loadMallCustomerList(param);
	seletedItems="";
}

function addCustomer(){
	//调用新增接口
	postUtil.submit("/systemAccount/preModify");
}

function transmitCustomer(){
	var accountIds="";
	 $("input[type=checkbox][name=single]:checked").each(function(index,item){
		 accountIds+=($(item).attr("accountId")+",");
	 })
	if(accountIds==""){
		layer.msg("请至少选择一条记录!");
		return;
	}
	//调用转交接口
	  layer.open({
          title: '客户转交',
          area: '830px',
          type: 2,
          content: '/mallCustomer/preTransmitRecord?accountIds='+accountIds
      }) 
}

function exportCustomer(){
	var dateStr=$("#date-range0").val();
	var mainObject=$('#mainObjectOption').find("option:selected").val();
	var accountName=$('#accountName').val();
	var accountResource = $('#statusSelect2 #status_hidden').val();
	var accountStatus = $('#statusSelect3 #status_hidden').val();
    var accountManagerName=$('#accountManagerName').val();
    var createUser=$('#createUser').val();
    var linkPhone=$('#linkPhone').val();
	var registerType = $('#registerType #status_hidden').val();
	var accountId = $('#accountId #status_hidden').val();
	var hasInviter = $('#hasInviter').find("option:selected").val();
	
	var param={};
	if(seletedItems.length<=0){
		param.mainObject=mainObject;
		param.accountName=accountName;
		param.accountResource=accountResource;
		param.accountStatus=accountStatus;
		param.province=_province;
		param.city=_city;
		param.accountManagerName=accountManagerName;
		param.createUser=createUser;
		param.linkPhone=linkPhone;
		param.dateStr=dateStr;
		param.currentPageIndex=1;
		
		param.registerType=registerType;
		param.accountId=accountId;
		param.hasInviter=hasInviter;
		var menuType=isExitsVariable(_menuType);
		if(menuType!=""){
			param.menuType=menuType;
		}
	}else{
		param.seletedItems=seletedItems;
	}
	postUtil.submit("/mallCustomer/exportExcel",param);
}

function saveTransmitRecordCallback(){
	searchCustomer();
	return true;
}

$(document).on("click","input[name=single]",function(){
	var obj=$(this).attr("accountId");
	if($(this).prop("checked")){
		if(seletedItems.indexOf(obj)<0){
			seletedItems+=(obj+",");
		}
	}else{
		seletedItems=seletedItems.replace((obj+","),"");
	}
})

function moveIntoCustomer(){
	var accountIds="";
	var isLegal=false;
	 $("input[type=checkbox][name=single]:checked").each(function(index,item){
		 var accountStatus=$(item).attr("accountStatus");
		 accountIds+=($(item).attr("accountId")+",");
		 if(accountStatus==""||accountStatus=="SIGNED"){
			 isLegal=true;
		 }
	 })
	if(accountIds==""){
		layer.msg("请至少选择一条记录!");
		return;
	}
	 if(!isLegal){
		 var param={};
		 param.accountIds=accountIds;
		 postUtil.call("/mallCustomer/doMoveInto",param,function(result){
				 layer.msg(result.msg);
				 searchCustomer();
		 });
	 }else{
		 layer.msg("所选记录存在客户状态为空或已签约客户!");
	 }
}
function moveOut(){
	var accountIds="";
	 $("input[type=checkbox][name=single]:checked").each(function(index,item){
		 var accountStatus=$(item).attr("accountStatus");
		 accountIds+=($(item).attr("accountId")+",");
	 })
	if(accountIds==""){
		layer.msg("请至少选择一条记录!");
		return;
	}
	 var param={};
	 param.accountIds=accountIds;
	 postUtil.call("/mallCustomer/doMoveOut",param,function(result){
			 layer.msg(result.msg);
			 searchCustomer();
			 $("input[type=checkbox]:checked").prop("checked",false);
	 });
}
