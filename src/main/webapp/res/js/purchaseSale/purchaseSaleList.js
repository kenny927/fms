var _orderPurchaseIds = "";

function searchForDATA() {
	searchDATA();
	_orderPurchaseIds = "";
	$('#tongji').empty();
}
function searchDATA() {
	var param = {};
	param.currentPageIndex = _currentPageIndex;
	var status = $('#status_hidden').val();
	var accountName = $('#accountName').val();
	var customerAccountName = $('#customerAccountName').val();
	var purchaseSalesIdTemp = $('#purchaseSalesId').html();
	var orderPurchaseContractId = $('#orderPurchaseContractId').val();
	
	var date = $('#date-range0').val();
	if(date!=null&&date!=""){
		var dateStr = date.split(' to ');
		param.fromDate = dateStr[0];
		param.toDate = dateStr[1];
	}
	
	var skuIdTemp = $("#skuId").html();
	var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
	var skuId='';
	for(var i=0;i<skuIdArray.length;i++){
		skuId+=skuIdArray[i]+';';
	}
	param.skuId = skuId;
	
	var purchaseSalesIdArray = purchaseSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
	var purchaseSalesId='';
	for(var i=0;i<purchaseSalesIdArray.length;i++){
		purchaseSalesId+=purchaseSalesIdArray[i]+';';
	}
	
	param.status = status;
	param.accountName = accountName;
	param.customerAccountName = customerAccountName;
	param.pageNumber = _currentPageIndex;
	param.purchaseSalesId = purchaseSalesId;
	param.orderPurchaseContractId = orderPurchaseContractId;
	loadDATA(param);
}

function loadDATA(param) {
	// layer.load();
	postUtil.call("/order/purchaseSale/getpurchaselist", param,
			function(result) {
				if (result.STATUS == "SUCCESS") {
					_currentPageIndex = pageNumber;
					var data = result.DATA;
					var pageNumber = data.pageNumber;
					var pageSize = data.pageSize;
					var totalPage = data.totalPage;
					var totalRow = data.totalRow;
					var dataList = data.list;
					renderTable(dataList);
					laypage({
						cont : 'paginationDiv',
						pages : totalPage,
						curr : pageNumber,
						total : totalRow,
						skip : true,
						jump : function(obj, first) {
							if (!first) {
								_currentPageIndex = obj.curr;
								searchDATA();
							}
						}
					});
				} else {
					layer.msg(result.MSG, {
						icon : 5
					});
				}
				// layer.closeAll("loading");
			});

}

function renderTable(dataList) {
	var html = "";
	var length = dataList.length;
	if (length > 0) {
		for (var i1 = 0; i1 < dataList.length; i1++) {
			var data = dataList[i1];
			var address = data.consigneeAddress;
			var addressTemp = address.split(' ');
			var provinceCity = null;
			if (addressTemp[0] == addressTemp[1]) {
				provinceCity = addressTemp[0];
			} else {
				provinceCity = addressTemp[0] + addressTemp[1];
			}

			html += '  <tr>';
			if(_orderPurchaseIds.indexOf(data.orderPurchaseId)>=0){
				html += '   <td><input type="checkbox" checked name="primary" value="'
					+ data.orderPurchaseId + '"></td>';
			}else{
				html += '   <td><input type="checkbox" name="primary" value="'
					+ data.orderPurchaseId + '"></td>';
			}

			html += '   <td><p><a href="javascript:openDetailTab(\''
					+ data.orderPurchaseId + '\')">'
					+ isExitsVariable(data.orderPurchaseId)
					+ '</p></a><p style="color:#999999">'
					+ isExitsVariable(data.createDateDisplay) + '</p></td>'
					+ '<td>' + isExitsVariable(data.orderPurchaseContractId)
					+ '</td>' + '   <td>' + isExitsVariable(data.accountName)
					+ '</td>' + '   <td><p>'
					+ isExitsVariable(data.customerAccountName) + '</p><p>'
					+ isExitsVariable(data.orderSalesId) + '</p></td>'
					+ '   <td>'
					+ isExitsVariable(data.settlementAmount.toFixed(2))
					+ '</td>' + '   <td><p>' + isExitsVariable(data.consignee)
					+ '</p><p>' + isExitsVariable(provinceCity) + '</p></td>'
					+ '   <td>' + isExitsVariable(data.purchaseStatusName)
					+ '</td>' + '  <td><p><a href="javascript:openDetailTab(\''
					+ data.orderPurchaseId + '\')">订单详情'
					+ '</p><p><a href="javascript:openDeliveryDetailTab(\''
					+ data.orderPurchaseId + '\')">发货详情' + '</p></a></td>'
					+ '  </tr>'
		}
	} else {
		html += '<tr>' + '<td  colspan="10" height="50px"  align="center">'
				+ '<span class="fz16">暂无相关信息</span> ' + '</td>' + '</tr>'
	}
	$(".layui-table tbody").html(html);
	
	var checkedLength = $("input[type=checkbox][name=primary]:checked").length;
	var tableLength=$(".layui-table tbody tr").length;
	if(checkedLength==tableLength){
		$("input[name=allChoose]").prop("checked", true);
	}else{
		$("input[name=allChoose]").prop("checked", false);
	}

}

$(document).on("click","input[name=primary]",function(){
	var obj=$(this).val();
	if($(this).prop("checked")){
		if(_orderPurchaseIds.indexOf(obj)<0){
			_orderPurchaseIds+=(obj+";");
		}
	}else{
		_orderPurchaseIds=_orderPurchaseIds.replace((obj+";"),"");
	}
	
	var checkedLength = $("input[type=checkbox][name=primary]:checked").length;
	var tableLength=$(".layui-table tbody tr").length;
	if(checkedLength==tableLength){
		$("input[name=allChoose]").prop("checked", true);
	}else{
		$("input[name=allChoose]").prop("checked", false);
	}
})

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

function openDetailTab(orderPurchaseId) {
	// 判断是否存在相应的tab，存在则直接跳转过去
	cardUtil.closeCard("订单详情-" + orderPurchaseId);
	cardUtil.openCard("订单详情-" + orderPurchaseId,
			"/orderPurchase/orderPurchaseDetail?orderPurchaseId="
					+ orderPurchaseId);
	cardUtil.changeCard("订单详情-" + orderPurchaseId);
}

function openDeliveryDetailTab(orderPurchaseId) {
	cardUtil.closeCard("发货详情-" + orderPurchaseId);
	cardUtil.openCard("发货详情-" + orderPurchaseId,
			"/orderLog/page4P?orderPurchaseId=" + orderPurchaseId);
	cardUtil.changeCard("发货详情-" + orderPurchaseId);
}

function exportPurchaseSalesList() {
	var param = {};
	if (_orderPurchaseIds == "") {
		var status = $('#status_hidden').val();
		var accountName = $('#accountName').val();
		var customerAccountName = $('#customerAccountName').val();
		var purchaseSalesIdTemp = $('#purchaseSalesId').html();
		var date = $('#date-range0').val();
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
			param.fromDate = dateStr[0];
			param.toDate = dateStr[1];
		}
		param.skuId = $("#skuId").html();
		param.status = status;
		param.accountName = accountName;
		param.customerAccountName = customerAccountName;
		
		var purchaseSalesIdArray = purchaseSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var purchaseSalesId='';
		for(var i=0;i<purchaseSalesIdArray.length;i++){
			purchaseSalesId+=purchaseSalesIdArray[i]+';';
		}
		
		param.purchaseSalesId = purchaseSalesId;
	}else{
		param.orderPurchaseIds = _orderPurchaseIds;
	}
	postUtil.submit("/order/purchaseSale/exportExcel", param);
	// 调用转交接口
}

function exportPurchaseSalesDesc() {
	var param = {};
	if (_orderPurchaseIds == "") {
		var status = $('#status_hidden').val();//状态
		var accountName = $('#accountName').val();//供应商
		var customerAccountName = $('#customerAccountName').val();//关联客户
		var purchaseSalesIdTemp = $('#purchaseSalesId').html();
		var date = $('#date-range0').val();//创建时间
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
			param.fromDate = dateStr[0];
			param.toDate = dateStr[1];
		}
		
		var skuIdTemp = $("#skuId").html();
		var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var skuId='';
		for(var i=0;i<skuIdArray.length;i++){
			skuId+=skuIdArray[i]+';';
		}
		param.skuId = skuId;
		
		param.status = status;
		param.accountName = accountName;
		param.customerAccountName = customerAccountName;
		var purchaseSalesIdArray = purchaseSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var purchaseSalesId='';
		for(var i=0;i<purchaseSalesIdArray.length;i++){
			purchaseSalesId+=purchaseSalesIdArray[i]+';';
		}
		
		param.purchaseSalesId = purchaseSalesId;
	}else{
		param.orderPurchaseIds = _orderPurchaseIds;
	}
	postUtil.submit("/order/purchaseSale/exportPurchaseSalesDesc", param);
	// 调用转交接口
}

function sumForData() {
	var param = {};
	if (_orderPurchaseIds == "") {
		var status = $('#status_hidden').val();
		var accountName = $('#accountName').val();
		var customerAccountName = $('#customerAccountName').val();
		var purchaseSalesIdTemp = $('#purchaseSalesId').html();
		var date = $('#date-range0').val();
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
			param.fromDate = dateStr[0];
			param.toDate = dateStr[1];
		}
		var skuIdTemp = $("#skuId").html();
		var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var skuId='';
		for(var i=0;i<skuIdArray.length;i++){
			skuId+=skuIdArray[i]+';';
		}
		param.skuId = skuId;
		
		param.status = status;
		param.accountName = accountName;
		param.customerAccountName = customerAccountName;
		
		var purchaseSalesIdArray = purchaseSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var purchaseSalesId='';
		for(var i=0;i<purchaseSalesIdArray.length;i++){
			purchaseSalesId+=purchaseSalesIdArray[i]+';';
		}
		
		param.purchaseSalesId = purchaseSalesId;
	}else{
		param.orderPurchaseIds = _orderPurchaseIds;
    }
    postUtil.call("/order/purchaseSale/sumForData", param, function(result) {
        if (result.STATUS == "SUCCESS") {
            var data = result.DATA;
            $('#tongji').html('<p>采购单笔数：<span class="c-f mr5">'+data.purchaseNum+'</span> 笔；总金额：<span class="c-f mr5">'+ data.sumForAll.toFixed(2) +'</span>元；供应商数：<span class="c-f mr5">'+data.acountNum+'</span>个</p>');
        } else {
            layer.msg(result.MSG, {
                icon : 5
            });
        }
    });
	// layer.open({
	// 	title : '采购单信息统计',
	// 	skin : 'msgskin',
	// 	area : [ '830px', '150px' ],
	// 	type : 2,
	// 	btnAlign : 'c',
	// 	content : [
	// 			'/order/purchaseSale/preSumForData?orderPurchaseIds='
	// 					+ _orderPurchaseIds + '&customerAccountName='
	// 					+ param.customerAccountName + '&status=' + param.status
	// 					+ '&accountName=' + param.accountName, 'no' ],
	// })

}
