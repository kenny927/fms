function save(){
	if(status=="PAYMENT_CONFIRM"){
		//待付款审核节点只能更改收获人信息
		var param ={
			details:getTableData(),
			orderSalesId:orderSalesId,
			orderSalesContractId:$('input[name=orderSalesContractId]').val(),
			consignee:window.pageConfig.receiptMan,
			consigneePhone:window.pageConfig.receiptManPhone,
			consigneeAddress:window.pageConfig.funllAddress
		};
		layer.load();
		postUtil.call('/order/saveOrderDetailInfo',param,function(resp){
			layer.closeAll('loading');
			if(resp.STATUS=='SUCCESS'){
				layer.msg('保存成功',{icon:6});
			}else{
				layer.msg(resp.MSG,{icon:5});
			}
		});
	}else{
		var param ={
			details:getTableData(),
			orderSalesId:orderSalesId,
			consignee:window.pageConfig.receiptMan,
			consigneePhone:window.pageConfig.receiptManPhone,
			consigneeAddress:window.pageConfig.funllAddress
		}
		layer.load();
		postUtil.call('/order/saveOrderDetailInfo',param,function(resp){
			layer.closeAll('loading');
			if(resp.STATUS=='SUCCESS'){
				layer.msg('保存成功',{icon:6});
			}else{
				layer.msg(resp.MSG,{icon:5});
			}
		});
	}
}

function getTableData(){
	var tableData=new Array();
	var trArray = $('#skuInfo tbody').children();
	$.each(trArray,function(index,element){
		tableData[index]= new Array();
		var tdArray = $(element).children()
		$.each(tdArray,function(td_index,item){
			var input = $(item).find('input');
			if(input.length>0){
				 var name =$(input).attr("name");
				 tableData[index][name]=$(input).val();
			}else if($(item).find('textarea').length>0){
				 var name =$(item).find('textarea').attr("name");
				 tableData[index][name]=$(item).find('textarea').val();
			}else{
				 var name =$(item).attr("name");
				 tableData[index][name]=$(item).text();
			}
		});
	});
	var orderlist = new Array();
	$.each(tableData, function(i, item){  
		var order ={}; 
		order.orderSalesDetailId = item.orderSalesDetailId;
		order.supplierAccountId = item.supplierAccountId;
		order.quantity = parseFloat(item.quantity);
		order.approveUnitPrice = parseFloat(item.unitPrice);
		order.purchasePrice = parseFloat(item.purchasePrice);
		order.purchaseApproveUnitPrice = order.purchasePrice;
		order.purchaseAmount = parseFloat(item.purchaseAmount);
		order.demand = item.demand;
		if(order.demand){
			order.demand = order.demand.replace(/\s/g,""); //去除空格
			order.demand = order.demand.replace("\n",""); //去除换行
		}
		
		order.expenseAmount = parseFloat(item.expenseAmount);
		order.expensePurchaseAmount = 0;
		order.remark = item.remark;
		if(order.remark){
			order.remark = order.remark.replace(/\s/g,""); //去除空格
			order.remark = order.remark.replace("\n",""); //去除换行
		}
		
		orderlist.push(order);
	});
	return JSON.stringify(orderlist);
}

function audit(){
	var param ={
		details:getTableData(),
		orderSalesId:orderSalesId,
		orderSalesContractId:$('input[name=orderSalesContractId]').val(),
		consignee:window.pageConfig.receiptMan,
		consigneePhone:window.pageConfig.receiptManPhone,
		consigneeAddress:window.pageConfig.funllAddress
	};
	layer.load();
	postUtil.call('/order/saveOrderDetailInfo',param,function(resp){		
		if(resp.STATUS=='SUCCESS'){
			if(status=='PLATFORM_SALES_APPROVE'){
				if(sealSwitch=='ON'){
					//先生成合同并盖章，再审批通过
					postUtil.call('/pdf/createPDFByOrderSalesId',{orderSalesId:orderSalesId},function(res){
						if(res.STATUS=='SUCCESS'){
							postUtil.call('/order/updateSpotOrderStatus',{orderSalesId:orderSalesId,orderSalesContractId:$('input[name=orderSalesContractId]').val()},function(res){
								layer.closeAll('loading');
								if(res.STATUS=='SUCCESS'){
									layer.msg('订单通过成功，等待客户付款',{icon:6},function(){
										cardUtil.refreshCard("订单审核");
										window.location.reload();
									});
								}else{
									layer.msg(res.MSG,{icon:5});
								}
							});
						}else{
							layer.closeAll('loading');
							layer.msg('生成合同失败！',{icon:5});
						}
					});
				}else{
					postUtil.call('/order/updateSpotOrderStatus',{orderSalesId:orderSalesId,orderSalesContractId:$('input[name=orderSalesContractId]').val()},function(res){
						layer.closeAll('loading');
						if(res.STATUS=='SUCCESS'){
							layer.msg('订单通过成功，等待客户付款！',{icon:6},function(){
								cardUtil.refreshCard("订单审核");
								window.location.reload();
							});
						}else{
							layer.msg('审批失败！原因：'+res.msg,{icon:5});
						}
					});
				}
			}else if (status=='GATHERING_CONFIRM')
			{
                postUtil.call('/order/updateOrderStatusToDeliveryConfirm',{orderSalesId:orderSalesId},function(res) {

                    if(res.STATUS=='SUCCESS'){
                        //生成采购订单。
                        postUtil.call('/order/genSpotPurchaseOrder',{orderSalesId:orderSalesId,orderSalesContractId:$('input[name=orderSalesContractId]').val()},function(res){
                            layer.closeAll('loading');
                            if(res.STATUS=='SUCCESS'){
                                layer.msg('付款审核通过，等待发货！',{icon:6},function(){
                                    cardUtil.refreshCard("订单审核");
                                    window.location.reload();
                                });
                            }else{
                                layer.msg('审批失败！原因：'+res.MSG,{icon:5});
                            }
                        });
                    }else{
                        layer.msg('审批失败！原因：'+res.msg,{icon:5});
                    }

                });

			}else if(status=='PAYMENT_CONFIRM'){

                /**
				 * 更改订单状态为 待收款确认
                 */

                if(param["orderSalesContractId"]==null||param["orderSalesContractId"]=="")
				{
                    layer.msg('请填写合同编号',{icon:5});
                    layer.closeAll('loading');
					return false;
				}
                postUtil.call('/order/updateOrderStatusToGatheringConfirm',{orderSalesId:orderSalesId,"orderSalesContractId":param["orderSalesContractId"]},function(res){
                    layer.closeAll('loading');
                    if(res.STATUS=='SUCCESS'){

                        layer.closeAll('loading');
                        cardUtil.refreshCard("订单审核");
                        //window.location.reload();
                        window.location='/order/detail/principal?orderSalesId='+orderSalesId
                    }else{
                        layer.msg('审批失败！原因：'+res.msg,{icon:5});
                    }
                });
			}
		}else{
			layer.closeAll('loading');
			layer.msg(resp.MSG,{icon:5});
		}
	});
}

function discardOrderSales(){
    $.get('/order/detail/discardPage', {orderSalesId:orderSalesId}, function(str){
        layer.open({
            title: '审核提示',
            skin: 'msgskin',
            area: "400px",
            btnAlign: 'c',
            content: str,
            btn: ['确定', '取消'],
            yes: function(index, layero){
            	var discardReason = $('#discardReason').val();
            	if(!discardReason){
            		layer.tips('请填写作废原因！','#discardReason');
            		return false;
            	}
            	var param ={
                		orderSalesId:orderSalesId,
                		discardReason:discardReason,
                		status:status	
            	}
            	layer.load();
            	postUtil.call('/order/discard',param ,function(res){
					if(res.STATUS=='SUCCESS'){
						layer.msg('该订单已经作废！',{icon:6},function(){
							cardUtil.refreshCard("订单审核");
							window.location.reload();
						});
					}else{
						layer.msg('作废失败，原因：'+res.MSG,{icon:5});
					}
                    layer.closeAll('loading');
				});
            	
            },btn2: function(index, layero){
                //取消的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    });
}

function watchAttachments() {
	layer.open({
        title: "附件列表",
        type: 2,
        area: ['745px','400px'],
        content: '/order/attachList?orderSalesId=' + orderSalesId,
        btn : [ '关闭' ],
        yes : function(index, layero) {
        	layer.close(index);
        } ,
	   cancel : function() {
	   
	   }
    });
}

function openDeliveryDetailTab(orderSalesId) {
    cardUtil.closeCard("发货详情-" + orderSalesId);
    cardUtil.openCard("发货详情-" + orderSalesId, "/orderLog/page4S?orderSalesId=" + orderSalesId);
    cardUtil.changeCard("发货详情-" + orderSalesId);
}

function openPreSendShoppingInstruction(orderSalesId)
{
    cardUtil.closeCard("制作发货指令-" + orderSalesId);
    cardUtil.openCard("制作发货指令-" + orderSalesId, "/sendShoppingInstruction/preSendShoppingInstruction?orderId=" + orderSalesId);
    cardUtil.changeCard("制作发货指令-" + orderSalesId);
}