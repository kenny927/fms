/**
 * Created by hevenzheng on 2017/2/13.
 */
function queryBuyerEnquireList(currentPage) {
        if(!currentPage) {
            currentPage = 1;
        }
        var pageSize = 5;
        var status = $('input[name="status"]:checked ').val();
        var queryParam = {};
        queryParam.status= status;
        queryParam.currentPage=currentPage;
        queryParam.pageSize=pageSize;
        postUtil.call(apiUrl.queryBuyerEnquireList, queryParam, function (result) {
            if (result.STATUS == "SUCCESS") {
                var data = result.data;
                var total = data.total;
                var page=Math.ceil(total/pageSize);
                bindEnquireData(data);
                laypage({
                    cont: 'paginationDiv',
                    pages: page,
                    curr: currentPage,
                    skip: true,
                    total: total,
                    jump: function (obj, first) {
                        if (!first) {
                            queryBuyerEnquireList(obj.curr);
                        }
                    }
                });
            } else {
                alert(result.MSG);
            }
        });
    }

function bindEnquireData(data) {
    var list = data.list;
    var listHtml = "";
    $.each(list, function (index, item) {
        listHtml += buildListHtml(item);
    });
    $("#enquireList").empty();
    $("#enquireList").html(listHtml);

    //渲染单位控制小数位数
    renderUnitDisplay();
}

function buildListHtml(data) {
    var html = '<div class="roleDescription orderDescription">';
    html += '<ol style="background-color: #f0f0f0;color: #222222;">';
    html += '<li><span>账号：'+(data.mobile||'--')+'</span></li>';
    html += '<li><span>公司名称：'+(data.accountName||'--')+'</span></li>';
    html += '<li><span>联系人：'+(data.contactsName||'--')+'&nbsp;'+(data.contactsMobileOrFixedPhoneNumber||'--')+'</span></li>';
    // html += '<li><span>联系电话：'+(data.contactsMobileOrFixedPhoneNumber||'')+'</span></li>';
    var expectDeliveryDate = "";
    if(data.expectDeliveryDate) {
        expectDeliveryDate = moment(data.expectDeliveryDate).format("YYYY-MM-DD");
    }
    html += '<li><span>期望交期：<span style="color: #FF0000;font-weight: 600;">'+expectDeliveryDate+'</span></span></li>';
    html += '<li><span>询价单编号：'+data.enquireId+'</span></li>';
    html += '<li><span>关联委托单：'+(data.demandId||'--')+'</span></li>';
    html += '<li><span>询价生成时间：'+moment(data.createTime).format("YYYY-MM-DD HH:mm:ss")+'</span></li>';
    html += '<li><span>专属客户经理：'+(data.accountManagerName||'--')+' '+(data.accountManagerMobile||'--')+'</span></li>';
    html += '</ol>';
    // html +='<span style="position: absolute;right: 2%;top: 13px;font-size: 12px ! important;">期望交期：<span style="color: #FF0000;font-weight: 600;">'+moment(data.expectDeliveryDate).format("YYYY-MM-DD")+'</span></span>';
    // if(data.status == "WAIT_PROCESS") {
    //     html +='<a class="close btn-close" href="javascript:;" enquireId="'+data.enquireId+'">关闭询单</a>';
    //     // html += '<li style="width:25%;text-align: right;"><div class="mida"><div class="midb"><a class="close" enquireId="'+data.enquireId+'" href="javascript:;">关闭询单</a></div></div></li>';
    // }

    html += '<table class="layui-table pop table-css" lay-skin="line">';
    html += '<colgroup>';
    html += '<col  width="150">';
    html += '<col  width="120">';
    html += '<col  width="100">';
    html += '<col  width="300">';
    html += '<col  width="280">';
    html += '<col  width="280">';
    html += '<col  width="100">';
    html += '<col  width="120">';
    html += '<col  width="200">';
    html += '</colgroup>';
    html += '<tbody>';
    html += '<tr>';
    html += '<td>商品类型</td>';
    html += '<td>商品编码</td>';
    html += '<td>品牌</td>';
    html += '<td>商品名称</td>';
    html += '<td>商品型号</td>';
    html += '<td>描述</td>';
    html += '<td>数量</td>';
    html += '<td>计量单位</td>';
    html += '<td>询单状态</td>';
    html += '</tr>';
    
    
//    html += '    <ul class="th" style="background-color: white;">';
//    html += '    <li style="width: 8%;"><div class="mida"><div class="midb">商品类型</div></div></li>';
//    html += '    <li style="width: 8%;"><div class="mida"><div class="midb">商品编码</div></div></li>';
//    html += '    <li style="width: 10%;"><div class="mida"><div class="midb">商品型号</div></div></li>';
//    html += '     <li style="width: 7%;"><div class="mida"><div class="midb">品牌</div></div></li>';
//    html += '    <li style="width: 20%;"><div class="mida"><div class="midb">商品名称</div></div></li>';
//    html += '    <li style="width: 20%;"><div class="mida"><div class="midb">描述</div></div></li>';
//    html += '    <li style="width: 8%;"><div class="mida"><div class="midb">数量</div></div></li>';
//    html += '    <li style="width: 7%;"><div class="mida"><div class="midb">计量单位</div></div></li>';
//    html += '   <li style="width: 12%;"><div class="mida"><div class="midb">询单状态</div></div></li>';
//    html += '    </ul>';

//    html += '    <div class="information-list information-right">';

    //生成商品列表
    // console.log(data.details)
    html +=buildProductList(data);

//    html += '<div class="inquiryStatus">';
   
    	html += ' </tr>';
    html += ' </tbody>';
    	html += '</table> ';   

    return html;
}

function buildProductList(data) {
	var details=data.details;
    //绑定商品列表
    var html = "";
    var length=details.length;   
    var count=0;
    $.each(details, function(index, item){
    	count++;
//        html +='<ul class="information informationList70" style="width: 88%;"">';
//        html += '    <li style="width: 9%;"><div class="mida"><div class="midb">'+item.skuTypeDisplay+'</div></div></li>';
//        html += '    <li style="width: 9%;"><div class="mida"><div class="midb">'+(item.skuId||'')+'</div></div></li>';
//        html += '    <li style="width: 11%;"><div class="mida"><div class="midb two-row" title="'+(item.skuMode||'')+'">'+(item.skuMode||'')+'</div></div></li>';
//        html += '    <li style="width: 9%;"><div class="mida"><div class="midb two-row" title="'+item.skuBrandName+'">'+item.skuBrandName+'</div></div></li>';
//        html += '    <li style="width: 23%;"><div class="mida"><div class="midb two-row" title="'+item.skuName+'">'+item.skuName+'</div></div></li>';
//        html += '    <li style="width: 22%;"><div class="mida"><div class="midb two-row" style="width:200px;" title="'+item.remark+'">'+item.remark+'</div></div></li>';
//        html += '    <li style="width: 9%;"><div class="mida"><div class="midb">'+item.skuQuantity.toFixed(2)+'</div></div></li>';
//        html += '    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.skuUnitName+'</div></div></li>';
//        html += '   </ul>';
 
    	html += ' <tr>';
    	html += '    <td>'+item.skuTypeDisplay+'</td>';
    	html += '    <td>'+(item.skuId||'')+'</td>';
    	html += '    <td>'+item.skuBrandName+'</td>';
    	html += '    <td>'+item.skuName+'</td>';
    	html += '    <td>'+(item.skuMode||'')+'</td>';
    	html += '    <td>'+item.remark+'</td>';
    	html += '    <td class="unitCheck unitDisplay" unitName="'+item.skuUnitName+'">'+item.skuQuantity.toFixed(3)+'</td>';
    	html += '    <td>'+item.skuUnitName+'</td>';
    	if(count==1){
    		html += '    <td rowspan="'+length+'" style="border-left: 1px solid #e6e6e6;">';
    		 html += '    <p class="fz12 c-2" id="status'+data.enquireId+'">'+data.statusDisplay+'</p>';
    		    if(data.status != "WAIT_PROCESS") {
    		        html += '    <p class="fz12 c-9" id="updateTime'+data.enquireId+'">'+moment(data.updateTime).format("YYYY-MM-DD HH:mm:ss")+'</p>';
    		    } else {
    		        html += '    <p class="fz12 c-9" id="updateTime'+data.enquireId+'"></p>';

    		    }
    		    if(data.status == "WAIT_PROCESS") {
    		        html += '<button class="btn-click fz12 mt10  goEdit" enquireId="'+data.enquireId+'">选择分销商</button><br />';
    		    } else {
    		        html += '<button class="btn-click fz12 mt10 goDetail" enquireId="'+data.enquireId+'">查看详情</button><br />';
    		        if(data.status == "OFFERED_PRICE") {
                        html += '<button class="btn-click fz12 mt10 addOffer" enquireId="'+data.enquireId+'">增加分销商</button><br />';
                    }
    		    }
    		    if(data.status == "WAIT_PROCESS") {
    		        html += '<button class="btn-click fz12 mt10 close" enquireId="'+data.enquireId+'">关闭询单</button><br />';
    		        // html +='<a class="close btn-close fz12 mt10" href="javascript:;" enquireId="'+data.enquireId+'">关闭询单</a>';
    		    }
//    		    html += '    </div>';
//    		    html += '   </div>';
//    		    html += '    </div>';
    		    html += ' </td>';
    	}else{
    		//html += '    <td></td>';
    	}
    });
    return html;
}

function initLayer() {
    //关闭询价单弹出层
    layui.use('layer', function(){
        var layer = layui.layer;
        $(document).off("click", ".close");
        $(document).on("click", ".close", function () {
            var enquireId = $(this).attr("enquireId");
            var obj = $(this);
            layer.open({
                title: '操作提示',
                skin: 'myskin',
                area: ['450px', '280px'],
                btnAlign: 'c',
                content: '<p style="text-align: center;margin-top: 50px;">是否关闭询价单：<span style="">'+enquireId+'</span></p>',
                btn: ['确认关闭', '取消'],
                yes: function(index, layero){
                    //关闭
                    layer.close(index);
                    //关闭委托单的回调
                    postUtil.call(apiUrl.closeBuyerEnquire, {"enquireId" : enquireId}, function (result) {
                        var msg = "";
                        if (result.STATUS == "SUCCESS") {
                            msg = '关闭询价单成功！';
                        } else {
                            msg = result.MSG;
                        }
                        var content = '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin-top: 30px;font-size:16px;color:#222222">'+msg+'</p>';
                        updateAfterClose(result, obj);
                        layer.open({
                            title: '操作结果',
                            skin: 'youskin',
                            area: ['480px', '300px'],
                            btnAlign: 'c',
                            content: content,
                            btn: ['我知道了'],
                            yes: function(index1, layero){
                                //关闭
                                layer.close(index1);
                            },
                            cancel: function(){
                                //右上角关闭回调
                            }
                        });
                    });
                },btn2: function(index, layero){
                    //取消的回调
                },
                cancel: function(){
                    //右上角关闭回调
                }
            });
        });
    });
}

function updateAfterClose(result, obj) {
    if(!result.STATUS == "SUCCESS") {
        return;
    }
    obj.remove();
    $("#status"+result.data.enquireId).text("已关闭");
    $("#updateTime"+result.data.enquireId).text(moment(result.data.updateTime).format("YYYY-MM-DD HH:mm"));

}
