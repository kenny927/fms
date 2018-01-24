var html2 = "";
var param = {};
function isExitsVariable(variableName) {
	try {
		if (typeof (variableName) == "undefined") {
			return "--";
		} else {
			return variableName;
		}
	} catch (e) {
	}
	return "--";
}
var noDataTip = '<div style="height: 76px;border:1px solid #e6e6e6;margin-top:-10px;">'
		+ '  <p class="t-c fz16 c-2" style="line-height: 76px;">暂无相应信息！</p>'
		+ '</div>';
var tablehHeader = " <h3 class='bz-bb bg-f0 h3-tittle pl15 mb10 inquiry-title'>"
		+ " <span style='width:54%;'>商品信息/客户信息</span>"
		+ "  <span style='width:11%;'>收货地址</span>"
		+ "  <span style='width:10%;'>报价/回复交期</span>"
		+ "  <span style='width:11%;'>状态</span>"
		+ "  <span style='width:10%;'>操作</span>" + "  </h3>";

function countReadOrUnReadNum() {
	var countParam = {};
	countParam.mainObjectType = "ORDER";
	if (mainObjectId == "10002") {
		countParam.mainObjectType = "OTHERS";
	}
	var numCss = 'has-num';
	postUtil
			.call(
					"/mallOrder/api/orderStatusCount",
					countParam,
					function(result) {
						if (result.STATUS == "SUCCESS") {
							var data = result.DATA;
							inConformingNum = data.IN_CONFORMING;
							deliveryWaitingNum = data.DELIVERY_WAITING;
							receivingWaitingNum = data.RECEIVE_WAITING;
							completedNum = data.COMPLETED;
							closedNum = data.CLOSED;
							totalNum = data.NOREADCOUNT;
						}
						if (totalNum <= 9) {
							numCss = 'has-num';
						} else if (totalNum <= 99) {
							numCss = 'has-num1';
						} else if (totalNum <= 999) {
							numCss = 'has-num2';
						}
						if (inConformingNum > 0) {
							$(".tab-nav li[tabname=\"IN_CONFORMING_PURCHASE,IN_CONFORMING_PLATFORM,IN_CONFORMING_VENDOR\"]")
								.addClass(numCss).html(
								'待确认<i>' + inConformingNum
								+ '</i>');
						} else {
							$(".tab-nav li[tabname=\"IN_CONFORMING_PURCHASE,IN_CONFORMING_PLATFORM,IN_CONFORMING_VENDOR\"]")
								.removeClass(numCss).html('待确认');
						}
						if (deliveryWaitingNum > 0) {
							$(".tab-nav li[tabname=DELIVERY_WAITING]")
									.addClass(numCss).html(
											'待发货<i>' + deliveryWaitingNum
													+ '</i>');
						} else {
							$(".tab-nav li[tabname=DELIVERY_WAITING]")
									.removeClass(numCss).html('待发货');
						}
						if (receivingWaitingNum > 0) {
							$(".tab-nav li[tabname=RECEIVE_WAITING]").addClass(numCss).html(
									'待收货<i>' + receivingWaitingNum + '</i>');
						} else {
							$(".tab-nav li[tabname=RECEIVE_WAITING]")
									.removeClass(numCss).html('待收货');
						}
						if (completedNum > 0) {
							$(".tab-nav li[tabname=COMPLETED]").addClass(numCss).html(
									'交易完成<i>' + completedNum + '</i>');
						} else {
							$(".tab-nav li[tabname=COMPLETED]").removeClass(numCss).html('交易完成');
						}
						if (closedNum > 0) {
							$(".tab-nav li[tabname=CLOSED]")
									.addClass(numCss).html(
											'已关闭<i>' + closedNum + '</i>');
						} else {
							$(".tab-nav li[tabname=CLOSED]").removeClass(numCss).html('已关闭');
						}
						if (totalNum > 0) {
							$(".ALLNUM").addClass(numCss).html(
									'全部<i>' + totalNum + '</i>');
							if (!$('span', parent.document).hasClass(
									'mallOrderListOfDistributor')) {
								$(
										'a[href-url="/mallOrder/api/distributor/preList"]',
										parent.document)
										.append(
												'<span name="mallOrderListOfDistributor" class="mallOrderListOfDistributor has-num" style="margin-left:14px;"><i class="mallOrderListOfDistributorCount">'
														+ totalNum
														+ '</i></span>');
							} else {
								$('.mallOrderListOfDistributorCount',
										parent.document).html(totalNum);
							}
						} else {
							$(".ALLNUM").removeClass(numCss).html('全部');
							$('span[name="mallOrderListOfDistributor"]',
									parent.document).remove();
						}

					})
}
function loadMallOrderList(param) {
	layer.load();
	postUtil.call("/mallOrder/api/distributor/list", param, function(result) {
		var pageNumber = result.pageNumber;
		var pageSize = result.pageSize;
		var totalPage = result.totalPage;
		var totalRow = result.totalRow;
		var dataList = result.list;
		renderTable(dataList);
		 layer.closeAll("loading");
		laypage({
			cont : 'paginationDiv',
			pages : totalPage,
			curr : pageNumber,
			total : totalRow,
			skip : true,
			jump : function(obj, first) {
				if (!first) {
					param.currentPageIndex = obj.curr;
					loadMallOrderList(param);
				}
			}
		});
	});
	countReadOrUnReadNum();
	$("input[name=chooseAll]").prop("checked", false);
}
function renderTable(dataList) {
	var html = tablehHeader;
	var length = dataList.length;
	if (length > 0) {
		for (var i1 = 0; i1 < dataList.length; i1++) {
			var data = dataList[i1];
			var readClass = "new";
			var readUserId = isExitsVariable(data.readUserId);
			if (readUserId != "--" && readUserId.indexOf(_userId) >= 0) {
				readClass = "";
			}
			html += '	<div class="enquriry-data mb20" state="待发货">      '
					+ '<ol>' + '  <li class="fw-b"><input class="'
					+ readClass
					+ '" type="checkbox" name="single" orderId="'
					+ isExitsVariable(data.orderId)
					+ '"><span>买方账号：<span class="c-f">'
					+ isExitsVariable(data.buyerUserMobile)
					+ '/'
					+ isExitsVariable(data.buyerUserRealName)
					+ '</span></span></li>'
					+ '   <li class="fw-b"><span>创建时间：<span class="fw-b">'
					+ moment(data.createTime).format("YYYY-MM-DD HH:mm:ss")
					+ '</span></span></li>'
					+ '    <li style="width:27%"><span class="c-9">联系人/联系电话：'
					+ isExitsVariable(data.entrustOrderContact)
					+ '/'
					+ isExitsVariable(data.entrustOrderContactMobile)
					+ '</span></li>'
					+ '    <li style="float:right;width:20%;text-align:right"><span class="c-9">专属客户经理：'
					+ isExitsVariable(data.accountManagerName)
					+ '</span></li>'
					+ '     <li class="ml20" style="width:30%"><span>卖方账号：<span class="c-f">'
					+ isExitsVariable(data.sellerAccountName) + '  '
					+ isExitsVariable(data.offerersUserName) + '  '
					+ isExitsVariable(data.offerersUserMobile)
					+ '</span></span></li>'
					+ '     <li style="float:right;width:17%;text-align:right"><span class="c-9">订单编号：'
					+ isExitsVariable(data.orderId)
					+ '</span></li>'
					+ '</ol>     '
					+ '<table class="layui-table pop no-margin">'
					+ '<colgroup>'
					+ '  <col  width="160">'
					+ '  <col  width="340">'
					+ '  <col  width="160">'
					+ '   <col  width="100">'
					+ '    <col  width="150">'
					+ '     <col  width="100">'
					+ '    <col  width="240">'
					+ '     <col  width="160">'
					+ '       <col  width="250">'
					+ '       <col  width="200">'
					+ '     </colgroup>'
					+ '      <tbody>';
			var mallOrderDetailList = data.skuList;
			var status = isExitsVariable(data.status);
			var orderSource = data.inquiryOrderSource;
			var orderSourceStr;
			if(orderSource == 'USER_NEW_STORE_VAGUE_DEMAND' || orderSource=='USER_NEW_STORE_INQUIRY_ORDER'){
				orderSourceStr = "店铺商品";
			}else{
				orderSourceStr = "平台商品";
			}
			if (mallOrderDetailList.length >= 1) {
				for (var i = 0; i < mallOrderDetailList.length; i++) {
					var skuResource = isExitsVariable(mallOrderDetailList[i].skuResource);
					html += ' <tr>  ';
					if (skuResource == "1") {
						html += '    <td style="text-align:left!important;">' + orderSourceStr + '</td>'
								+ '    <td><a href=\"javascript:void(0);\" onclick="goProductPreview(\''
								+ mallOrderDetailList[i].skuId
								+ '\');"><p  title="'
								+ isExitsVariable(mallOrderDetailList[i].skuName)
								+ '">'
								+ isExitsVariable(mallOrderDetailList[i].skuName)
								+ '</p></a></td>';
						html += '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuMode)
							+ '</td>'
							+ '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuBrandName)
							+ '</td>'
							+ '    <td class="unitDisplay" unitName="'
							+ isExitsVariable(mallOrderDetailList[i].skuUnitName)
							+ '" >'
							+ isExitsVariable(mallOrderDetailList[i].skuQuantity)
							+ '</td>'
							+ '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuUnitName)
							+ '</td>';
					} else {
						var skuQuantity=isExitsVariable(mallOrderDetailList[i].skuQuantity);
             			if(skuQuantity!="--"&&skuQuantity!=""){
             				skuQuantity=parseFloat(skuQuantity).toFixed(3);
             			}
						html += '    <td style="text-align:left!important;">自定义商品</td>'
								+ '    <td><p  title="'
								+ isExitsVariable(mallOrderDetailList[i].skuName)
								+ '">'
								+ isExitsVariable(mallOrderDetailList[i].skuName)
								+ '</p></td>';
						html += '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuMode)
							+ '</td>'
							+ '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuBrandName)
							+ '</td>'
							+ '    <td>'
							+ skuQuantity
							+ '</td>'
							+ '    <td>'
							+ isExitsVariable(mallOrderDetailList[i].skuUnitName)
							+ '</td>';
					}
					
					if (i == 0) {
						html += '<td rowspan=' + mallOrderDetailList.length
								+ '>' + '   <dl>'
								+ '   <dd class="location-detail flt">'
								+ '    <ul>' + '     <li>'
								+ isExitsVariable(data.corporationAddress)
								+ '</li>' + '      <li>'
								+ isExitsVariable(data.consignee);
						var consigneeMobile = isExitsVariable(data.consigneeMobile);
						if (consigneeMobile != '') {
							html += '/' + isExitsVariable(data.consigneeMobile)
									+ '</li>';
						} else {
							html += '</li>';
						}
						html += '    </ul>' + '  </dd>' + '  <dd class="flt">'
								+ '     <ul>' + '      <li>'
								+ isExitsVariable(data.inquiryOrderProvince)
								+ '</li>'
								+ '     <li>'
								+ isExitsVariable(data.inquiryOrderCity)
								+ '</li>'
								+ '   </ul>'
								+ ' </dd>'
								+ ' </dl> '
								+ ' </td>'
								+ '    <td rowspan='
								+ mallOrderDetailList.length
								+ '>'
								+ '    <dl>'
								+ '       <dt class="c-f fz14 fw-b mb5">'
								+ (data.totalOrderAmount ? data.totalOrderAmount.toFixed(2) : "0.00")+ '元<dt>'
								+ '       <dd class="mb5" style="color:#00a930;">';
						if(isExitsVariable(data.confirmDeliveryDate)!='--'){
							html+= isExitsVariable(data.confirmDeliveryDate);
						}else{
							html+= ('付款后'+isExitsVariable(data.deliverDays)+'天发货');
						}
					        html+= '</dd>'
								+ '      </dl>'
								+ '   </td>'
								+ '    <td rowspan='
								+ mallOrderDetailList.length
								+ '>'
								+ '     <dl>'
								+ '     <dt class="status mt10">'
								+ isExitsVariable(data.statusCname) + '</dt>';

						if ("DELIVERY_WAITING" == status) {
							html += '      <dd style="color:#999;">'
									+ isExitsVariable(data.updateTime)
									+ '</dd>';
						} else {
							html += '      <dd style="color:#999;">'
									+ isExitsVariable(data.updateTime)
									+ '</dd>';
						}
						var deliveryLogList = data.deliveryLogList || [];
						if (deliveryLogList != null && deliveryLogList != "") {
							if ("RECEIVE_WAITING" == status
									|| "COMPLETED" == status) {
								html += '        <dd class="express-detail">'
										+ '       <ul style="width:190px;">'
										+ '          <li>发货:'
										+ isExitsVariable(deliveryLogList.deliveryTime)
										+ '</li>'
										+ '           <li>物流公司:'
										+ isExitsVariable(deliveryLogList.transportCorporationName)
										+ '</li>'
										+ '           <li>单号:'
										+ isExitsVariable(deliveryLogList.transportNo)
										+ '</li>'
										+ '          <li>物流公司联系人:'
										+ isExitsVariable(deliveryLogList.contactsName)
										+ '</li>'
										+ '           <li>联系方式:'
										+ isExitsVariable(deliveryLogList.contactsMobileOrFixedPhoneNumber)
										+ '</li>' + '         </ul>'
										+ '        </dd>';
							}
						}
						if ("RECEIVE_WAITING" == status) {
     	            		html+=( '<p><div class="inline colockbox" startTime="'+new Date(data.deliveryTime)+'" currentTime="'+new Date(data.currentTime)+'" msg="'+"系统已经自动收货"+'">	'+	
      			 	                 ' <span class="counterDesc c-9 ml5">还剩</span>'+
      			 	                 ' <span class="day c-f fw-b">00</span>'+
      			 	                 ' <span class="c-9">天</span>'+
      			 	                 ' <span class="hour c-f fw-b">00</span>'+
      			 	                 ' <span class="c-9">小时</span>'+
      			 	                 ' <span class="minute c-f fw-b">00</span>'+
      			 	                  '<span class="c-9">分</span>'+
      			 	                  '<span class="second c-f fw-b">00</span>'+
      			 	                  '<span class="c-9">秒系统自动收货</span>'+
      			 	                  '</div></p>');
						}
						html += '    </dl>          '
								+ '    </td>'
								+ '  <td rowspan='
								+ mallOrderDetailList.length
								+ '>';
						html += '    <span class="special-button mb10 mallOrderBaseDetail" orderId="'
								+ isExitsVariable(data.orderId) + '">查看</span>';
						if("IN_CONFORMING_PURCHASE"==status || "IN_CONFORMING_VENDOR"==status || "IN_CONFORMING_PLATFORM"==status){
							html+= '   <span class="special-button close mt10 c-h closeMallOrder closeMallOrderBase"  orderId="'+isExitsVariable(data.orderId)+'">关闭订单</span>';
						}
						html += '  </td>';
					}
					html += '</tr>';
				}
			}
			html += ' </tbody>' + ' </table>' + ' </div>';
		}
	} else {
		html += noDataTip;
	}
	$(".mallOrderBaselist").html(html);
	
	$.each($('.colockbox'), function(n, item){
   		var startTime = $(item).attr("startTime");
   		var currentTime = $(item).attr("currentTime");
   		var tmpTime = Date.parse(startTime.replace(/-/g,"/"));
   		var tmpCurrentTime = Date.parse(currentTime.replace(/-/g,"/"));
   		countDown(new Date(tmpTime).getTime()+(15*24*3600*1000),new Date(tmpCurrentTime).getTime(),$(item));
   	});
	
	// 渲染单位控制小数位数
	renderUnitDisplay();
}

// 发货
$(document).on("click", ".deliveryMallOrderBase", function() {
	// 弹出窗口输入物流信息
	var orderId = $(this).attr("orderId");
	// 弹出窗口输入关闭原因
	layer.open({
		title : "物流信息",
		type : 2,
		area : [ '470px', '360px' ],
		fixed : false, // 不固定
		maxmin : true,
		content : '/mallOrder/api/deliveryPage?orderId=' + orderId
	});
})
// 关闭订单
$(document).on("click", ".closeMallOrderBase", function() {
	var orderId = $(this).attr("orderId");
	// 弹出窗口输入关闭原因
	layer.open({
		title : "关闭订单",
		type : 2,
		area : [ '550px', '360px' ],
		fixed : false, // 不固定
		maxmin : true,
		content : '/mallOrder/api/closePage?orderId=' + orderId
	});

})

// 查看详情
$(document).on(
		"click",
		".mallOrderBaseDetail",
		function() {
			var orderId = $(this).attr("orderId");
			cardUtil.closeCard("订单详情-" + orderId);
			cardUtil.openCard("订单详情-" + orderId,
					"/mallOrder/api/preDetail?orderId=" + orderId);
			cardUtil.changeCard("订单详情-" + orderId);
			// 查看详情后就设置为已读
			var readParam = {};
			readParam.orderIdArr = orderId;
			readParam.type = "READ";
			postUtil.call("/mallOrder/api/orderReadNoRead", readParam,
					function() {
						loadMallOrderList(param);
					});
		})

// 查询
$(document).on("click", ".mallOrderlistSearch", function() {
	var status = $(".tab-this").attr("tabname");
	var searchObject = $("#searchObject").val();
	param.currentPageIndex = 1;
	param.searchObject = searchObject;
	param.status = status;
	param.mainObjectId = mainObjectId;
	param.accountManagerId = $('#accountManagerId_hidden').val();
	param.integrationContact = $('input[name=integrationContact]').val();
	param.distributorContact = $('input[name=distributorContact]').val();
	param.integration = $('#s_integrations').val();
	param.distributor = $('#s_distributors').val();
	param.integrationLike = $('input[name=integrationLike]').val();
	var dateStr = $('#date-range0').val();
	if(dateStr!="") {
		if(dateStr.indexOf("to") > 0) {
			var dateArr = dateStr.split("to");
			param.startDate = $.trim(dateArr[0]);
			param.endDate = $.trim(dateArr[1]);
		}
	} else {
		param.startDate = "";
		param.endDate = "";
	}

	if(param.startDate !='' && param.endDate !='') {
		if(moment(param.endDate).isBefore(param.startDate)) {
			layer.msg('结束日期不能小于开始日期',{icon:5});
			return false;
		}
	}

	console.log(param);
	loadMallOrderList(param);
})

// 不同tab切换
$(document).on('click', '.tab-nav li', function() {
	$(this).addClass("tab-this").siblings().removeClass("tab-this");
	var status = $(this).attr("tabname");
	$("#searchObject").val("");
	$('#accountManagerId_hidden').val('');
	$('input[name=integrationContact]').val('');
	$('input[name=distributorContact]').val('');
	$('#s_integrations').val('');
	$('#s_distributors').val('');
	$('#date-range0').val('');
	$('input[name=integrationLike]').val('');
	form.render();
	param.currentPageIndex = 1;
	param.status = status;
	param.mainObjectId = mainObjectId;
	loadMallOrderList(param);
})
// 已读
$(document).on(
		'click',
		'.readSet',
		function() {
			var orderIdArr = "";
			$("input[type=checkbox][name=single]:checked").each(
					function(index, item) {
						var orderId = $(item).attr("orderId");
						orderIdArr += (orderId + ",");
					})
			if (orderIdArr == "") {
				layer.msg("请至少选择一条记录!");
				return;
			}
			var readParam = {};
			readParam.orderIdArr = orderIdArr;
			readParam.type = "READ";
			postUtil.call("/mallOrder/api/orderReadNoRead", readParam,
					function(result) {
						if (result.STATUS == 'SUCCESS') {
							countReadOrUnReadNum();
							$("input[type=checkbox]:checked").each(
									function(index, item) {
										$(item).prop("checked", false);
										$(item).removeClass("new");
									})
							layer.msg('设置成功');
						} else {
							layer.msg('系统发生未知错误' + result.MSG, {
								icon : 5
							});
						}
					});
		})
// 未读
$(document).on(
		'click',
		'.noReadSet',
		function() {
			var orderIdArr = "";
			$("input[type=checkbox][name=single]:checked").each(
					function(index, item) {
						var orderId = $(item).attr("orderId");
						orderIdArr += (orderId + ",");
					})
			if (orderIdArr == "") {
				layer.msg("请至少选择一条记录!");
				return;
			}
			var readParam = {};
			readParam.orderIdArr = orderIdArr;
			readParam.type = "NOREAD";
			postUtil.call("/mallOrder/api/orderReadNoRead", readParam,
					function(result) {
						if (result.STATUS == 'SUCCESS') {
							countReadOrUnReadNum();
							$("input[type=checkbox]:checked").each(
									function(index, item) {
										$(item).prop("checked", false);
										$(item).addClass("new");
									})
							layer.msg('设置成功');
						} else {
							layer.msg('系统发生未知错误' + result.MSG, {
								icon : 5
							});
						}
					});
		})
// 发货回调
function updateDeliveryCompleteCallback(result) {
	var isPass = true;
	if (result.STATUS == "SUCCESS") {
		isPass = true;
	} else {
		isPass = false;
	}
	if (isPass) {
		loadMallOrderList(param);
	}
	return isPass;
}
// 关闭订单回调函数
function closeMallOrderCallback(result) {
	var isPass = true;
	if (result.STATUS == "SUCCESS") {
		isPass = true;
	} else {
		isPass = false;
	}
	if (isPass) {
		loadMallOrderList(param);
	}
	return isPass;
}
function goProductPreview(skuId) {
	cardUtil.closeCard("预览商品-" + skuId);
	cardUtil.openCard("预览商品-" + skuId, "/sku/previewBySkuId?skuId=" + skuId);
	cardUtil.changeCard("预览商品-" + skuId);
}

