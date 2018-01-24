
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
	var param={};
	param.currentPageIndex=1;
	param.accountId=_accountId;
	loadMallCustomer(param);
	loadLinkmanlist(param);
	loadAuthorizeUser(param);
	loadCustomerSalesOpportunity(param);
	loadCustomerVisitingRecord(param);
	loadMallInquireOrderlist(param);
	loadMallOrderlist(param);
	loadOrderProjectlist(param);
loadCustomerTransmitRecord(param);
	
}); 


function loadMallCustomer(param) {
    postUtil.call("/mallCustomer/detail", param, function (result) {
    	generateHeader(result.customerMap);
 });
}

function generateHeader(customerMap){
	var html="";
    var accountIntroduce="";
    var accountNameHeader='';
    if(customerMap!=null){
    	_accountManageName=isExitsVariable(customerMap.accountManagerName);
    	accountNameHeader=isExitsVariable(customerMap.accountName)+'<span class="fz12">（'+isExitsVariable(customerMap.accountManagerName)+'）</span>';
    	accountIntroduce=isExitsVariable(customerMap.accountIntroduce);
	   	 html+=' <div>社会信用代码： <span class="c-2">'+isExitsVariable(customerMap.inteSocialCreditNo)+'</span></div>'+
		     '<div class="flex">'+
		     ' <span style="flex: 1">客户状态：<span class="c-2">'+isExitsVariable(customerMap.accountStatusCname)+'</span></span>'+
		     ' <span style="flex: 1">座机：<span class="c-2">'+isExitsVariable(customerMap.telephone)+'</span></span>'+
		     ' </div>'+
		     ' <div class="flex">'+
		     '  <span style="flex: 1">邮箱：<span class="c-2">'+isExitsVariable(customerMap.email)+'</span></span>'+
		     '  <span style="flex: 1">客户来源：<span class="c-2">'+isExitsVariable(customerMap.accountResourceCname)+'</span></span>'+
		     ' </div>'+
		     '<div>地址：<span class="c-2">'+isExitsVariable(customerMap.province)+isExitsVariable(customerMap.city)+'&nbsp;&nbsp;&nbsp;'+isExitsVariable(customerMap.address)+'</span></div>'
    }else{
	   	 html+=' <div>社会信用代码： <span class="c-2"></span></div>'+
		     '<div class="flex">'+
		     ' <span style="flex: 1">客户状态：<span class="c-2"></span></span>'+
		     ' <span style="flex: 1">座机：<span class="c-2"></span></span>'+
		     ' </div>'+
		     ' <div class="flex">'+
		     '  <span style="flex: 1">邮箱：<span class="c-2"></span></span>'+
		     '  <span style="flex: 1">客户来源：<span class="c-2"></span></span>'+
		     ' </div>'+
		     '<div>地址：<span class="c-2"></span></div>'
    }
    
     $(".accountNameHeader").html(accountNameHeader);
	 $(".customerBase").html(html);
	 $(".accountIntroduceContent").text(accountIntroduce);
}

//联系人
function loadLinkmanlist(param){
	postUtil.call("/mallCustomer/loadLinkmanlist", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderlinkmanlist(dataList);
	        laypage({
	            cont: 'paginationDivLinkman',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadLinkmanlist(param);
	                }
	            }
	        });
	})
}

//加载商城账号
function loadAuthorizeUser(param){
	postUtil.call("/mallCustomer/loadAuthorizeUser", param, function (result) {
	     renderAuthorizeUse(result);
	})
}


//销售机会
function loadCustomerSalesOpportunity(param){
	postUtil.call("/mallCustomer/loadCustomerSalesOpportunity", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderCustomerSalesOpportunity(dataList);
	        laypage({
	            cont: 'paginationDivCustomerSalesOpportunity',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadCustomerSalesOpportunity(param);
	                }
	            }
	        });
	})
}
//拜访记录
function loadCustomerVisitingRecord(param){
	postUtil.call("/mallCustomer/loadCustomerVisitingRecord", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderCustomerVisitingRecord(dataList);
	        laypage({
	            cont: 'paginationDivCustomerVisitingRecord',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadCustomerVisitingRecord(param);
	                }
	            }
	        });
	})
}

//客户询单
function loadMallInquireOrderlist(param){
	postUtil.call("/mallCustomer/loadMallInquireOrderlist", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderMallInquireOrderlist(dataList);
	        laypage({
	            cont: 'paginationDivMallInquireOrderList',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadMallInquireOrderlist(param);
	                }
	            }
	        });
	})
}
//客户订单
function loadMallOrderlist(param){
	postUtil.call("/mallCustomer/loadMallOrderlist", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderMallOrderlist(dataList);
	        laypage({
	            cont: 'paginationDivMallOrder',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadMallOrderlist(param);
	                }
	            }
	        });
	})
}

//项目列表

function loadOrderProjectlist(param){
	postUtil.call("/mallCustomer/loadOrderProjectlist", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderOrderProjectlist(dataList);
	        laypage({
	            cont: 'paginationDivOrderProject',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadOrderProjectlist(param);
	                }
	            }
	        });
	})
}


//客户流转
function loadCustomerTransmitRecord(param){
	postUtil.call("/mallCustomer/loadCustomerTransmitRecord", param, function (result) {
		 var pageNumber = result.pageNumber;
	     var pageSize = result.pageSize;
	     var totalPage = result.totalPage;
	     var totalRow = result.totalRow;
	     var dataList = result.list;
	     renderCustomerTransmitRecord(dataList);
	        laypage({
	            cont: 'paginationDivCustomerTransmitRecord',
	            pages: totalPage,
	            curr: pageNumber,
	            total: totalRow,
	            skip: true,
	            jump: function (obj, first) {
	                if (!first) {
	                	param.currentPageIndex=obj.curr;
	                	loadCustomerTransmitRecord(param);
	                }
	            }
	        });
	})
}

function renderlinkmanlist(systemAccountLinkmanlist){
	var html="";
    var length = systemAccountLinkmanlist.length;
    if (systemAccountLinkmanlist!=null&&systemAccountLinkmanlist.length >= 1) {
        for (var i1 = 0; i1 < systemAccountLinkmanlist.length; i1++) {
            var data = systemAccountLinkmanlist[i1]; 
            var isPrimary=isExitsVariable(data.isPrimary);
            var existAuthorizeUser=isExitsVariable(data.existAuthorizeUser);
            if(isPrimary!=null&&"Y"==isPrimary){
            	html+=' <tr>'+
            	'<td style="color:red"><input type="radio" name="linkmanIdSel" value="'+data.linkmanId+'" isPrimary="'+isPrimary+'" linkmanTelephone="'+data.linkmanTelephone+'"></td>'+
            	'<td style="color:red">'+isExitsVariable(data.createTime)+'</td>'+
	            '<td style="color:red">'+isExitsVariable(data.department)+'</td>'+
	            '<td style="color:red">'+isExitsVariable(data.linkmanPosition)+'</td>'+
            	'<td style="color:red">'+isExitsVariable(data.linkmanName)+'</td>';
                  if(existAuthorizeUser!=null&&"Y"==existAuthorizeUser){
					  if(isExitsVariable(data.linkmanTelephone) != "") {
                          html+= '<td style="color:red">'+isExitsVariable(data.linkmanTelephone)+'<font class="c-f">(会员)<font>'+'</td>';
                      } else {
                          html+= '<td></td>';
					  }
                  }else{
                	  html+= '<td style="color:red">'+isExitsVariable(data.linkmanTelephone)+'</td>';
                  }
				html+= '<td style="color:red">'+isExitsVariable(data.linkmanFixedTelephone)+'</td>';
                html+= '<td style="color:red">'+isExitsVariable(data.email)+'</td>';
            	if(_addSystemAccountLinkmanBtn=="true"){
	            	 html+= '<td><a href="javascript:;" class="c-h cs-p" onclick="updatelinkman('+data.linkmanId+')">修改</a></td>';
	             }else{
	            	 html+= '<td></td>';
	             }
	             html+='</tr>'
            }else{
            	html+=' <tr>'+
            	'<td><input type="radio" name="linkmanIdSel" value="'+data.linkmanId+'" isPrimary="'+isPrimary+'" linkmanTelephone="'+data.linkmanTelephone+'"></td>'+
	            '<td>'+isExitsVariable(data.createTime)+'</td>'+
	            '<td>'+isExitsVariable(data.department)+'</td>'+
	            '<td>'+isExitsVariable(data.linkmanPosition)+'</td>'+
	            '<td>'+isExitsVariable(data.linkmanName)+'</td>';
	            if(existAuthorizeUser!=null&&"Y"==existAuthorizeUser){
	            	if(isExitsVariable(data.linkmanTelephone) != "") {
                        html+= '<td>'+isExitsVariable(data.linkmanTelephone)+'<font class="c-f">(会员)<font>'+'</td>';
                    } else {
                        html+= '<td></td>';
					}
                }else{
              	  html+= '<td>'+isExitsVariable(data.linkmanTelephone)+'</td>';
                }
				html+= '<td>'+isExitsVariable(data.linkmanFixedTelephone)+'</td>';
	            html+= '<td>'+isExitsVariable(data.email)+'</td>';
            	if(_addSystemAccountLinkmanBtn=="true"){
	            	// html+= '<td><a href="javascript:;" class="c-h cs-p" onclick="updatelinkman('+data.linkmanId+')">修改</a>&nbsp;&nbsp;<a href="javascript:;" class="c-h cs-p" onclick="updatelinkmanStatus('+data.linkmanId+')">停用</a></td>';
            		 html+= '<td><a href="javascript:;" class="c-h cs-p" onclick="updatelinkman('+data.linkmanId+')">修改</a></td>';
	             }else{
	            	 html+= '<td></td>';
	             }
	         '</tr>'
            }
        }
	}else{
		html+='<tr>'+
         '<td  colspan="8" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".linkmanTable tbody").html(html);
}

function renderCustomerSalesOpportunity(customerSalesOpportunitylist){
	var html="";
	if(customerSalesOpportunitylist!=null&&customerSalesOpportunitylist.length>=1){
        for (var i1 = 0; i1 < customerSalesOpportunitylist.length; i1++) {
            var data = customerSalesOpportunitylist[i1]; 
            var stringDemand  = null;
            if(data.vagueDemandId==null||data.vagueDemandId==""){
            	stringDemand ="否";
            }else{
            	stringDemand ="是";
            }
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.createTime)+'</td>'+
	            '<td>'+isExitsVariable(data.oppTypeCname)+'</td>'+
	            '<td>'+isExitsVariable(data.levelCname)+'</td>'+
	            '<td>'+isExitsVariable(data.sourceCname)+'</td>'+
	            '<td>'+isExitsVariable(data.linkmanName)+(isExitsVariable(data.linkmanTelephone)==""?"":("("+data.linkmanTelephone+")"))+'</td>'+
	            '<td><p class="one-row" style="width:180px" title="'+isExitsVariable(data.remark)+'">'+isExitsVariable(data.remark)+'</p></td>'+
	            '<td>'+isExitsVariable(data.createUserName)+'</td>'+
	            '<td>'+isExitsVariable(stringDemand)+'</td>'+
	           // '<td>'+isExitsVariable(data.acceptUserName)+'</td>'+
	            '<td><a href="javascript:;" class="c-h cs-p" onclick="customerSalesOppDetail('+data.customerSalesOppId+')">查看</a></td>'+
	            '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="9" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".customerSalesOpportunityTable tbody").html(html);
}

function renderAuthorizeUse(result){
	var html="";
	var data=result.authorizeUserMap;
	if(data!=null){
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.createTimeStr)+'</td>'+
	            '<td>'+isExitsVariable(data.userRealName)+'</td>'+
	            '<td>'+isExitsVariable(data.sexCname)+'</td>'+
	            '<td>'+isExitsVariable(data.mobile)+'</td>'+
	            '<td>'+isExitsVariable(data.email)+'</td>'+
	            '<td>'+isExitsVariable(data.registerTypeCname)+'</td>'+
	            '<td>'+isExitsVariable(data.distributorAccountName)+'</td>'+
	            '</tr>'
	}else{
		html+='<tr>'+
         '<td  colspan="6" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".authorizeTable tbody").html(html);
}


function renderCustomerVisitingRecord(customerVisitingRecordlist){
	var html="";
	if(customerVisitingRecordlist!=null&&customerVisitingRecordlist.length>=1){
        for (var i1 = 0; i1 < customerVisitingRecordlist.length; i1++) {
            var data = customerVisitingRecordlist[i1]; 
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.visitTime)+'</td>'+
	            '<td>'+isExitsVariable(data.visitType)+'</td>'+
	            '<td>'+isExitsVariable(data.linkmanName)+isExitsVariable(data.linkmanTelephone)+'</td>'+
	            '<td>'+isExitsVariable(data.linkmanPosition)+'</td>'+
	            '<td>'+isExitsVariable(data.content)+'</td>'+
	            '<td>'+isExitsVariable(data.userName)+'</td>';
	            if(_insertVisitRecord=="true"){
	            	html+=  '<td><a class="c-h cs-p" href="javascript:updateVisitRecord(\''+_accountId+'\',\''+data.visitRecordId+'\')">修改</a></td>';
	            }else{
	            	html+= '<td></td>';
	            }
	            '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="7" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".customerVisitingRecordTable tbody").html(html);
}

function renderMallInquireOrderlist(mallInquireOrderlist){
	var html="";
    if (mallInquireOrderlist!=null&&mallInquireOrderlist.length >=1) {
        for (var i1 = 0; i1 < mallInquireOrderlist.length; i1++) {
            var data = mallInquireOrderlist[i1]; 
            var skuModelList=data.skuModelList;
			html+=' <tr>'+
	            '<td>'+isExitsVariable(moment(data.createTime).format("YYYY-MM-DD HH:mm:ss"))+'</td>'+
	            '<td><a href="javascript:openInquiryDetail(\''  + data.offerId + '\')">'+isExitsVariable(data.offerId)+'</a></td>'+
	            '<td>';
	            if(skuModelList!=null&&skuModelList.length>=1){
	            	for(var i11=0;i11<skuModelList.length;i11++){
	            		html+=('<p style="width:200px" class="one-row" title="'+isExitsVariable(skuModelList[i11])+'">'+isExitsVariable(skuModelList[i11])+'</p>');
	            	}
	            }
	            html+='</td>'+
	            '<td>'+isExitsVariable(data.inquiryOrderSourceName)+'</td>'+
	            '<td>'+isExitsVariable(data.inquiryOrderStatusName)+'</td>'+
	            '<td>'+isExitsVariable(data.accountManagerName)+'</td>'+
	         '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="6" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".mallInquireOrderListTable tbody").html(html);
}

function renderMallOrderlist(mallOrderlist){
	var html="";
    var length = mallOrderlist.length;
    if (mallOrderlist!=null&&mallOrderlist.length >=1) {
        for (var i1 = 0; i1 < mallOrderlist.length; i1++) {
            var data = mallOrderlist[i1]; 
            var totalOrderAmount=isExitsVariable(data.totalOrderAmount);
            if(totalOrderAmount!=""){
            	totalOrderAmount=parseFloat(isExitsVariable(data.totalOrderAmount)).toFixed(2);
            }
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.createTime)+'</td>'+
	            '<td><a href="javascript:openOrderDetail(\''  + data.orderId + '\')">'+isExitsVariable(data.orderId)+'</a></td>'+
	            '<td>'+isExitsVariable(data.sellerAccountAlias)+'</td>'+
	            '<td>'+totalOrderAmount+'</td>'+
	            '<td>'+isExitsVariable(data.statusCname)+'</td>'+
	         '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="5" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".mallOrderTable tbody").html(html);
}
function renderOrderProjectlist(orderProjectlist){
	var html="";
    var length = orderProjectlist.length;
    if (orderProjectlist!=null&&orderProjectlist.length >=1) {
        for (var i1 = 0; i1 < orderProjectlist.length; i1++) {
            var data = orderProjectlist[i1]; 
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.updateDate)+'</td>'+
	            '<td>'+isExitsVariable(data.projectLevel)+'</td>'+
	            '<td>'+isExitsVariable(data.projectName)+'</td>'+
	            '<td>'+isExitsVariable(data.proprietorCompanyName)+'</td>'+
	            '<td>'+isExitsVariable(data.projectProvince)+isExitsVariable(data.projectCity)+'</td>'+
	            '<td>'+isExitsVariable(data.statusCname)+'</td>'+
	         '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="6" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".orderProjectTable tbody").html(html);
}
//客户流转
function renderCustomerTransmitRecord(customerTransmitRecordlist){
	var html="";
    var length = customerTransmitRecordlist.length;
    if (customerTransmitRecordlist!=null&&customerTransmitRecordlist.length >=1) {
        for (var i1 = 0; i1 < customerTransmitRecordlist.length; i1++) {
            var data = customerTransmitRecordlist[i1]; 
			html+=' <tr>'+
	            '<td>'+isExitsVariable(data.createTime)+'</td>'+
	            '<td>'+isExitsVariable(data.userName)+'</td>'+
	            '<td>'+isExitsVariable(data.transmitTypeCname)+'</td>'+
	            '<td>'+isExitsVariable(data.content)+'</td>'+
	         '</tr>'
        }
	}else{
		html+='<tr>'+
         '<td  colspan="6" height="50px"  align="center">'+
       ' <span class="fz16">暂无相关信息</span> '+
        ' </td>'+
        ' </tr>'
	}
	$(".customerTransmitRecordTable tbody").html(html);
}


//修改联系人
function updatelinkman(linkmanId){
	layer.open({
        skin: 'msgskin',
        title: "修改联系人",
        type: 2,
        area: ['450px', '520px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/systemAccountLinkman/preEditSystemAccountLinkman?linkmanId=' + linkmanId
    });
}

function updatelinkmanStatus(linkmanId){
	var param={};
	param.linkmanId=linkmanId;
	param.effectivity='N';
	postUtil.call("/systemAccountLinkman/updateLinkmanStatus",param,function(data){
		var status=data.STATUS;
		if("SUCCESS"==status){
			layer.msg("停用成功！", {icon: 6});
			 var param={};
             param.currentPageIndex=1;
             param.accountId=_accountId;
             loadCustomerVisitingRecord(param);
             loadLinkmanlist(param);
		}else{
			layer.msg("停用失败:" + result.MSG, {icon: 5});
		}
	});
}

function customerSalesOppDetail(customerSalesOppId){
	layer.open({
        skin: 'msgskin',
        title: '销售机会详情<span class="fz12">（客户所有者：<span>'+_accountManageName+'</span>）</span>',
        type: 2,
        area: ['750px', '540px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/customer/salesOpportunity/preDetail?customerSalesOppId=' + customerSalesOppId
    });
}

function updateAccountIntroduce(){
	$('.accountIntroduceBtn').html('<span onclick="saveAccountIntroduce()">保存</span>');
	$(".accountIntroduceContent").attr("contenteditable","true");
	$("#accountIntroduceEdit").removeClass("edit_back");

}
function saveAccountIntroduce(){
	var accountIntroduce=$(".accountIntroduceContent").text();
	if(accountIntroduce!=null&&accountIntroduce!=""&&accountIntroduce.length>500){
		layer.msg("客户介绍超过长度限制！");
		return;
	}
	var param={};
	param.accountId=_accountId;
	param.accountIntroduce=accountIntroduce;
	postUtil.call("/mallCustomer/updateSystemAccount", param,function(data){
		var status=data.STATUS;
		if("SUCCESS"==status){
			$(".accountIntroduceContent").attr("contenteditable","false");
			$("#accountIntroduceEdit").addClass("edit_back");
			$('.accountIntroduceBtn').html('<span class="accountIntroduceBtn" onclick="updateAccountIntroduce()">编辑</span>');
		}
	})
	
}

function openInquiryDetail(offerId){
	cardUtil.closeCard("询单详情");
    cardUtil.openCard("询单详情-"+offerId,"/mallOrder/api/mallInquiry/preDetail?offerId="+offerId);
    cardUtil.changeCard("询单详情-"+offerId);
}

function openOrderDetail(orderId){
	cardUtil.closeCard("订单详情");
    cardUtil.openCard("订单详情-"+orderId,"/mallOrder/api/preDetail?orderId="+orderId);
    cardUtil.changeCard("订单详情-"+orderId);
}
