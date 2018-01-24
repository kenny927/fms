function getProjectInfo(data){
	var html ='<p class="fz16 t-c">工程商</p>'+
			  '<p class="fz12">账号：'+(data.buyerMobile||'')+'</p>'+
			  '<p class="fz12">用户名：'+(data.buyerUsername||'')+'</p>'+
			  '<p class="fz12">公司名称：'+(data.buyerAccountName||'')+'</p>';
	return html;
}

function getDistributorInfo(data){
	var html ='<p class="fz16 t-c">分销商</p>'+
			  '<p class="fz12">公司名称：'+(data.sellerAccountName||'')+'</p>'+
			  '<p class="fz12">联系人：'+(data.linkman||'')+'</p>'+
			  '<p class="fz12">手机号：'+(data.linkmanTelephone||'')+'</p>';
	return html;
}

function getManagerInfo(data){
	var html ='<p class="fz16 t-c">专属客户经理：'+(data.accountManagerName||'')+'</p>'+
			  '<p class="fz12">手机：'+(data.mobile||'')+'</p>'+
			  '<p class="fz12">QQ：'+(data.qq||'')+'</p>'+
			  '<p class="fz12">邮箱：'+(data.email||'')+'</p>';
	return html;
	
}

function renderUserInfos(result){
	var buySellerManageInfo = result.buySellerManageInfo;
	$('#projectInfo').html(getProjectInfo(buySellerManageInfo));
	$('#distributorInfo').html(getDistributorInfo(buySellerManageInfo));
	$('#managerInfo').html(getManagerInfo(buySellerManageInfo));
}


function getSellerOfferTableTitle(data){
	var html ='<ul class="th th-border th-bg">'+
				 '<li style="width: 28%;"><div class="mida pl20"><div class="midb c-2" style="text-align: left;">报价方式： <span class="c-f">'+(data.offerModeName||'')+'</span></div></div></li>'+
				 '<li style="width: 68%;"><div class="mida pl20"><div class="midb c-2" style="text-align: right;">期望交期/回复交期：'+moment(data.expectDeliveryDate).format("YYYY-MM-DD")+'/ <span class="c-f fw-b">'+moment(data.replyDeliveryDate).format("YYYY-MM-DD")+'</span></div></div></li>'+
			  '</ul>';
	return html;
}

function renderOfferInfo(data){
	var offerDetail = data.offerDetail;
	var html = getSellerOfferTableTitle(offerDetail)+getSellerOfferTableHead(offerDetail)+getSellerOfferTableData(offerDetail);
	$('#sellerOfferDetail').html(html);
}

function renderSkuInfo(data){
	var html='<div class="roleDescription mb10 fz12 mt20">平台商品：</div>';
	html+=getSkuInfoTableHead(data);
	var skuList = data.skuDetailList;
	for(var i=0;i<skuList.length;i++){
		var sku = skuList[i];
		if(sku.skuType=='1'){
			html+=getSkuTableData(sku);
		}
	}
	$('#sellerOfferDetail').append(html);
}

function renderCustomSkuInfo(data){
	var html='<div class="roleDescription mb10 fz12 mt20">自定义商品：</div>';
	html+=getCustomSkuInfoTableHead(data);
	var skuList = data.skuDetailList;
	var content="";
	for(var i=0;i<skuList.length;i++){
		var sku = skuList[i];
		if(sku.skuType=='2'){
			content+=getCustomSkuTableData(sku);
		}
	}
	if(content){
		$('#sellerOfferDetail').append(html+content);
	}
}

function getSellerOfferTableHead(data){		
	var html = 	'<ul class="th th-border">'+
					'<li style="width: 9%;"><div class="mida"><div class="midb">城市</div></div></li>'+
					'<li style="width: 19%;"><div class="mida"><div class="midb">公司名称</div></div></li>'+
					'<li style="width: 18%;"><div class="mida"><div class="midb">接单状态</div></div></li>'+
					'<li style="width: 18%;"><div class="mida"><div class="midb">报价单状态</div></div></li>'+
					'<li style="width: 18%;"><div class="mida"><div class="midb">报价单发送状态</div></div></li>'+
					'<li style="width: 18%;"><div class="mida"><div class="midb">报价总金额</div></div></li>'+
				'</ul>';
	return html;
}

function getSkuInfoTableHead(data){
	var isTax='';
	if(data.isNeedInvoice=='Y'){
		isTax='(含税)';
	}
	var html = 	'<ul class="th">'+
					'<li style="width: 8%;"><div class="mida"><div class="midb">商品编码</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">商品型号</div></div></li>'+
					'<li style="width: 7%;"><div class="mida"><div class="midb">品牌</div></div></li>'+
					'<li style="width: 20%;"><div class="mida"><div class="midb">商品名称</div></div></li>'+
					'<li style="width: 20%;"><div class="mida"><div class="midb">商品描述</div></div></li>'+
					'<li style="width: 8%;"><div class="mida"><div class="midb">数量</div></div></li>'+
					'<li style="width: 7%;"><div class="mida"><div class="midb">计量单位</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">商品报价'+isTax+'</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">报价小计(元)</div></div></li>'+
				'</ul>';
	return html;
}

function getCustomSkuInfoTableHead(data){
	var isTax='';
	if(data.isNeedInvoice=='Y'){
		isTax='(含税)';
	}
	var html = 	'<ul class="th">'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">商品型号</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">品牌</div></div></li>'+
					'<li style="width: 20%;"><div class="mida"><div class="midb">商品名称</div></div></li>'+
					'<li style="width: 20%;"><div class="mida"><div class="midb">商品描述</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">数量</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">计量单位</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">商品报价'+isTax+'</div></div></li>'+
					'<li style="width: 10%;"><div class="mida"><div class="midb">报价小计(元)</div></div></li>'+
				'</ul>';
	return html;
}

function getPriceAreaInfo(data){
	var priceArea ='<div class="variousPrice">'+
						'<dl><dt>商品报价:</dt><dd><span class="fw-b">'+(data.totalSkuOfferAmount?data.totalSkuOfferAmount.toFixed(2):'0.00')+'</span>元</dd></dl>'+
						'<dl><dt>运费:</dt><dd><span>'+(data.totalDeliveryOfferAmount?data.totalDeliveryOfferAmount.toFixed(2):'0.00')+'</span>元</dd></dl>'+
						'<dl><dt>'+(data.totalOtherExpenseRemark?data.totalOtherExpenseRemark:'其他费用')+':</dt><dd><span>'+(data.totalOtherExpenseOfferAmount?data.totalOtherExpenseOfferAmount.toFixed(2):'0.00')+'</span>元</dd></dl>'+
						'<dl><dt>总报价:</dt><dd><span class="fw-b">'+(data.totalOfferAmount?data.totalOfferAmount.toFixed(2):'0.00')+'</span>元</dd></dl>'+
					'</div>';
	return priceArea;
}

function renderPriceArea(data){
	$('#sellerOfferDetail').append(getPriceAreaInfo(data));
}

function getDetailInfo(data){
	var html = '<ul class="th th-border">'+
				  '<li style="width: 28%;"><div class="mida pl20"><div class="midb c-2 fz16" style="text-align: left;">详细信息 </div></div></li>'+
			   '</ul>'+
			   '<div class="detailContent Inquirytitle detailedMessage">'+
				  '<dl class="detail-list"><dt>配送方式：</dt><dd>'+(data.deliveryModeName||'')+'</dd><dd>'+(data.deliveryModeRemark||'')+'</dd></dl>'+
				  '<dl class="detail-list"><dt>项目地：</dt><dd>'+(data.projectProvince||'')+'/'+(data.projectCity||'')+'</dd></dl>';
				  //'<dl class="detail-list"><dt>收获地址：</dt><dd>'+data.consigneeAddress+'</dd><dd>'+data.consignee+'</dd><dd>'+data.consigneeMobile+'</dd></dl>'+
	if(data.payMode=='CASH_ON_DELIVERY'){ //货到付款
		html  +=  '<dl class="detail-list"><dt>结算方式：</dt><dd>'+(data.payModeRemark?('货到<span style="color:red">'+data.payModeRemark+'</span>天后付款'):'')+'</dd></dl>';
	}else if(data.payMode=='DEPOSIT'){  //订金支付
		html  +=  '<dl class="detail-list"><dt>结算方式：</dt><dd>'+(data.payModeName||'')+'</dd><dd>'+(data.payModeRemark?(data.payModeRemark+'%'):'')+'</dd></dl>';
	}else{//先款后货
		html  +=  '<dl class="detail-list"><dt>结算方式：</dt><dd>'+(data.payModeName||'')+'</dd><dd>'+(data.payModeRemark?'':'')+'</dd></dl>';
	}			  
	if(data.isNeedInvoice=='Y'){
		html +=  '<dl class="detail-list"><dt>是否开票：</dt><dd>'+(data.isNeedInvoiceName?data.isNeedInvoiceName+'(增值税专用发票)':'')+'</dd><dd></dd></dl>';
	}else{
		html +=  '<dl class="detail-list"><dt>是否开票：</dt><dd>'+(data.isNeedInvoiceName||'')+'</dd><dd></dd></dl>';
	}				  
		html +=	 '<dl class="detail-list"><dt>备注：</dt><dd>'+(data.remark||'')+'</dd></dl>'+
			   '</div>';
	return html;
}

function renderDetailInfo(data){
	$('#sellerOfferDetail').append(getDetailInfo(data));
}
	

function getSellerOfferTableData(data){
	var html = '<div class="information-list" style="border-right: none;">'+
					'<ul class="information informationList90">'+
						'<li style="width: 9%;"><div class="mida"><div class="midb">'+ (data.city||'') +'</div></div></li>'+
						'<li style="width: 19%;"><div class="mida"><div class="midb">'+ (data.sellerAccountName||'') +'</div></div></li>'+
						'<li style="width: 18%;"><div class="mida"><div class="midb"><p class="c-2">'+data.isSellerAcceptYetName+'</p><p class="c-9">'+ moment(data.sellerAcceptTime).format("YYYY-MM-DD HH:mm:ss")+'</p></div></div></li>'+
						'<li style="width: 18%;"><div class="mida"><div class="midb c-g fw-b"><p>'+data.statusName+'</p><p>'+moment(data.updateTime).format("YYYY-MM-DD HH:mm:ss")+'</p></div></div></li>'+
						'<li style="width: 18%;"><div class="mida"><div class="midb">';
				if(data.status=='CLOSED'){
					html+='<span class="send mt10">--</span>'
				}else if(data.status=='OFFERED' && data.isSendToBuyerYet=='NOT_SEND'){
					html+='<div class="sure-btn">';
					html+='<p>'+(data.isSendToBuyerYetName||'')+'</p>';
					html+='<span class="send mt10" onclick="sendSellerOfferToBuyer(\''+data.offerId+'\')">发送给工程商</span>';
					html+='</div>';
				}else if( data.isSendToBuyerYet=='SENDED'){
					html+='<div class="sure-btn">';
					html+='<p>'+(data.isSendToBuyerYetName||'')+'</p>';
					html+='<p>'+moment(data.sendToPlatformTime).format("YYYY-MM-DD HH:mm:ss")+'</p>';
					html+='</div>';
				}else{
					html+='<div class="sure-btn">';
					html+='<p>'+(data.isSendToBuyerYetName||'')+'</p>';
					html+='</div>';
				}
							
				html+=	'</div></div></li>'+		
						'<li style="width: 18%;"><div class="mida"><div class="midb c-f fw-b">'+(data.totalOfferAmount?data.totalOfferAmount.toFixed(2):'')+'</div></div></li>'+
				   '</ul>'+
				'</div>';
	return html;
}

function sendSellerOfferToBuyer(offerId){
	postUtil.call("/mallSellerOffer/sendToBuyer", {offerId:offerId}, function (result) {
		if(result.SUCCESS){
			postUtil.submit("/mallSellerOffer/offerListPage",null);
		}
	});
}

function getSkuTableData(data){
	var html = '<div class="information-list" style="border-right: none;">'+
					'<ul class="information informationList">'+
						'<li style="width: 8%;"><div class="mida"><div class="midb">'+ (data.skuId||'') +'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb two-row" title="'+(data.skuMode||'')+'">'+ (data.skuMode||'') +'</div></div></li>'+
						'<li style="width: 7%;"><div class="mida"><div class="midb">'+ (data.skuBrandName||'')+'</div></div></li>'+
						'<li style="width: 20%;"><div class="mida"><div class="midb two-row" title="'+(data.skuName||'')+'">'+(data.skuName||'')+'</div></div></li>'+
						'<li style="width: 20%;"><div class="mida"><div class="midb">'+(data.remark||'')+'</div></div></li>'+
						'<li style="width: 8%;"><div class="mida"><div class="midb unitDisplay" unitName="'+data.skuUnitName+'">'+(data.skuQuantity?data.skuQuantity.toFixed(3):'')+'</div></div></li>'+
						'<li style="width: 7%;"><div class="mida"><div class="midb">'+(data.skuUnitName||'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuOfferPrice?data.skuOfferPrice.toFixed(2):'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuOfferAmount?data.skuOfferAmount.toFixed(2):'')+'</div></div></li>'+
				   '</ul>'+
				'</div>';
	return html;
}

function getCustomSkuTableData(data){
	var html = '<div class="information-list" style="border-right: none;">'+
					'<ul class="information informationList">'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+ (data.skuMode||'') +'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+ (data.skuBrandName||'')+'</div></div></li>'+
						'<li style="width: 20%;"><div class="mida"><div class="midb">'+(data.skuName||'')+'</div></div></li>'+
						'<li style="width: 20%;"><div class="mida"><div class="midb">'+(data.remark||'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuQuantity?data.skuQuantity.toFixed(3):'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuUnitName||'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuOfferPrice?data.skuOfferPrice.toFixed(2):'')+'</div></div></li>'+
						'<li style="width: 10%;"><div class="mida"><div class="midb">'+(data.skuOfferAmount?data.skuOfferAmount.toFixed(2):'')+'</div></div></li>'+
				   '</ul>'+
				'</div>';
	return html;
}

function renderOtherOfferList(data){
	if(data){
		var template='<div class="roleDetail">'+
			        '<p>报价单<span>#{offerId}</span><a href="javascript:;">展开>></a></p>'+
			        '</div>'+
			        '<div class="table inquiry quotation mb20" style="display: none;">#{table}</div>';
		for(var i=0;i<data.length;i++){
			var html = template;
			html = html.replace('#{offerId}',data[i].offerId);
			html = html.replace('#{table}',getSellerOfferTableTitle(data[i])+getSellerOfferTableHead(data[i])+getSellerOfferTableData(data[i]));
			$('#content').append(html);
		}
	}
}

