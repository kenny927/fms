function getSellerOfferTableTitle(data){
	var offerList = data.offerList;
	var isNeedAddDistributotButton = true;
	for(var j=0;j<offerList.length;j++){
		if(offerList[j].status=='TRANSFERED'){ //如果有一个报价单已经转订单，不需要添加分销商按钮
			isNeedAddDistributotButton =false;
			break;
		}
	}
	var html ='<div class="roleDescription orderDescription">'+
			  		'<ol class="th">'+
			  			'<li>用户名: <span>'+(data.userName||'--')+'</span></li>'+
			  			'<li>手机号: <span>'+(data.buyerMobile||'--')+'</span></li>'+
			  			'<li>公司名称: <span>'+(data.buyerAccountName||'--')+'</span></li>'+
			  			'<li>专属客户经理: <span>'+(data.accountManagerName||'--')+' '+(data.mobile||'--')+'</span></li>'+
			  			'<li>关联委托单: <span>'+(data.demandId||'--')+'</span></li>'+
			  			'<li>关联询价单: <span>'+(data.enquireId||'--')+'</span></li>'+
			  			'<li style="line-height:52px;" >报价方式: <span class="c-f">'+(data.offerModeName||'--')+'</span></li>';
	if(isNeedAddDistributotButton){
		html+='<li style="line-height:56px;"><button class="form-btn layui-btn-small2" onclick="addDistributor(this,\''+data.enquireId+'\')">+添加分销商</button></li>';
	}
		html+=	  	'</ol>'+
			  	'</div>';
	return html;
}

function addDistributor(thiz,enquireId){
    currentEnquireId=enquireId;
    sellerAccountIdArray = new Array();    
    $.each($(thiz).parents('.table').find('.information-list'),function(index,element){
    	sellerAccountIdArray.push($(element).find("li").eq(2).children().first().children().first().text());
    });
	
    chooseDistributor();
}

function chooseDistributor() {
    layer.open({
        title:"请选择分销商",
        type: 2,
        area: ['900px', '450px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/systemAccount/chooseDistributorPage'
    });
}

//选择分销商的回调方法
function chooseDistributorCallback(distributorList) {
    if(distributorList) {
        var param={};
        param.enquireId = currentEnquireId;
        param.distributorList = [];
        var choosedDistributorList =[];
        $.each(distributorList, function (index, item) {
           var distributor = {};
            distributor.distributorId = item.accountId;
            distributor.distributorName = item.accountName;
            param.distributorList.push(distributor);
            $.each(sellerAccountIdArray,function(i,element){
            	if(item.accountId==element){
            		choosedDistributorList.push(item.accountName);
            	}
            });
        });
        if(choosedDistributorList.length>0){
        	var name='';
        	for(var i=0;i<choosedDistributorList.length;i++){
        		name+=choosedDistributorList[i];
        		if(i<choosedDistributorList.length-1){
        			name+='，';
        		}
        	}
        	layer.msg("以下分销商已经选择了，不能重复选择："+name, {icon:5});
        	return false;
        }
        postUtil.call("/mallOrder/buyerEnquireService/addOffer", {"jsonData":JSON.stringify(param)}, function (res) {
            if(res.STATUS == "SUCCESS") {
                layer.msg("新增分销商成功", {icon:6},function(){
                	postUtil.submit('/mallSellerOffer/offerListPage',{currentPage:_currentPage},null);
                	layer.closeAll();
                });
            } else {
                layer.msg(res.MSG, {icon:5});
            }
        });
    }
    return false;
}

function closeSellerOffer(offerId){
    //关闭委托单弹出层
	layer.open({
	  title: '操作提示',
	  skin: 'myskin',
	  area: ['450px', '280px'],
	  btnAlign: 'c',
	  content: '<p style="text-align: center;margin-top: 50px;">是否关闭报价单：<span style="color:#fd4800">'+offerId+'</span></p>',
	  btn: ['确认关闭', '取消'],
	  yes: function(index, layero){
	    //关闭委托单的回调
	    layer.close(index);
	  },btn2: function(index, layero){
	    //取消的回调
	  },
	  cancel: function(){ 
	    //右上角关闭回调
	  }
	});

}

function getSellerOfferTableHead(data){	
	var html =  '<ul class="th">'+
					'<li style="width:9%;"><div class="mida"><div class="midb">城市</div></div></li>'+
					'<li style="width:18%;"><div class="mida"><div class="midb">公司名称</div></div></li>'+
					'<li style="display:none!important"><div class="mida"><div class="midb">公司名称ID</div></div></li>'+
					'<li style="width:18%;"><div class="mida"><div class="midb">报价单编号</div></div></li>'+
					'<li style="width:13%;"><div class="mida"><div class="midb">接单状态</div></div></li>'+
					'<li style="width:13%;"><div class="mida"><div class="midb">报价单状态</div></div></li>'+
					'<li style="width:11%;"><div class="mida"><div class="midb">报价发送状态</div></div></li>'+
					'<li style="width:18%"><div class="mida"><div class="midb">报价总金额</div></div></li>'+
				'</ul>'
	return html;
}

function sendSellerOfferToBuyer(offerId){
	postUtil.call("/mallSellerOffer/sendToBuyer", {offerId:offerId}, function (result) {
		if(result.SUCCESS){
 			layer.open({
   			  title: '操作提示',
   			  skin: 'myskin',
   			  area: ['350px', '280px'],
   			  btnAlign: 'c',
   			  content: '<p style="text-align: center;margin-top: 50px;">已经成功发送给工程商<span style="color:#fd4800"></span></p>',
   			  btn: ['确认'],
   			  yes: function(index, layero){
   			    postUtil.submit("/mallSellerOffer/offerListPage",null);
   			  },
   			  cancel: function(){ 
   			    //右上角关闭回调
   				postUtil.submit("/mallSellerOffer/offerListPage",null);
   			  }
   			});
		}
	});
}

function viewSellerOfferDetail(offerId){
	postUtil.submit('/mallSellerOffer/offerDetailPage',{offerId:offerId});
}

function askForOfferAgain(offerId,enquireId,sellerAccountName){
	
	layer.open({
		  title: '请求再次报价',
		  skin: 'myskin1',
		  area: ['450px', '280px'],
		  btnAlign: 'c',
		  content: '<p style="text-align: center;margin-top: 10px;">是否请求<span style="color:#fd4800">'+sellerAccountName+'</span></p>'
		  +'<p style="text-align: center;margin-top: 10px;">为询单：<span style="color:#fd4800">'+enquireId+'</span></p>'
		  +'<p style="text-align: center;margin-top: 10px;">进行报价？</p>',
		  btn: ['确认', '取消'],
		  yes: function(index, layero){
			  postUtil.call("/mallSellerOffer/askForOfferAgain",{offerId:offerId},function(result){
				  if(result.SUCCESS==true){
					  postUtil.submit('/mallSellerOffer/offerListPage',{currentPage:_currentPage},null);
					  layer.close(index);
				  }else{
					  alert(result.MSG);
				  }
			  });

		  },btn2: function(index, layero){
		    //取消的回调
		  },
		  cancel: function(){ 
		    //右上角关闭回调
		  }
		});
	
}
function getSellerOfferTableData(data){
	
	var htmlTemp='<p class="c-2">'+data.isSellerAcceptYetName+'</p>'+
	'<p class="c-9">'+(data.sellerAcceptTime?moment(data.sellerAcceptTime).format("YYYY-MM-DD HH:mm:ss"):'')+'</p>';
	if(data.isSellerAcceptYet=='DENY'){
		htmlTemp+='<button class="btn-click fz12 mt10" onclick="javascript:askForOfferAgain(\''+data.offerId+'\',\''+data.enquireId+'\',\''+data.sellerAccountName+'\');">请求再次报价</button>';
	}
	var html = '<div class="information-list" style="border-right:none;">'+
					'<ul class="information informationList80">'+
						'<li style="width:9%;"><div class="mida"><div class="midb">'+(data.province||'')+'</div></div></li>'+
						'<li style="width:18%;"><div class="mida"><div class="midb">'+ (data.sellerAccountName||'') +'</div></div></li>'+
						'<li style="display:none!important"><div class="mida"><div class="midb">'+ (data.sellerAccountId||'') +'</div></div></li>'+
						'<li style="width:18%;"><div class="mida"><div class="midb">'+ data.offerId+'</div></div></li>'+
						'<li style="width:13%;"><div class="mida"><div class="midb">'+
						 htmlTemp+ //接单状态
						'</div></div></li>'+
						'<li style="width:13%;"><div class="mida"><div class="midb">';
	if(data.status=='OFFERED'){  //报价单状态
		html  +=			'<p class="c-g fw-b">'+data.statusName+'</p>'+
							'<p class="c-g fw-b">'+(data.sendToPlatformTime?moment(data.sendToPlatformTime).format("YYYY-MM-DD HH:mm:ss"):'')+'</p>';

	}else{
		html +=				'<p class="c-2">'+data.statusName+'</p>'+
							'<p class="c-2">'+(data.updateTime?moment(data.updateTime).format("YYYY-MM-DD HH:mm:ss"):'')+'</p>';
	}
		html +=			'</div></div></li>'+//报价发送状态
						'<li style="width:11%;"><div class="mida"><div class="midb">'+
							'<p class="c-2">'+(data.isSendToBuyerYetName||'')+'</p>';
	if(data.isSellerAcceptYet=='ACCEPTED' && data.status=='OFFERED'){
		if(data.isSendToBuyerYet=='NOT_SEND'){
			html += 			'<button class="btn-click fz12 mt10" onclick="javascript:sendSellerOfferToBuyer(\''+data.offerId+'\');">发送给工程商</button>';
		}else{
			html +=				'<p class="c-9">'+moment(data.sendToBuyerTime).format("YYYY-MM-DD HH:mm:ss")+'</p>';
		}
	}
		html +=			'</div></div></li>'+  //报价总金额
						'<li style="width:18%;"><div class="mida"><div class="midb">'+
							'<p class="c-f fw-b">'+(data.totalOfferAmount?data.totalOfferAmount.toFixed(2):'')+'</p>';
	if((data.status=='OFFERED'||data.status=='TRANSFERED')&& data.totalOfferAmount){
		html += 			'<button class="btn-click fz12 mt10" onclick="javascript:viewSellerOfferDetail(\''+data.offerId+'\');">查看报价</button>';
	}
		html +=			'</div></div></li>'+
					'</ul>'+
				'</div>'
				
	return html;
}

function renderSellerOfferList(data){
	var content = '<div class="table">#{var}</div>';
	var html='';
	for(var i=0;i<data.length;i++){
		var rowData = getSellerOfferTableTitle(data[i])+getSellerOfferTableHead(data[i]);
		var offerList = data[i].offerList;
		for(var j=0;j<offerList.length;j++){
			rowData += getSellerOfferTableData(offerList[j]);
		}
		html+=content.replace("#{var}",rowData);
	}
	$('#offerList').html(html);
}

