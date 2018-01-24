function loadMallOrderDetail(data){
	var list=data;
	var html="";
	orderId=list.mallOrderlist.orderId;
	 enquireId=list.mallOrderlist.enquireId;
	var offerId=list.mallOrderlist.offerId;
	 $("#offerId").html(offerId);
	 $("#orderId").html(orderId);
	 $("#breadCrubOrderId").html(orderId);
	 buyerAccountId=list.mallOrderlist.buyerAccountId;
	 sellerAccountId=list.mallOrderlist.sellerAccountId;
	  html+='					  	<div class="roleDescription orderDescription">                                                                                 ';
	  html+='					  		<ol>                                                                                                                        ';
	  html+='					  			<li  style="width: 21%;">关联报价单: <span>'+isExitsVariable(list.mallOrderlist.offerId)+'</span></li>                                                             ';
	  html+='					  			<li  style="width: 21%;">关联询价单: <span>'+isExitsVariable(list.mallOrderlist.enquireId)+'</span></li>                                                                                    ';
	  html+='					  			<li  style="width: 21%;">关联委托单: <span>'+isExitsVariable(list.mallOrderlist.demandId)+'</span></li>                                                                                      ';
	  html+='					  			<li style="width: 21%;text-align:right">期望交期: <span  style="color:#FF0000">'+isExitsVariable(list.mallOrderlist.confirmDeliveryDate)+'</span></li>                                                             ';
	  html+='					  			<li  style="width: 21%;">订单编号: <span>'+isExitsVariable(list.mallOrderlist.orderId)+'</span></li>                                                                                    ';
	  html+='					  			<li  style="width: 21%;">订单生成时间: <span>'+isExitsVariable(list.mallOrderlist.createTime)+'</span></li>                                                                            ';
	  html+='					  			<li  style="width: 36%;">客户经理: <span>'+isExitsVariable(list.mallOrderlist.accountManagerName)+isExitsVariable(list.mallOrderlist.mobile)+'</span></li>                                                                            ';
	  html+='                    		    <li style="width:21%;padding-left:0px" class="ml20"><div class="mida"><div class="midb" style="text-align: left;">分销商:'+isExitsVariable(list.mallOrderlist.sellerAccountName)+'</div></div></li>         ';
      html+='                    		   <li style="width:21%;"><div class="mida"><div class="midb">联系人:'+isExitsVariable(list.mallOrderlist.sellerContactsName)+'&nbsp;&nbsp;'+isExitsVariable(list.mallOrderlist.sellerContactsMobile)+'</div></div></li>                                                ';
      html+='                    		   <li style="width:21%;"><div class="mida"><div class="midb">工程商:'+isExitsVariable(list.mallOrderlist.buyerMobile)+'</div></div></li>         ';
      html+='                    		   <li style="width:200px;"><div class="mida"><div class="midb" style="padding-left:0px;text-align:left;">联系人:'+isExitsVariable(list.mallOrderlist.buyerContactsName)+'&nbsp;&nbsp;'+isExitsVariable(list.mallOrderlist.buyerContactsMobile)+'</div></div></li>                                                ';
      
	  html+='					  		</ol>                                                                                                                       ';
	  html+='					  	</div>                                                                                                                          ';
	 /*
	  html+='<ul class="th th-border th-bg"> ';
	  html+='                    		<li style="width:230px;" class="ml20"><div class="mida"><div class="midb" style="text-align: left;">分销商:'+isExitsVariable(list.mallOrderlist.sellerAccountName)+'</div></div></li>         ';
      html+='                    		<li style="width:120px;"><div class="mida"><div class="midb" style="padding-left:20px;text-align:left;">联系人:'+isExitsVariable(list.mallOrderlist.sellerContactsName)+'</div></div></li>                                                ';
      html+='                    		<li style="width:160px;"><div class="mida"><div class="midb" style="padding-left:20px;text-align:left">联系电话:'+isExitsVariable(list.mallOrderlist.sellerContactsMobile)+'</div></div></li>                                       ';
      html+='                    		<li style="width:130px;" class="ml20"><div class="mida"><div class="midb" style="text-align: left;">工程商:'+isExitsVariable(list.mallOrderlist.buyerMobile)+'</div></div></li>         ';
      html+='                    		<li style="width:175px;"><div class="mida"><div class="midb" style="padding-left:20px;text-align:left;">联系人:'+isExitsVariable(list.mallOrderlist.buyerContactsName)+'</div></div></li>                                                ';
      html+='                    		<li style="width:160px;"><div class="mida"><div class="midb" style="padding-left:20px;text-align:left">联系电话:'+isExitsVariable(list.mallOrderlist.buyerContactsMobile)+'</div></div></li>                                       ';
      html+='</ul> ';
	  */
	  html+='                   	<ul>                                                                                                       ';
	  html+='                   		<li style="width: 33%;"><div class="mida"><div class="midb">商品信息</div></div></li>                                                               ';
	  html+='                   		<li style="width: 14%;"><div class="mida"><div class="midb">商品报价</div></div></li>                                         ';
	  html+='                   		<li style="width: 14%;"><div class="mida"><div class="midb">数量</div></div></li>                                            ';
	  html+='                   		<li style="width: 23%"><div class="mida"><div class="midb">交期/发货</div></div></li>                                        ';
	  html+='                   		<li style="width: 16%"><div class="mida"><div class="midb">订单状态</div></div></li>                                         ';
	  html+='                   	</ul>                                                                                                                           ';
	  html+='                   	<div class="information-list wait2">                                                                                             ';
	  var mallOrderDetailList=list.mallOrderlist.mallOrderDetailList;
	    for(var i=0;i<mallOrderDetailList.length;i++){
	    	 var skuType=isExitsVariable(mallOrderDetailList[i].skuType); 
	    	html+='                    <ul class="information" style="width: 61%;">                                                                                  ';
	    	 html+='                   		<li style="width: 54%;"><div class="mida"><div class="midb">                                                                                   ';
	    	 html+='                   		<dl>                                                                                                                        ';
	    	 html+='                   			<dt>                                                                                                                    ';
	    	 if("1"==skuType){
            	 html+='                    				<img src="'+isExitsVariable(mallOrderDetailList[i].orginImg)+'" alt="" />                                                                         ';
	            }else{
	            	 html+='                    				<img src="'+isExitsVariable(mallOrderDetailList[i].orginImg)+'" alt="" />                                                                        ';
	            }
	    	 html+='                   				<span>'+isExitsVariable(mallOrderDetailList[i].brandChineseName)+'</span>                                                                                                          ';
	    	 html+='                   			</dt>                                                                                                                   ';
	    	 html+='                   			<dd>                                                                                                                    ';
	    	 if("1"==skuType){
            	 html+='                    				<p class="goodsName"  title="'+isExitsVariable(mallOrderDetailList[i].skuName)+'">'+isExitsVariable(mallOrderDetailList[i].skuName)+'</p>                                                                ';
	          }else{
	            	 html+='                    				<p class="goodsName"  title="'+isExitsVariable(mallOrderDetailList[i].skuName)+'">'+isExitsVariable(mallOrderDetailList[i].skuName)+'</p>                                                                ';
	            }
	    	 html+='                   				<p title="'+isExitsVariable(mallOrderDetailList[i].model)+'">产品型号：'+isExitsVariable(mallOrderDetailList[i].model)+'</p>                                                                                        ';
	    	 html+='                   				<p>商品编码：'+isExitsVariable(mallOrderDetailList[i].skuId)+'</p>                                                                                       ';
	    	 html+='                   				<p title="'+isExitsVariable(mallOrderDetailList[i].propertyId)+'">'+isExitsVariable(mallOrderDetailList[i].propertyId)+'</p>                                                                                    ';
	    	 html+='                   			</dd>                                                                                                                   ';
	    	 html+='                   		</dl>                                                                                                                       ';
	    	 html+='                   		</div></div></li>                                                                                                           ';
	    	 html+='                   		<li style="width: 23%;"><div class="mida"><div class="midb"><p class="goodsDetail">'+isExitsVariable(mallOrderDetailList[i].skuOrderPrice)+'元/'+isExitsVariable(mallOrderDetailList[i].skuUnitName)+'</p></div></div></li>          ';
            if("1"==skuType){
                html+='                   		<li style="width: 23%;"><div class="mida"><div class="midb unitCheck unitDisplay" unitName="'+isExitsVariable(mallOrderDetailList[i].skuUnitName)+'">'+isExitsVariable(mallOrderDetailList[i].skuQuantity)+'</div></div></li>                                      ';
            } else {
                html+='                   		<li style="width: 23%;"><div class="mida"><div class="midb">'+isExitsVariable(mallOrderDetailList[i].skuQuantity)+'</div></div></li>                                      ';
            }
	    	 html+='                      </ul>                                                                                                                         ';
	    }
	  var status=isExitsVariable(list.mallOrderlist.status);
	    //快递方式模块
	  html+='                      <div class="Delivery" style="text-align:left;right:15%;margin-top:-50px">                                                                                                       ';
	  html+='                      	    <p>交期：'+isExitsVariable(list.mallOrderlist.confirmDeliveryDate)+'</p>                                                                                   ';
	  if("RECEIVE_WAITING"==status||"COMPLETED"==status){
	  html+='                      	    <p>发货：'+isExitsVariable(list.mallOrderlist.deliveryTime)+'</p>                                                                                   ';
	  html+='                      	    <p>物流公司：'+isExitsVariable(list.mallOrderlist.transportCorporationName)+'</p>                                                                                   ';
	  html+='                      	    <p>单号：'+isExitsVariable(list.mallOrderlist.transportNo)+'</p>                                                                                   ';
	  html+='                      	    <p>联系人：'+isExitsVariable(list.mallOrderlist.contactsName)+'</p>                                                                                   ';
	  html+='                      	    <p>联系方式：'+isExitsVariable(list.mallOrderlist.contactsMobileOrFixedPhoneNumber)+'</p>                                                                                   ';
	  }
	  html+='                      </div>   ';
	  var statusCname=isExitsVariable(list.mallOrderlist.statusCname);
	   html+='                      <div class="orderStatus sure-btn" style="height:80px;margin-top:-50px">                                                                                                ';
	   html+='                          <p>'+statusCname+'</p>                                                                                                                       ';
	   if("CLOSED"==status){
		 //查看关闭原因
	     	  html+='      <p class="c-9">'+isExitsVariable(list.mallOrderlist.updateTime)+'</p>'; 
	     	  html+='	   <p class="c-9">'+isExitsVariable(list.mallOrderlist.closeAccountName)+'</p>'; 
	     	  html+='      <a class="fz12 tips" href="javascript:;" closeRemark='+isExitsVariable(list.mallOrderlist.closeRemark)+'>查看关闭原因</a>'; 
	       }else if("COMPLETED"==status){
	    	   html+='                       	   <p class="c-9">收货时间</p>                                                                                                           ';
               html+='                       	   <p class="c-9">'+isExitsVariable(list.mallOrderlist.receiptDate)+'</p>                                                                                                ';
           }
	   html+='                   	</div>   ';
	   html+='                   	</div>                                                                                                             ';
	   //商品报价模块
	   html+='<div class="detailContent orderMessage">                                                  ';
	   html+='                    		<dl class="detail-list">                                                ';
	   html+='                    			<dt>商品报价:</dt>                                   ';
	   html+='                    			<dd><span class="c-f fz12">'+isExitsVariable(list.mallOrderlist.totalSkuOrderAmount)+'</span>元</dd>     ';
	   html+='                    		</dl>                                                ';
	   html+='                    		<dl class="detail-list">                                                ';
	   html+='                    			<dt>运费:</dt>                                     ';
	   html+='                    			<dd><span class="c-f fz12">'+isExitsVariable(list.mallOrderlist.totalDeliveryOrderAmount)+'</span>元</dd>                  ';
	   html+='                    		</dl>                                                ';
	   html+='                    		<dl class="detail-list">                                              ';
	   var totalOtherExpenseRemark=isExitsVariable(list.mallOrderlist.totalOtherExpenseRemark);
	   if(totalOtherExpenseRemark!=""){
		   html+='                    			<dt>'+totalOtherExpenseRemark+':</dt>                                   ';
	   }else{
		   html+='                    			<dt>其他费用:</dt>                                   ';
	   }
	   
	   html+='                    			<dd><span class="c-f fz12">'+isExitsVariable(list.mallOrderlist.totalOtherExpenseOrderAmount)+'</span>元</dd>                  ';
	   html+='                    		</dl>                                                ';
	   html+='                    		<dl class="detail-list">                                                ';
	   html+='                    			<dt>总报价:</dt>                                    ';
	   html+='                    			<dd><span class="fw-b c-f fz14">'+isExitsVariable(list.mallOrderlist.totalOrderAmount)+'</span>元</dd>     ';
	   html+='                    		</dl>                                                ';
	   html+='</div>                                                                        ';
	   //配送方式模块
	   var payMode=isExitsVariable(list.mallOrderlist.payMode);
	   var payModeCname=isExitsVariable(list.mallOrderlist.payModeCname);
	   
	   var deliveryMode=isExitsVariable(list.mallOrderlist.deliveryMode);
	   var deliveryModeCname=isExitsVariable(list.mallOrderlist.deliveryModeCname);
	   var deliveryModeRemark=isExitsVariable(list.mallOrderlist.deliveryModeRemark);
	   var isNeedInvoice=isExitsVariable(list.mallOrderlist.isNeedInvoice);
	   var isNeedInvoiceCname=isExitsVariable(list.mallOrderlist.isNeedInvoiceCname);
	   var invoiceType=isExitsVariable(list.mallOrderlist.invoiceType);
	  html+='                   <div class="detailContent detailedMessage">                                                                                      ';
	  html+='                   	<dl class="detail-list">                                                                                                        ';
	  html+='                   		<dt>配送方式：</dt>                                                                                                              ';
	  if("OTHER"==deliveryMode){
		  html+='                   		<dd>'+deliveryModeCname+'('+deliveryModeRemark+')</dd>    ';
	  }else{
		  html+='                   		<dd>'+deliveryModeCname+'</dd>   '; 
	  }
	  html+='                   	</dl>                                                                                                                           ';
	  html+='                   	<dl class="detail-list">                                                                                                        ';
	  html+='                   		<dt>项目地：</dt>                                                                                                               ';
	  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.projectProvince)+isExitsVariable(list.mallOrderlist.projectCity)+isExitsVariable(list.mallOrderlist.projectDistrict)+isExitsVariable(list.mallOrderlist.projectDetailAddress)+'</dd>                                                                                                            ';
	  html+='                   	</dl>                                                                                                                           ';
	  html+='                   	<dl class="detail-list">                                                                                                        ';
	  html+='                   		<dt>收货地址：</dt>                                                                                                              ';
	  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.consignee)+'</dd>                                                                                                             ';
	  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.consigneeMobile)+'</dd>                                                                                                                 ';
	  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.consigneeAddress)+'</dd>                                                                                                              ';
	  html+='                   	</dl>                                                                                                                           ';
	  html+='                   	<dl class="detail-list">                                                                                                        ';
	  html+='                   		<dt>结算方式：</dt>                                                                                                              ';
	  var payMode=isExitsVariable(list.mallOrderlist.payMode);
	  if(payMode == "CASH_ON_DELIVERY") {
	    	 html+='   			       	    	<p>货到<span  class="fw-b fz14 c-f">'+isExitsVariable(list.mallOrderlist.payModeRemark)+'</span>天后付款</p>  ';
	    }else if(payMode == "DEPOSIT") {
	    	html+='                       	    	<p>'+isExitsVariable(list.mallOrderlist.payModeCname)+'(<span class="c-f">'+isExitsVariable(list.mallOrderlist.payModeRemark)+'</span>%)</p>      '; 
	    }else{
	    	html+=' <p>'+isExitsVariable(list.mallOrderlist.payModeCname)+'</p>';
	    }
	  html+='                   	</dl>                                                                                                                           ';
	  html+='                   	<dl class="detail-list">                                                                                                        ';
	  html+='                   		<dt>是否开票：</dt>                                                                                                              ';
	  if("Y"==isNeedInvoice){
		  html+='                   		<dd>'+isNeedInvoiceCname+'(增值税专用发票)</dd>   ';
		  
	  }else{
		  html+='                   		<dd>'+isNeedInvoiceCname+'</dd>   ';
	  }
	  html+='                   	</dl>    '; 
	  if("Y"==isNeedInvoice){
			  html+='                   	<dl class="detail-list">                                                                                                      ';
			  html+='                   		<dt>名称：</dt>                                                                           ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.corporationName)+'</dd>                                                                                                                 ';
			  html+='                   	</dl> ';
			  html+='                   	<dl class="detail-list">                                                                                                      ';
			  html+='                   		<dt>纳税人识别号：</dt>                                                                           ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.taxpayerIdentificationNumber)+'</dd>                              ';
			  html+='                   	</dl> ';
			  html+='                   	<dl class="detail-list">                                                                                                        ';
			  html+='                   		<dt>地址、电话：</dt>                                                                            ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.corporationAddress)+'</dd>                                                                                                                 ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.corporationPhoneNumber)+'</dd>                                                                                                                 ';
			  html+='                   	</dl>   ';                                                       
			  html+='                   	<dl class="detail-list">                                                                                                        ';
			  html+='                   		<dt>开户行及账号：</dt>                                                                           ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.corporationBankAccount)+'</dd>                                                                                                              ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.corporationBankDesc)+'</dd>                                                                                                              ';
			  html+='                   	</dl>  ';                                                         
			  html+='                   	<dl class="detail-list">                                                                                                        ';
			  html+='                   		<dt>收票人姓名：</dt>                                                                            ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.invoiceConsignee)+'</dd>                                                                                                              ';
			  html+='                   	</dl>       ';                                                                                                 
			  html+='                   	<dl class="detail-list">                                                                                                        ';
			  html+='                   		<dt>收票人电话：</dt>                                                                            ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.invoiceConsigneeMobile)+'</dd>                              ';
			  html+='                   	</dl> ';
			  html+='                   	<dl class="detail-list">                                                                                                        ';
			  html+='                   		<dt>收票人地址：</dt>                                                                            ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.invoiceConsigneeAddress)+'</dd>                                                                                                              ';
			  html+='                   	</dl>    ';                                                                                                                   
			  html+='                   	<dl class="detail-list read-only">                                                                                              ';
			  html+='                   		<dt>备注：</dt>                                                                                                                ';
			  html+='                   		<dd>'+isExitsVariable(list.mallOrderlist.remark)+'</dd>                                                                                                        ';
			  html+='                   	</dl>  ';
	}
	  html+='                   </div>                                                                                                                           ';
	  //合同确认模块
	  var buyerContractList=list.mallOrderlist.buyerContractList;
	  var sellerContractList=list.mallOrderlist.sellerContractList;
	    attachmentCount=parseInt(buyerContractList.length);
	   html+='   <ul class="th th-border">';
	   html+=' <li><div class="mida"><div class="midb fz16 ml15" style="text-align: left;">双方确认合同</div></div></li>';
	   html+=' </ul>';
	   html+=' <ul class="th th-border compact">';
	   html+=' 	<li style="width: 20%;"><div class="mida"><div class="midb">账号/公司名称</div></div></li>';
	   html+=' 	<li style="width: 58%;"><div class="mida"><div class="midb">合同文件</div></div></li>';
	   html+=' <li style="width: 22%;"><div class="mida"><div class="midb">操作</div></div></li>';
	   html+=' 	</ul>';
	   html+='<div class="information-list">                                                                                                                                               ';
	   html+='                    	<ul class="information compact downloadInformation" style="height:120px">                                                                                                    ';
	   html+='                    		<li style="width: 20%;height:121px;"><div class="mida"><div class="midb"><p class="goodsDetail">'+isExitsVariable(list.mallOrderlist.sellerAccountName)+'</p></div></div></li>                                    ';
	   html+='                    		<li style="width: 58%;"><div class="mida"><div class="midb">                                                                                      ';
	   html+='                    			<div class="copyContract">                                                                                                                      ';
	   for(var k=0;k<sellerContractList.length;k++){
		   html+=' <a href="/file_server/mall/generalFileDownload?fileAttachmentId='+sellerContractList[k].attachmentId+'" title="'+sellerContractList[k].attachmentName+'">'+sellerContractList[k].attachmentName+'</a>';
	   }
	   html+='                    			</div>                                                                                                                                          ';
	   html+='                    		</div></div></li>                                                                                                                                   ';
	   html+='                    		<li style="width: 22%;"><div class="mida"><div class="midb">                                                                                      ';
	   html+='	                       <div class="sure-btn mb10">                                                                                                                          ';
	   if(sellerContractList.length>=1){
	      html+='	                       	    	<span class="download" id="downloadZIPSeller">批量下载</span>                                                                                                          ';
	    }
	   html+='	                       </div>                                                                                                                                               ';
	   html+='                    		</div></div></li>                                                                                                                                   ';
	   html+='                        </ul>                                                                                                                                                ';
	   html+='                    	<ul class="information compact downloadInformation" style="height:120px">                                                                           ';
	   html+='                    		<li style="width: 20%;"><div class="mida"><div class="midb"><p class="goodsDetail"><p>'+isExitsVariable(list.mallOrderlist.buyerMobile)+'</p><p>'+isExitsVariable(list.mallOrderlist.buyerAccountName)+'</p></p></div></div></li>               ';
	   html+='                    		<li style="width: 58%;"><div class="mida"><div class="midb">                                                                       ';
	   html+='                    			<div class="copyContract">                                                                                                       ';
	   for(var k=0;k<buyerContractList.length;k++){
		   html+=' <a  href="/file_server/mall/generalFileDownload?fileAttachmentId='+buyerContractList[k].attachmentId+'" title="'+buyerContractList[k].attachmentName+'">'+buyerContractList[k].attachmentName+'</a>';
	   }
	   html+='                    			</div>                                                                                                                                          ';
	   html+='                    		</div></div></li>                                                                                                                                   ';
	   html+='                    		<li style="width: 22%;"><div class="mida"><div class="midb">                                                                     ';
	   html+='	                       <div class="sure-btn mb10">                                                                                                                          ';
	   if(buyerContractList.length>=1){
		   html+='	                       	    	<span class="download" id="downloadZIPBuyer">批量下载</span>                                                                                                          ';
	   }
	   html+='	                       </div>                                                                                                                                               ';
	   html+='                    		</div></div></li>                                                                                                                                   ';
	   html+='                        </ul>                                                                                                                                                ';
	   html+='                    	</div>                                                                                                                                                  ';
	   $(".mallOrderList").html(html);

	   queryEnquire();
	   postUtil.call("/mallSellerOffer/detail", {"offerId" :offerId}, function (result) {
			renderUserInfos(result);
			renderOfferInfo(result);
			renderSkuInfo(result.offerDetail);
			renderCustomSkuInfo(result.offerDetail);
			renderPriceArea(result.offerDetail);
			renderDetailInfo(result.offerDetail);
			renderOtherOfferList(result.otherOfferList);
           //渲染单位控制小数位数
           renderUnitDisplay();
		});
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


var htmlFile="";

var attachemntFileList = [];

$(document).on("click","#downloadZIPSeller",function(){
	    var param={};
	    param.orderId=orderId;
	    param.sellerAccountId=sellerAccountId;
	    postUtil.call(apiUrl.queryMallOrderContractUploadLog, param, function (result) {
	    	var attachmentIds=result.attachmentIds;
	    	var queryParams={};
	    	  queryParams.fileAttachmentIds=attachmentIds;
	    	   postUtil.submit("/file_server/mall/generalFileZIPDownload", queryParams, function (result1) {
	 	      });
	    });
})

$(document).on("click","#downloadZIPBuyer",function(){
	    var param={};
	    param.orderId=orderId;
	    param.buyerAccountId=buyerAccountId;
	    postUtil.call(apiUrl.queryMallOrderContractUploadLog, param, function (result) {
	    	var attachmentIds=result.attachmentIds;
	    	var queryParams={};
	    	  queryParams.fileAttachmentIds=attachmentIds;
	    	   postUtil.submit("/file_server/mall/generalFileZIPDownload", queryParams, function (result1) {
	 	      });
	    });
})

function assembleAttachment(fileObjList) {
	var htmlFile = "";
	for (var i = 0; i < fileObjList.length; i++) {
	var attachmentFileId = fileObjList[i].MALL_FILE_ATTACHMENT_ID;
	var attachmentFileName = fileObjList[i].MALL_FILE_NAME;
	var attachmentFileRealPath = fileObjList[i].MALL_FILE_REAL_PATH;
	var attachmentFile = {};
	attachmentFile.attachmentId = attachmentFileId;
	attachmentFile.attachmentName = attachmentFileName;
	attachemntFileList.push(attachmentFile);
   }
}
