var _orderSalesIds = "";

function searchForDATA(){
	searchDATA();
	_orderSalesIds = "";
	$('#tongji').empty();
}
function searchDATA() {
	var param = {};
	param.currentPageIndex = _currentPageIndex;
	var status = $('#status_hidden').val();
	var accountName = $('#accountName').val();
	var orderSalesIdTemp = $('#orderSalesId').html();
	var areaId = $("#area").find("option:selected").val();
	var date = $('#date-range0').val();
	var contractId = $('#contractId').val();
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
	param.areaId = areaId;
	param.pageNumber = _currentPageIndex;
    param.contractId = contractId;
	
	var orderSalesIdArray = orderSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
	var orderSalesId='';
	for(var i=0;i<orderSalesIdArray.length;i++){
		orderSalesId+=orderSalesIdArray[i]+';';
	}
	param.orderSalesId = orderSalesId;
	
	var orderSource = $("#orderSource").val();
	param.orderSource = orderSource;
	loadDATA(param);
}

function getThisWeekBiginToToday() {
	var searchDate = {};
	var now = new Date(); // 当前日期
	var nowDayOfWeek = now.getDay()-1; // 今天本周的第几天
	var nowDay = now.getDate(); // 当前日
	var nowMonth = now.getMonth(); // 当前月
	var nowYear = now.getFullYear(); // 当前年
	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); // 获得本周的开端日期
	// var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 -
	// nowDayOfWeek));// 获得本周的停止日期
	var weekEndDate = new Date();// 获得本周的停止日期
	searchDate.fromDate = formatDate(weekStartDate);
	searchDate.toDate = formatDate(weekEndDate);
//	SEARCHDATE.FROMDATE = WEEKSTARTDATE;
//	SEARCHDATE.TODATE = WEEKENDDATE;
	return searchDate;
}

// 格局化日期：yyyy-MM-dd
function formatDate(date) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	return (myyear + "-" + mymonth + "-" + myweekday);
}

function loadDATA(param) {
	layer.load();
	postUtil.call("/order/getorderlist", param, function(result) {
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
		layer.closeAll("loading");
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
			if(_orderSalesIds.indexOf(data.orderSalesId)>=0){
				html += '   <td><input type="checkbox" checked name="primary" value="'
					+ data.orderSalesId + '"></td>';
			}else{
				html += '   <td><input type="checkbox"  name="primary" value="'
						+ data.orderSalesId + '"></td>';
			}
//			html += '   <td><input type="checkbox" name="primary" value="'
//					+ data.orderSalesId + '"></td>';
			html += '   <td><p><a href="javascript:openDetailTab(\''
					+ data.orderSalesId + '\')">'
					+ isExitsVariable(data.orderSalesId)
					+ '</p></a><p style="color:#999999">'
					+ isExitsVariable(data.createDateDisplay) + '</p>';
			if(data.orderSalesSource && data.orderSalesSource=='ORDER_SALES_FROM_SHOP'){
				//html+= '<p style="color:#999999">'+isExitsVariable(data.orderId)+'</p>';
				html+= '<p style="color:#999999">商城订单驱动</p>';
			}else if(data.orderSalesSource && data.orderSalesSource=='ORDER_SALES_FROM_ORDERPLATFORM'){
				html+= '<p style="color:#999999">分销商手动创建</p>';
			}
			html += '</td>'
					+ '   <td>'
					+ isExitsVariable(data.orderSalesContractId) + '</td>'
					+ '   <td>' + isExitsVariable(data.accountAreaName)
					+ '</td>' + '   <td>'
					+ isExitsVariable(data.purchaseAccountName) + '</td>'
					+ '   <td>'
					+ isExitsVariable(data.settlementAmount.toFixed(2))
					+ '</td>' + '   <td><p>' + isExitsVariable(data.consignee)
					+ '</p><p>' + isExitsVariable(provinceCity) + '</p></td>'
					+ '   <td>' ;
			        var status=isExitsVariable(data.status);
			   		 if(status!='--'&&'PAYMENT_CONFIRM'==status){
						 html+= ( '<p class="c-f">'+isExitsVariable(data.statusCname)+'</p>');
			 			html+= ( '<p><div class="inline colockbox" startTime="'+new Date(data.updateDate)+'" currentTime="'+new Date(data.currentTime)+'">	'+	
			 	                 ' <span class="counterDesc c-9 ml5">还剩</span>'+
			 	                 ' <span class="day c-f fw-b">00</span>'+
			 	                 ' <span class="c-9">天</span>'+
			 	                 ' <span class="hour c-f fw-b">00</span>'+
			 	                 ' <span class="c-9">小时</span>'+
			 	                 ' <span class="minute c-f fw-b">00</span>'+
			 	                  '<span class="c-9">分</span>'+
			 	                  '<span class="second c-f fw-b">00</span>'+
			 	                  '<span class="c-9">秒</span>'+
			 	                  '</div></p>');
					 }else{
						html+=( '<p class="c-f">'+isExitsVariable(data.statusCname)+'</p>');
					 }
					
			   		html+='</td>'
					+ '   <td>' + isExitsVariable(data.payMentStatusName)
					+ '</td>' + '  <td><p><a href="javascript:openDetailTab(\''
					+ data.orderSalesId + '\')">订单详情'
					+ '</p><p><a href="javascript:openDeliveryDetailTab(\''
					+ data.orderSalesId + '\')">发货详情' + '</p></a></td>'
					+ '  </tr>';
		}
	} else {
		html += '<tr>' + '<td  colspan="11" height="50px"  align="center">'
				+ '<span class="fz16">暂无相关信息</span> ' + '</td>' + '</tr>';
	}
	$(".layui-table tbody").html(html);
	
	$.each($('.colockbox'), function(n, item){
   		var startTime = $(item).attr("startTime");
   		var currentTime = $(item).attr("currentTime");
   		var tmpTime = Date.parse(startTime.replace(/-/g,"/"));
   		var tmpCurrentTime = Date.parse(currentTime.replace(/-/g,"/"));
   		countDown(new Date(tmpTime).getTime()+(24*3600*1000),new Date(tmpCurrentTime).getTime(),$(item));
   	});
	
	
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
		if(_orderSalesIds.indexOf(obj)<0){
			_orderSalesIds+=(obj+";");
		}
	}else{
		_orderSalesIds=_orderSalesIds.replace((obj+";"),"");
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

function openDetailTab(orderSalesId) {
	// 判断是否存在相应的tab，存在则直接跳转过去
	cardUtil.closeCard("订单详情-" + orderSalesId);
	cardUtil.openCard("订单详情-" + orderSalesId,
			"/order/detail/principal?orderSalesId=" + orderSalesId);
	cardUtil.changeCard("订单详情-" + orderSalesId);
}

function openDeliveryDetailTab(orderSalesId) {
	cardUtil.closeCard("发货详情-" + orderSalesId);
	cardUtil.openCard("发货详情-" + orderSalesId, "/orderLog/page4S?orderSalesId="
			+ orderSalesId);
	cardUtil.changeCard("发货详情-" + orderSalesId);
}

function exportOrderSalesList() {
	var param = {};
	// var orderSalesIds = "";
//	$("input[type=checkbox][name=primary]:checked").each(function(index, item) {
//		orderSalesIds += ($(item).val() + ";");
//	})
	
	if (_orderSalesIds == "") {
		var orderSalesIdTemp = $('#orderSalesId').html();
		var status = $('#status_hidden').val();
		var accountName = $('#accountName').val();
		var areaId = $("#area").find("option:selected").val();
		var date = $('#date-range0').val();
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
//			param.fromDate = $("#fromDateByDay").val();
//			param.toDate = $("#toDateByDay").val();
			param.fromDate = dateStr[0];
			param.toDate = dateStr[1];
		}
		param.status = status;
		param.accountName = accountName;
		param.areaId = areaId;
		
		var skuIdTemp = $("#skuId").html();
		var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var skuId='';
		for(var i=0;i<skuIdArray.length;i++){
			skuId+=skuIdArray[i]+';';
		}
		param.skuId = skuId;
		
		var orderSalesIdArray = orderSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var orderSalesId='';
		for(var i=0;i<orderSalesIdArray.length;i++){
			orderSalesId+=orderSalesIdArray[i]+';';
		}
		param.orderSalesId = orderSalesId;
	}else{
		param.orderSalesIds = _orderSalesIds;
	}
	postUtil.submit("/order/exportExcel", param);
	// 调用转交接口
}
function exportOrderSalesDetail() {
	var param = {};
	// var orderSalesIds = "";
//	$("input[type=checkbox][name=primary]:checked").each(function(index, item) {
//		orderSalesIds += ($(item).val() + ";");
//	})
	
	if (_orderSalesIds == "") {
		var orderSalesIdTemp = $('#orderSalesId').html();
		var status = $('#status_hidden').val();
		var accountName = $('#accountName').val();
		var areaId = $("#area").find("option:selected").val();
		var date = $('#date-range0').val();
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
//			param.fromDate = $("#fromDateByDay").val();
//			param.toDate = $("#toDateByDay").val();
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
		param.areaId = areaId;
		var orderSalesIdArray = orderSalesIdTemp.split(/[;；,，\n <br>&nbsp]/);
		var orderSalesId='';
		for(var i=0;i<orderSalesIdArray.length;i++){
			orderSalesId+=orderSalesIdArray[i]+';';
		}
		param.orderSalesId = orderSalesId;
	}else{
		param.orderSalesIds = _orderSalesIds;
	}
	postUtil.submit("/order/exportDetailExcel", param);
	// 调用转交接口
}


function sumForData() {
	var param = {};
//	var orderSalesIds = "";
//	$("input[type=checkbox][name=primary]:checked").each(function(index, item) {
//		orderSalesIds += ($(item).val() + ";");
//	})
//	param.orderSalesIds = _orderSalesIds;
	if (_orderSalesIds == "") {
		var orderSalesId = $('#orderSalesId').html();
		var status = $('#status_hidden').val();
		var accountName = $('#accountName').val();
		var areaId = $("#area").find("option:selected").val();
		var date = $('#date-range0').val();
		if(date!=null&&date!=""){
			var dateStr = date.split(' to ');
//			param.fromDate = $("#fromDateByDay").val();
//			param.toDate = $("#toDateByDay").val();
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
		param.areaId = areaId;
		param.orderSalesId = orderSalesId;
	}else{
		param.orderSalesIds = _orderSalesIds;
	}
    postUtil.call("/order/sumForData", param, function(result) {
        if (result.STATUS == "SUCCESS") {
            var data = result.DATA;
            $('#tongji').html('<p>订单笔数：<span class="c-f mr5">' + data.orderNum + '</span> 笔；总金额：<span class="c-f mr5">'+ data.sumForAll.toFixed(2) +'</span>元；客户数：<span class="c-f mr5">'+data.acountNum+'</span>个</p>');
        } else {
            layer.msg(result.MSG, {
                icon : 5
            });
        }
    });
	// 调用转交接口
	// layer.open({
	// 	title : '订单信息统计',
	// 	skin : 'msgskin',
	// 	area : [ '830px', '150px' ],
	// 	type : 2,
	// 	btnAlign : 'c',
	// 	content : [
	// 			'/order/preSumForData?orderSalesIds=' + _orderSalesIds
	// 					+ '&fromDate=' + param.fromDate + '&toDate='
	// 					+ param.toDate + '&status=' + param.status
	// 					+ '&accountName=' + param.accountName + '&areaId='
	// 					+ param.areaId, 'no' ],
	// })

}
