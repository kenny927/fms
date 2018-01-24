/**
 * Created by hevenzheng on 2017/2/13.
 */
//全局变量定义

//商品列表
var productDetails = [];
// var customDetails = [];
// var rowNum = 0;
var customRowNum = 0;
var _userId="";
var _accountInfo={};
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

function bindAccountInfo(data) {
	_userId=data.userId;
	_accountInfo=data;
	var sexCname=isExitsVariable(data.sexCname)
//    var html = '<ul>';
//    html += '<li>';
//    html += '	<p class="fz12 fz12"><label>账号：'+isExitsVariable(data.mobile)+'</label><label style="margin-left:200px;">专属客户经理：'+isExitsVariable(data.accountManagerName)+'</label></p>';
//    html += '   <p class="fz12">姓名：'+isExitsVariable(data.linkman)+'</p>';
//    html += '	<p class="fz12">邮箱：'+isExitsVariable(data.email)+'</p>';
//    html += '	<p class="fz12">公司名称：'+isExitsVariable(data.accountName)+'</p>';
//    html += '	<p class="fz12">来源：'+isExitsVariable(data.accountResourceCname)+'</p>';
//    html += '	<p class="fz12">注册时间：'+isExitsVariable(data.createDate)+'</p>';
//    html += '</li>';
//    html += '</ul>';
	  var html = '<table  class="layui-table pop table-css table-style">';
	  html += '<colgroup>';
	  html += '<col  width="100">';
	  html += '<col  width="400">';
	  html += '<col  width="100">';
	  html += '<col  width="400">';
	  html += '</colgroup>';
	  html += '<tbody>';
	  html += '<tr>';
	  html += '<td bgcolor="#f0f0f0" align="right">账号</td>';
	  html += '<td align="left">'+isExitsVariable(data.mobile)+'</td>';
	  html += '<td bgcolor="#f0f0f0" align="right">专属客户经理</td>';
	  html += '<td align="left">'+isExitsVariable(data.accountManagerName)+'</td>';
	  html += '</tr>';
	  html += '<tr>';
	  html += '<td bgcolor="#f0f0f0" align="right">姓名</td>';
	  html += '<td align="left">'+isExitsVariable(data.linkman)+'</td>';
	  html += '<td bgcolor="#f0f0f0" align="right">邮箱</td>';
	  html += '<td align="left">'+isExitsVariable(data.email)+'</td>';
	  html += '</tr>';
	  html += '<tr>';
	  html += '<td bgcolor="#f0f0f0" align="right">公司名称</td>';
	  html += '<td align="left">'+isExitsVariable(data.accountName)+'</td>';
	  html += '<td bgcolor="#f0f0f0" align="right">来源</td>';
	  html += '<td align="left">'+isExitsVariable(data.accountResourceCname)+'</td>';
	  html += '</tr>';
	  html += '<tr>';
	  html += '<td bgcolor="#f0f0f0" align="right">注册时间</td>';
	  html += '<td colspan="3" align="left">'+isExitsVariable(data.createDate)+'</td>';
	  html += '</tr>';
	  html += '</tbody>';
	  html += '</table>';
    $("#accountInfo").empty();
    $("#accountInfo").html(html);
}
//<table  class="layui-table pop table-css table-style">
//<colgroup>
//  <col  width="100">
//  <col  width="400">
//  <col  width="100">
//  <col  width="400">
//</colgroup>
//<tbody>
//   <tr>
//    <td bgcolor="#f0f0f0">联想中心机房</td>
//    <td>联想中心机房</td>
//    <td bgcolor="#f0f0f0">联想中心机房</td>
//    <td>联想中心机房</td>
//   </tr>
//</tbody>
//</table>

function queryEnquire() {
    }

  

    function bindDemandData(demandId) {
        postUtil.call(apiUrl.getVagueDemandDetail, {"demandId" : demandId}, function (result) {
            if (result.STATUS == "SUCCESS") {
                var data = result.MSG;
                setDemandInfo(data);

            } else {
                alert(result.MSG);
            }
        });
    }

    function setDemandInfo(demand) {
        setValueByType("#demandId", demand.demandId, "text");
        setValueByType("#statusName", demand.statusName, "text");
        setValueByType("#contactsName", demand.contactsName, "text");
        setValueByType("#contactsMobileOrFixedPhoneNumber", demand.contactsMobileOrFixedPhoneNumber, "text");
        setValueByType("#demandProjectAddress", demand.projectProvince+"/"+demand.projectCity, "text");
        setValueByType("#demandExpectDeliveryTime", moment(demand.expectDeliveryTime).format("YYYY-MM-DD"), "text");
        setValueByType("#demandDescribe", demand.demandDescribe, "text");

        //生成附件列表
        if(demand.attachments.length > 0) {
            var html = '<ul>';
            $.each(demand.attachments, function (index, item) {
                html += '<li><a href="/file_server/mall/generalFileDownload?fileAttachmentId='+item.attachmentId+'">'+item.attachmentName+'</a></li>';
            });
            html +='</ul>';
            $("#attachments").append(html);
        }

    }

    function bindEnquireData(buyerEnquire) {
        $("#enquireId").text(enquireId);

        //绑定商品列表
        buildProductList(buyerEnquire.details, buyerEnquire.customDetails);

        //绑定基本信息
        bindEnquireBaseInfo(buyerEnquire);

        //渲染单位配置控制小数位数
        renderUnitDisplay();
    }

    function setValueByType(selector, value, type) {
        var obj = $(selector);
        if(!obj) {
            return;
        }
        if(type == "val") {
            obj.val(value);
        } else if(type == "text") {
            obj.text(value);
        } else if(type == "html") {
            obj.html(value);
        }
    }

    function bindEnquireBaseInfo(buyerEnquire) {
        setValueByType("#createTime", moment(buyerEnquire.createTime).format("YYYY-MM-DD HH:mm:ss"), "text");
        setValueByType("#statusDisplay", buyerEnquire.statusDisplay, "text");
        setValueByType("#updateTime", moment(buyerEnquire.updateTime).format("YYYY-MM-DD HH:mm:ss"), "text");
        setValueByType("#expectDeliveryDate", moment(buyerEnquire.expectDeliveryDate).format("YYYY-MM-DD"), "text");
        setValueByType("#offerModeDisplay", buyerEnquire.offerModeDisplay, "text");
        if(edit) {
            setRadioCheck("deliveryMode", buyerEnquire.deliveryMode, "#deliveryModeRemark", (buyerEnquire.deliveryModeRemark||''));
        } else {
            setValueByType("#deliveryModeDisplay", buyerEnquire.deliveryModeDisplay+' '+(buyerEnquire.deliveryModeRemark||''), "text");
        }

        setValueByType("#projectAddress", buyerEnquire.projectAddress, "text");
        setValueByType("#consignee", buyerEnquire.consignee, "text");
        setValueByType("#consigneeMobile", buyerEnquire.consigneeMobile, "text");
        setValueByType("#consigneeAddress", buyerEnquire.consigneeAddress, "text");

        if(edit) {
            if(buyerEnquire.payMode == "CASH_ON_DELIVERY") {
                setRadioCheck("payMode", buyerEnquire.payMode, "#payModeRemark2", buyerEnquire.payModeRemark);
            } else if(buyerEnquire.payMode == "DEPOSIT"){
                setRadioCheck("payMode", buyerEnquire.payMode, "#payModeRemark1", buyerEnquire.payModeRemark);
            } else {
                setRadioCheck("payMode", buyerEnquire.payMode);
            }

        } else {
            if(buyerEnquire.payMode == "CASH_ON_DELIVERY") {
                var htmlPart = '货到<span class="data-important">'+buyerEnquire.payModeRemark+'</span>后付款';
                $("#payModeDisplay").append(htmlPart);
            } else if(buyerEnquire.payMode == "DEPOSIT"){
                var htmlPart = '订金支付<span class="data-important">'+buyerEnquire.payModeRemark+'</span>%';
                $("#payModeDisplay").append(htmlPart);
            } else {
                setValueByType("#payModeDisplay", buyerEnquire.payModeDisplay, "text");
            }
        }

        if(edit) {
            setRadioCheck("isNeedInvoice", buyerEnquire.isNeedInvoice);
        } else {
            if(buyerEnquire.isNeedInvoice=="Y") {
                setValueByType("#invoiceInfo", buyerEnquire.isNeedInvoiceDisplay+'(增值税专用发票)', "text");
            } else {
                setValueByType("#invoiceInfo", buyerEnquire.isNeedInvoiceDisplay, "text");
            }
        }

        setValueByType("#remark", buyerEnquire.remark, "text");

        if(buyerEnquire.status == "WAIT_PROCESS") {
            setValueByType("#close", '<a href="javascript:;">关闭此询价单</a>', "html");
        }

    }
    
    function setRadioCheck(radioName, value, remarkSelector, remarkValue) {
        $.each($("input:radio[name="+radioName+"]"), function (index, item) {
            if(value == $(item).val()) {
                $(item).attr('checked', true);
            }
        });
        if(remarkSelector) {
            $(remarkSelector).val(remarkValue);
        }
    }

    function buildProductList(details, customDetails) {
        //绑定商品列表
        var html = "";
        if(edit) {
            $.each(details, function(index, item){
                html +='<ul class="information informationList compact" id="ul_product_row_'+item.skuId+'">';
                html +='   <li style="width: 6%;" ><div class="mida"><div class="midb"><p>'+item.skuId+'</p></div></div></li>';
                html +='    <li style="width: 15%;" ><div class="mida"><div class="midb"><p>'+item.skuMode+'</p></div></div></li>';
                html +='    <li style="width: 7%;" ><div class="mida"><div class="midb"><p>'+item.skuBrandName+'</p></div></div></li>';
                html +='    <li style="width: 26%;" ><div class="mida"><div class="midb"><p>'+item.skuName+'</p></div></div></li>';
                html +='    <li style="width: 26%;" ><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品描述" id="productRemark_'+item.skuId+'" value="'+item.remark+'">'+item.remark+'</textarea></div></div></li>';
                html +='   <li style="width: 8%;" ><div class="mida"><div class="midb"><input class="fz12 t-c unitCheck unitDisplay" unitName="'+item.skuUnitName+'" style="width:80%; border: none;" type="text" placeholder="请输入数量" id="productQuantity_'+item.skuId+'" value="'+item.skuQuantity.toFixed(2)+'"/></div></div></li>';
                html +='   <li style="width: 7%;" ><div class="mida"><div class="midb"><p>'+item.skuUnitName+'</p></div></div></li>';
                if(edit) {
                    html +='   <li style="width: 5%;border-right: none;"><div class="mida"><div class="midb"><a href="javascript:removeProduct(\''+item.skuId+'\');">删除</a></div></div></li>';
                }
                html +='</ul>';
                // rowNum++;
                var product = {};
                product.skuId = item.skuId;
                product.model = item.skuMode;
                product.skuName = item.skuName;
                product.brandId = item.skuBrandId;
                product.brandName = item.skuBrandName;
                product.unitId = item.skuUnitId;
                product.unitName = item.skuUnitName;
                product.classifyId = item.classifyId;
                product.classifyName = item.classifyName;
                productDetails.push(product);

            });
            $("#enquireProductList").html(html);
            //自定义商品
            var customHtml = "";
            if(customDetails) {
                $.each(customDetails, function(index, item){
                    customHtml +='<ul class="information informationList compact" id="ul_custom_row_'+customRowNum+'">';
                    customHtml +='    <li style="width: 18%;" name="skuMode"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品型号" value="'+item.skuMode+'" id="customMode_'+index+'">'+item.skuMode+'</textarea></div></div></li>';
                    customHtml +='    <li style="width: 10%;" name="skuBrandName"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入品牌" value="'+item.skuBrandName+'" id="customSkuBrandName_'+index+'">'+item.skuBrandName+'</textarea></div></div></li>';
                    customHtml +='    <li style="width: 23%;" name="skuName"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品名称" value="'+item.skuName+'" id="customSkuName_'+index+'">'+item.skuName+'</textarea></div></div></li>';
                    customHtml +='    <li style="width: 21%;" name="remark"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入描述" value="'+item.remark+'" id="customRemark_'+index+'">'+item.remark+'</textarea></div></div></li>';
                    customHtml +='   <li style="width: 8%;" name="skuQuantity"><div class="mida"><div class="midb"><input class="fz12 t-c num3" style="width: 80%; border: none;" type="text" placeholder="请输入数量" value="'+item.skuQuantity.toFixed(2)+'" id="customSkuQuantity_'+index+'"/></div></div></li>';
                    customHtml +='   <li style="width: 11%;" name="skuUnitName"><div class="mida"><div class="midb"><input class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入计量单位" value="'+item.skuUnitName+'" id="customSkuUnitName_'+index+'"/></div></div></li>';
                    if(edit) {
                        customHtml +='   <li style="width: 9%;border-right: none;"><div class="mida"><div class="midb"><a href="javascript:removeCustomProduct(\''+customRowNum+'\');">删除</a></div></div></li>';
                    }
                    customHtml +='</ul>';
                    customRowNum++;
                });
            }
            $("#enquireCustomProductList").html(customHtml);
        } else {
            $.each(details, function(index, item){
                html +='<ul class="information informationList">';
                html +='    <li style="width: 9%;"><div class="mida"><div class="midb">平台商品</div></div></li>';
                html +='   <li style="width: 11%;"><div class="mida"><div class="midb"><p>'+(item.skuId||'')+'</p></div></div></li>';
                html +='    <li style="width: 10%;"><div class="mida"><div class="midb">'+item.skuMode+'</div></div></li>';
                html +='    <li style="width: 10%;"><div class="mida"><div class="midb">'+item.skuBrandName+'</div></div></li>';
                html +='    <li style="width: 23%;"><div class="mida"><div class="midb"><p>'+item.skuName+'</p></div></div></li>';
                html +='    <li style="width: 23%;"><div class="mida"><div class="midb"><p>'+item.remark+'</p></div></div></li>';
                html +='   <li style="width: 7%;"><div class="mida"><div class="midb unitDisplay" unitName="'+item.skuUnitName+'">'+item.skuQuantity.toFixed(2)+'</div></div></li>';
                html +='   <li style="width: 7%;"><div class="mida"><div class="midb">'+item.skuUnitName+'</div></div></li>';
                html +='</ul>';
            });
            //自定义商品
            if(customDetails) {
                $.each(customDetails, function(index, item){
                    html +='<ul class="information informationList">';
                    html +='    <li style="width: 9%;"><div class="mida"><div class="midb">自定义商品</div></div></li>';
                    html +='   <li style="width: 11%;"><div class="mida"><div class="midb"><p>'+(item.skuId||'')+'</p></div></div></li>';
                    html +='    <li style="width: 10%;"><div class="mida"><div class="midb">'+(item.skuMode||'')+'</div></div></li>';
                    html +='    <li style="width: 10%;"><div class="mida"><div class="midb">'+item.skuBrandName+'</div></div></li>';
                    html +='    <li style="width: 23%;"><div class="mida"><div class="midb"><p>'+item.skuName+'</p></div></div></li>';
                    html +='    <li style="width: 23%;"><div class="mida"><div class="midb"><p>'+item.remark+'</p></div></div></li>';
                    html +='   <li style="width: 7%;"><div class="mida"><div class="midb">'+item.skuQuantity.toFixed(2)+'</div></div></li>';
                    html +='   <li style="width: 7%;"><div class="mida"><div class="midb">'+item.skuUnitName+'</div></div></li>';
                    html +='</ul>';
                });
            }
            $("#enquireProductList").html(html);
        }

    }

    function bindSellerOffer(sellerOffer) {
        if(!sellerOffer || sellerOffer.length == 0) {
            return;
        }
        var html = "";
        if(edit) {
            // $.each(sellerOffer, function(index, item){
            //     html += '<ul class="information informationList">';
            //     html +='    <li style="width: 2%;"><div class="mida"><div class="midb"><input name="selectedDistributor" type="checkbox" value="'+item.accountId+'" accountName="'+item.sellerAccountName+'"></div></div></li>';
            //     html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.areaName+'</div></div></li>';
            //     html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.province+'</div></div></li>';
            //     html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.city+'</div></div></li>';
            //     html +='    <li style="width: 18%;"><div class="mida"><div class="midb">'+item.sellerAccountName+'</div></div></li>';
            //     html +='    </ul>';
            // });
        } else {
            $.each(sellerOffer, function(index, item){
                html += '<ul class="information informationList">';
                html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.areaName+'</div></div></li>';
                html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.province+'</div></div></li>';
                html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.city+'</div></div></li>';
                html +='    <li style="width: 18%;"><div class="mida"><div class="midb">'+item.sellerAccountName+'</div></div></li>';
                html +='    </ul>';
            });
        }

        $("#sellerOfferList").html(html);
    }

    //关闭询价单弹出层
    layui.use('layer', function(){
        var layer = layui.layer;
        $("#close").click(function(){
            layer.open({
                title: '操作提示',
                skin: 'myskin',
                area: ['450px', '280px'],
                btnAlign: 'c',
                content: '<p style="text-align: center;margin-top: 50px;">是否关闭询单：<span style="color:#fd4800">'+enquireId+'</span></p>',
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
                                if(result.STATUS == "SUCCESS") {
                                    postUtil.submit("/mallOrder/buyerEnquireService/list");
                                }
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

//选择sku商品的回调方法
function chooseSkuCommodityCallback(skuDataList) {
    if(skuDataList) {
        var html = "";
        $.each(skuDataList, function (index, sku) {
            var isExist = false;
            $.each(productDetails, function (idx, item) {
                if(item.skuId == sku.skuId) {
                    isExist = true;
                    return false;
                }
            });
            if(!isExist) {
                // html +='<ul class="information informationList compact" id="prod'+rowNum+'">';
                // html +='   <li style="width: 6%;" name="skuId"><div class="mida"><div class="midb"><p class="c-h">'+(sku.skuId||'')+'</p></div></div></li>';
                // html +='    <li style="width: 15%;" name="skuMode"><div class="mida"><div class="midb"><p>'+sku.model+'</p></div></div></li>';
                // html +='    <li style="width: 10%;" name="skuBrandName"><div class="mida"><div class="midb"><p>'+sku.brandName+'</p></div></div></li>';
                // html +='    <li style="width: 23%;" name="skuName"><div class="mida"><div class="midb"><p><a href="/detail?skuId='+sku.skuId+'">'+sku.skuName+'</a></p></div></div></li>';
                // html +='    <li style="width: 23%;" name="remark"><div class="mida"><div class="midb"><input class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品描述" /></div></div></li>';
                // html +='   <li style="width: 8%;" name="skuQuantity"><div class="mida"><div class="midb"><input class="fz12 t-c" style="width:80%; border: none;" type="text" placeholder="请输入数量" /></div></div></li>';
                // html +='   <li style="width: 6%;" name="skuUnitName"><div class="mida"><div class="midb"><p>'+sku.unitName+'</p></div></div></li>';
                // html +='   <li style="width: 9%;border-right: none;"><div class="mida"><div class="midb"><a href="javascript:removeProduct(\'prod'+rowNum+'\');">删除</a></div></div></li>';
                // html +='</ul>';
                var row = rendRow(sku);
                var table = document.getElementById("enquireProductList");
                table.appendChild(row);
                // rowNum++;
                var product = {};
                product.skuId = sku.skuId;
                product.model = sku.model;
                product.skuName = sku.skuName;
                product.brandId = sku.brandId;
                product.brandName = sku.brandName;
                product.unitId = sku.unitId;
                product.unitName = sku.unitName;
                product.classifyId = sku.classifyId;
                product.classifyName = sku.classifyName;
                productDetails.push(product);
            }
        });
        // if(html != "") {
        //     $("#enquireProductList").append(html);
        // }
    }
    return true;

}

function rendRow(sku) {
    var ul = document.createElement('ul');
    ul.setAttribute("class", "information informationList compact");
    ul.setAttribute("id", "ul_product_row_" + sku.skuId);

    ul.appendChild(renderSkuCell("skuId", sku.skuId, "width:6%;"));
    ul.appendChild(renderSkuCell(null, sku.model, "width:15%;"));
    ul.appendChild(renderSkuCell(null, sku.brandName, "width:7%;"));
    ul.appendChild(renderSkuCell(null, sku.skuName, "width:26%;"));
    ul.appendChild(renderSkuCell("remark", sku, "width:26%;"));
    ul.appendChild(renderSkuCell("skuQuantity", sku, "width:8%;"));
    ul.appendChild(renderSkuCell(null, sku.unitName, "width:7%;"));
    ul.appendChild(renderSkuCell("operation", sku, "width:5%;border-right: none;"));
    return ul;
}


function renderSkuCell(name, value, style) {

    var li = document.createElement('li');
    li.setAttribute("style", style);

    var div_mida = document.createElement('div');
    div_mida.setAttribute("class", "mida");
    var div_midb = document.createElement('div');
    div_midb.setAttribute("class", "midb");
    //个性化差异-操作区域
    if ("operation" == name) {
        div_midb.innerHTML = '<p><a href="javascript:void(0);" onclick="removeProduct(\''+value.skuId+'\')">删除</a></p>';
    } else if ("remark" == name) {
        div_midb.innerHTML = '<input type="text" class="fz12 t-c" style="width: 80%; border: none;" maxlength="100" id="productRemark_' + value.skuId + '"  placeholder="请输入商品描述"/>';
    } else if ("skuQuantity" == name) {
        div_midb.innerHTML = '<input type="text" class="fz12 t-c unitCheck unitDisplay" unitName="'+value.unitName+'" style="width: 80%; border: none;" id="productQuantity_' + value.skuId + '"  placeholder="请输入数量"/>';
    } else if ("skuId" == name) {
        div_midb.innerHTML = '<p>'+value+'</p>';
    } else {
        var p = document.createElement('p');
        p.innerText = value;
        div_midb.appendChild(p);
    }
    div_mida.appendChild(div_midb);
    li.appendChild(div_mida);
    return li;
}

function rendCustomSkuRow(rowData) {
    // html += '<ul class="information informationList">';
    // html +='    <li style="width: 2%;"><div class="mida"><div class="midb"><input name="selectedDistributor" type="checkbox" value="'+item.accountId+'" accountName="'+item.sellerAccountName+'"></div></div></li>';
    // html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.areaName+'</div></div></li>';
    // html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.province+'</div></div></li>';
    // html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.city+'</div></div></li>';
    // html +='    <li style="width: 18%;"><div class="mida"><div class="midb">'+item.sellerAccountName+'</div></div></li>';
    // html +='    </ul>';
    var ul = document.createElement('ul');
    ul.setAttribute("class", "information informationList compact");
    ul.setAttribute("id", "ul_custom_row_" + sku.skuId);

    ul.appendChild(renderSkuCell(null, sku.skuId, "width:6%;"));
    ul.appendChild(renderSkuCell(null, sku.model, "width:15%;"));
    ul.appendChild(renderSkuCell(null, sku.brandName, "width:7%;"));
    ul.appendChild(renderSkuCell(null, sku.skuName, "width:26%;"));
    ul.appendChild(renderSkuCell("remark", sku, "width:26%;"));
    ul.appendChild(renderSkuCell("skuQuantity", sku, "width:8%;"));
    ul.appendChild(renderSkuCell(null, sku.unitName, "width:7%;"));
    return ul;
}

function rendCustomSkuCell(name, value, style, placeholder) {
    var li = document.createElement('li');
    li.setAttribute("style", style);
    li.setAttribute("name", name);

    var div_mida = document.createElement('div');
    div_mida.setAttribute("class", "mida");
    var div_midb = document.createElement('div');
    div_midb.setAttribute("class", "midb");
    //个性化差异-操作区域
    div_midb.innerHTML = '<input type="text" class="fz12 t-c" style="width: 80%; border: none;" placeholder="'+placeholder+'"/>';

    div_mida.appendChild(div_midb);
    li.appendChild(div_mida);
    return li;
}

function addProduct() {
    layer.open({
        title:"请选择SKU",
        type: 2,
        area: ['1000px', '550px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/skuCommodity/chooseSkuCommodityForMallClassifyPage'
    });
}

function addCustomProduct() {
    var customHtml ='<ul class="information informationList compact" id="ul_custom_row_'+customRowNum+'">';
    customHtml +='    <li style="width: 18%;" name="skuMode"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品型号" /></div></div></li>';
    customHtml +='    <li style="width: 10%;" name="skuBrandName"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入品牌" /></div></div></li>';
    customHtml +='    <li style="width: 23%;" name="skuName"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入商品名称" /></div></div></li>';
    customHtml +='    <li style="width: 21%;" name="remark"><div class="mida"><div class="midb"><textarea class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入描述" /></div></div></li>';
    customHtml +='   <li style="width: 8%;" name="skuQuantity"><div class="mida"><div class="midb"><input class="fz12 t-c num3" style="width: 80%; border: none;" type="text" placeholder="请输入数量" /></div></div></li>';
    customHtml +='   <li style="width: 11%;" name="skuUnitName"><div class="mida"><div class="midb"><input class="fz12 t-c" style="width: 80%; border: none;" type="text" placeholder="请输入计量单位" /></div></div></li>';
    customHtml +='   <li style="width: 9%;border-right: none;"><div class="mida"><div class="midb"><a href="javascript:removeCustomProduct(\''+customRowNum+'\');">删除</a></div></div></li>';
    customHtml +='</ul>';
    $("#enquireCustomProductList").append(customHtml);
    customRowNum++;
}

function removeProduct(skuId) {
    $.each(productDetails, function (index, item) {
        if(skuId == item.skuId) {
            productDetails.splice(index, 1);
            return false;
        }
    });
    $("#ul_product_row_"+skuId).remove();
    // $("#"+rowId).remove();
    // rowNum--;

}

function removeCustomProduct(rowId) {
    $("#ul_custom_row_"+rowId).remove();
    customRowNum--;
}

$(document).on("click","#submitBtn",function(){
    if(doValidation(true)) {
        doSubmit(true);
    }
});

$(document).on("click","#backBtn",function(){
	 postUtil.submit('/mallOrder/buyerEnquireService/list');
});


$(document).on("click","#selectAll",function(){
    var checkStatus = $("#selectAll").is(':checked');

    $('input:checkbox[name="selectedDistributor"]').each(function() {
        this.checked = checkStatus;
        // $(this).attr('checked', checkStatus);
    });
});

$(document).on("click","input:radio[name='payMode']",function(){
    var value = $(this).val();
    if(value=="DEPOSIT" && $.trim($("#payModeRemark1").val()) == "") {
        $("#payModeRemark1").val(30);
    }
    if(value!="DEPOSIT") {
        $("#payModeRemark1").val('');
    }
    if(value!="CASH_ON_DELIVERY") {
        $("#payModeRemark2").val('');
    }
});

$(document).on("click","input:radio[name='deliveryMode']",function(){
    var value = $(this).val();
    if(value!="OTHER") {
        $("#deliveryModeRemark").val('');
    }
});

function doValidation(isSubmit) {
    var isPass = true;
    var msg = "";
    var errorCount=0;
    //平台商品和自定义商品不能都为空
    //自定义商品列表
    var customDetails = [];
    $.each($("#enquireCustomProductList ul"), function (index, item) {
        var customProduct = {};
        $.each(item.children, function (idx, itemLi) {
            var value = $(itemLi).find("input").val();
            var textAreaValue = $(itemLi).find("textarea").val();
            if($(itemLi).attr("name") == "skuMode") {
                customProduct.customerSkuModel = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuBrandName") {
                customProduct.customerSkuBrandName = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuName") {
                customProduct.customerSkuName = textAreaValue;
            }
            if($(itemLi).attr("name") == "remark") {
                customProduct.customerSkuDescribe = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuQuantity") {
                customProduct.customerSkuQuantity = value;
            }
            if($(itemLi).attr("name") == "skuUnitName") {
                customProduct.customerSkuUnitName = value;
            }
        });
        customDetails.push(customProduct);
    });

    if(productDetails.length == 0 && customDetails.length == 0) {
        layer.msg('商城商品和自定义商品不能都为空', {icon: 5});
        return false;
    }

    //平台商品校验
    //数量不能为空
    //描述长度不能超过100
    //数量为数字
    if(productDetails.length>0) {
        var productMsg = "";
        $.each(productDetails, function (index, item) {
            var productPass = true;
            var productRowMsg = '商城商品【' + item.skuId + '】';
            var remark = $("#productRemark_" + item.skuId).val();
            // if ($.trim(remark) == "") {
            //     productRowMsg += '描述不能为空;';
            //     productPass = false;
            // } else
            if ($.trim(remark) != "" && $.trim(remark).length > 100) {
                productRowMsg += '描述长度不能为超过100;';
                productPass = false;
            } else {
                productDetails[index].skuDescribe = remark;
            }
            var quantity = $.trim($("#productQuantity_" + item.skuId).val());
            if (quantity == "") {
                productRowMsg += '数量不能为空;';
                productPass = false;
            } else if (!$.isNumeric(quantity)) {
                productRowMsg += '数量必须为数字;';
                productPass = false;
            } else {
                if(parseFloat(quantity)<0) {
                    productRowMsg += '数量必须为正数;';
                    productPass = false;
                } else {
                    var x = Math.floor(parseFloat(quantity) * 100) / 100;
                    productDetails[index].skuQuantity = x;
                }
            }
            productRowMsg += '<br>';
            if(!productPass) {
                productMsg += productRowMsg;
            }
        });
        if(productMsg != "") {
            msg += productMsg;
            isPass = false;
        }
    }

    //自定义商品校验
    //所有栏位必填(除商品型号和描述)
    //长度限制
    //数量为数字
    if(customDetails.length > 0) {
        var customMsg = "";
        $.each(customDetails, function (index, item) {
            var customPass = true;
            var customRowMsg = '自定义商品第【' + (index+1) + '】行';

            // if($.trim(item.customerSkuModel) == "") {
            //     customRowMsg += '商品型号不能为空;';
            //     customPass = false;
            // }
            if($.trim(item.customerSkuBrandName) == "") {
                customRowMsg += '品牌不能为空;';
                customPass = false;
            }
            if($.trim(item.customerSkuName) == "") {
                customRowMsg += '商品名称不能为空;';
                customPass = false;
            }
            // if($.trim(item.customerSkuDescribe) == "") {
            //     customRowMsg += '描述不能为空;';
            //     customPass = false;
            // }
            var quantity = $.trim(item.customerSkuQuantity);
            if(quantity == "") {
                customRowMsg += '数量不能为空;';
                customPass = false;
            } else if(!$.isNumeric(quantity)) {
                customRowMsg += '数量必须为数字;';
                customPass = false;
            } else {
                if(parseFloat(quantity)<0) {
                    customRowMsg += '数量必须为正数;';
                    customPass = false;
                }
            }
            if($.trim(item.customerSkuUnitName) == "") {
                customRowMsg += '计量单位不能为空;';
                customPass = false;
            }
            customRowMsg += '<br>';
            if(!customPass) {
                customMsg += customRowMsg;
            }
        });
        if(customMsg != "") {
            msg += customMsg;
            isPass = false;
        }
    }
   if(_userId==null||$.trim(_userId) == ""){
	    errorCount++;
	  	 msg += "<"+errorCount+">请选择工程商";
	  	if(errorCount%3==0){
	  		msg+="</br>";
	  	}
	      isPass = false;
   }
    
    
    var expectDeliveryTime = $('#enquire_expectDeliveryTime').val(); 
    if($.trim(expectDeliveryTime) == "") {
    	errorCount++;
    	 msg += "<"+errorCount+">请选择期望交期";
    	if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    if($.trim(_province) == "") {
    	errorCount++;
        msg += "<"+errorCount+">选择项目地省份";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    if($.trim(_city) == "") {
    	errorCount++;
        msg += "<"+errorCount+">请选择项目地市";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    //基本信息校验
    //配送方式选择其他时备注必填
    var deliveryMode = $('input[name="deliveryMode"]:checked ').val();
    if($.trim(deliveryMode) == "") {
    	errorCount++;
        msg += "<"+errorCount+">请选择配送方式";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }else if(deliveryMode == "OTHER" && $.trim($("#deliveryModeRemark").val()) == "") {
    	errorCount++;
        msg += "<"+errorCount+">配送方式选择【其他】时请输入具体配送方式";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    var consigneeMobile=$('#consigneeMobile').val();
    if($.trim(consigneeMobile) != ""){
    	 var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
    	    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
    		if(!reg1.test(consigneeMobile)&&!reg2.test(consigneeMobile)){ 
    			errorCount++;
    			 msg += "<"+errorCount+">请输入正确的收货人 电话";
    			 if(errorCount%3==0){
    		    		msg+="</br>";
    		    	}
    		        isPass = false;
    		}
    }
    //结算方式选择订金支付或货到付款时备注必填
    var payMode = $('input[name="payMode"]:checked ').val();
    if($.trim(payMode) == "") {
    	errorCount++;
        msg += "<"+errorCount+">请选择支付方式";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }else if(payMode == "DEPOSIT") {
        var remark = $.trim($("#payModeRemark1").val());
        if(remark == "") {
        	errorCount++;
            msg += "<"+errorCount+">支付方式选择【订金支付】时请输入支付比例";
            if(errorCount%3==0){
        		msg+="</br>";
        	}
            isPass = false;
        } else {
            if(!$.isNumeric(remark) || parseFloat(remark) > 100 || parseFloat(remark) <= 0) {
            	errorCount++;
                msg += "<"+errorCount+">支付比例必须为数字且不能大于100不能为负数";
                if(errorCount%3==0){
            		msg+="</br>";
            	}
                isPass = false;
            }
        }

    } else  if(payMode == "CASH_ON_DELIVERY") {
        var remark = $.trim($("#payModeRemark2").val());
        if(remark == "") {
        	errorCount++;
            msg += "<"+errorCount+">支付方式选择【货到付款】时请输入天数";
            if(errorCount%3==0){
        		msg+="</br>";
        	}
            isPass = false;
        } else {
            if(!$.isNumeric(remark)||!(/^[0-9]+$/).test(remark) ) {
            	errorCount++;
                msg += "<"+errorCount+">货到付款天数必须为数字";
                if(errorCount%3==0){
            		msg+="</br>";
            	}
                isPass = false;
            }
        }
    }
    var isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val(); 
    if($.trim(isNeedInvoice) == "") {
    	errorCount++;
        msg += "<"+errorCount+">请选择是否开票";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    var remark=$("#remark").val();
    if($.trim(remark) != ""&&remark.length>=201){
    	errorCount++;
        msg += "<"+errorCount+">备注长度不超过200";
        if(errorCount%3==0){
    		msg+="</br>";
    	}
        isPass = false;
    }
    
    if(!isPass) {
        layer.open({
            title: '数据填写有误',
            icon: 5,
            skin: 'youskin',
            area: ['550px', '300px'],
            btnAlign: 'c',
            content: msg,
            btn: ['我知道了'],
            yes: function(index1, layero){
                //关闭
                layer.close(index1);
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    return isPass;

}


function doSubmit(isSubmit) {
    var param = {};
    param.deliveryMode = $('input[name="deliveryMode"]:checked ').val();
    if(param.deliveryMode == "OTHER") {
        param.deliveryModeRemark = $("#deliveryModeRemark").val();
    }

    param.payMode = $('input[name="payMode"]:checked ').val();
    if(param.payMode == "DEPOSIT") {
        param.payModeRemark = $("#payModeRemark1").val();
    } else if(param.payMode == "CASH_ON_DELIVERY") {
        param.payModeRemark = $("#payModeRemark2").val();
    }
    param.isNeedInvoice = $('input[name="isNeedInvoice"]:checked ').val();
    param.remark = $("#remark").val();

    var expectDeliveryTime = $('#enquire_expectDeliveryTime').val();
    var consignee = $('#consignee').val();
    var consigneeAddress = $('#consigneeAddress').val();
    var consigneeMobile = $('#consigneeMobile').val();
    param.expectDeliveryTime=expectDeliveryTime;
    param.projectProvince =_province;
    param.projectCity = _city;
    param.consignee = consignee;
    param.consigneeAddress = consigneeAddress;
    param.consigneeMobile = consigneeMobile;
    //自定义商品列表
    var customDetails = [];
    $.each($("#enquireCustomProductList ul"), function (index, item) {
        var customProduct = {};
        $.each(item.children, function (idx, itemLi) {
            var value = $(itemLi).find("input").val();
            var textAreaValue = $(itemLi).find("textarea").val();
            if($(itemLi).attr("name") == "skuMode") {
                customProduct.customerSkuModel = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuBrandName") {
                customProduct.customerSkuBrandName = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuName") {
                customProduct.customerSkuName = textAreaValue;
            }
            if($(itemLi).attr("name") == "remark") {
                customProduct.customerSkuDescribe = textAreaValue;
            }
            if($(itemLi).attr("name") == "skuQuantity") {
                var x = Math.floor(parseFloat(value) * 100) / 100;
                customProduct.customerSkuQuantity = x;
            }
            if($(itemLi).attr("name") == "skuUnitName") {
                customProduct.customerSkuUnitName = value;
            }
        });
        customDetails.push(customProduct);
    });
    param.skuDataList = productDetails;
    param.customerSkuDataList = customDetails;
    param.isSubmit = isSubmit;
    param.buyerUserId=_accountInfo.userId;
    param.contactsName=_accountInfo.userRealName;
    param.contactsMobileOrFixedPhoneNumber=_accountInfo.mobile;
    param.offerMode="PLATFORM";
    param.buyerAccountId=_accountInfo.accountId;
    param.buyerAccountName=_accountInfo.accountName;
    param.buyerAccountManagerId=_accountInfo.accountManagerId;
    param.buyerAccountManagerName=_accountInfo.accountManagerName;
    if(isSubmit) {
        var distributorList = [];
        $.each($('input:checkbox[name="selectedDistributor"]:checked'),function (index, item) {
            var distributor = {};
            distributor.distributorId = $(item).val();
            distributor.distributorName = $(item).attr("accountName");
            distributorList.push(distributor);
        });
        param.distributorList = distributorList;
    }
    param.dealSign="ForOther";
    postUtil.call("/mallOrder/buyerEnquireService/genBuyerEnquireInfo", {"jsonData" : JSON.stringify(param)}, function (result) {
        /*if (result.STATUS == "SUCCESS") {
            if(isSubmit) {//如果提交则调用提交controller
                postUtil.call("/mallOrder/buyerEnquireService/submit", {"jsonData" : JSON.stringify(param)}, function (res) {
                    if (res.STATUS == "SUCCESS") {
                        
                    } else {
                        alert(res.MSG);
                    }
                });
            } else {
                layer.msg("保存成功", {icon: 6});
            }
        } else {
            alert(result.MSG);
        }*/
    	if (result.STATUS == "SUCCESS") {
    		layer.msg("生成询单成功", {icon: 6});
    		layer.open({
                title: '操作提示',
                skin: 'youskin',
                area: ['480px', '300px'],
                btnAlign: 'c',
                content: '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin-top: 30px;font-size:16px;color:#222222">生成询价单成功！</p>'
            });
    		setTimeout("postUtil.submit('/mallOrder/buyerEnquireService/list')", 3000);
    	}else{
    		layer.msg("生成询单失败", {icon: 6});
    	}
    });

    console.log(param);

}

function chooseDistributor() {
    layer.open({
        title:"请选择分销商",
        type: 2,
        area: ['1000px', '500px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/systemAccount/chooseDistributorPage'
    });
}

//选择分销商的回调方法
function chooseDistributorCallback(distributorList) {
    if(distributorList) {
        var html = "";
        $.each(distributorList, function (index, item) {
            var isExist = false;
            $.each($('input:checkbox[name="selectedDistributor"]'), function (idx, sellerOffer) {
                if(item.accountId == $(sellerOffer).val()) {
                    isExist = true;
                    return true;
                }
            });
            if(isExist) {
                return true;
            }
            html += '<ul class="information informationList">';
            html +='    <li style="width: 4%;"><div class="mida"><div class="midb"><input name="selectedDistributor" type="checkbox" checked value="'+item.accountId+'" accountName="'+item.accountName+'"></div></div></li>';
            html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.accountAreaName+'</div></div></li>';
            html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.province+'</div></div></li>';
            html +='    <li style="width: 8%;"><div class="mida"><div class="midb">'+item.city+'</div></div></li>';
            html +='    <li style="width: 18%;"><div class="mida"><div class="midb">'+item.accountName+'</div></div></li>';
            html +='    </ul>';
        });
    }
    $("#sellerOfferList").append(html);
    $("#selectAll").attr("checked",'checked');
    return true;
}


function backChooseSystemAccountRecordCallback(data){
	bindAccountInfo(data);
}

$(document).on("click", ".chooseSystemAccount", function () {
    layer.open({
        title: '请选择工程商',
        skin: 'msgskin',
        area: ['900px', '496px'],
        type: 2,
        content: ['/systemAccount/preSystemAccountlist','no'],
    })
	
})


