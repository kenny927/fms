/**
 * Created by hevenzheng on 2017/3/9.
 */
    layui.use(['form', 'tree','layer'], function () {
        //加载获取数据
        var layer = layui.layer;
        var form = layui.form();
        var $ = layui.jquery;
        $form = $($('.form-css')[0]);
        vm = new Vue({
            el: "#editSku",
            data: {
                queryParam: {
                    classifyId: '',
                    mallClassifyId: '',
                    classifyName: '',
                    mallClassifyName: '',
                    skuName:'',
                    propertyList:[]
                },
                type:type,
                storages:[],
                skuId:skuId,
                treeShowMallEdit: false,
                treeShowEdit: false,
            },
            created: function () {
                if(this.type!='INSERT'){
                    this.showData();
                }else {
                    this.skuBrand("");
                    this.skuUnit("");
                }
                this.treeList('#fxTreeEdit', '/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree', 'classifyId', 'classifyName', 'treeShowEdit');
                this.treeList('#mallTreeEdit', '/reusable/mallClassificatory/getAllMallClassificatoryJsonForLayuiTree', 'mallClassifyId', 'mallClassifyName', 'treeShowMallEdit');
            },
            methods: {
                showData:function () {
                    postUtil.call("/sku/detail",{skuId: this.skuId}, function (res) {
                        if(res.STATUS == "SUCCESS") {
                            var data = res.data;
                            console.log(data);
                            vm.queryParam = data;
                            rendPage(vm.queryParam)
                            if(vm.type=='COPY'){
                            vm.queryParam.skuId="";
                            }
                            vm.skuBrand(vm.queryParam.brandId);
                            vm.skuUnit(vm.queryParam.unitId);
                            if(vm.type=='UPDATE'){
                                vm.skuStorage();
                            }
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                    });

                },
                skuBrand:function (brandId) {
                    postUtil.call('/reusable/skuBrand/allBrandJsonData', null, function (result) {
                        var opts;
                        for(var i=0;i<result.length;i++){
                            if(brandId==result[i].brandId){
                                opts += " <option value= '" + result[i].brandId + "' selected='' >" + result[i].brandChineseName + "</option>";
                            }else {
                                opts += " <option value= '" + result[i].brandId + "' >" + result[i].brandChineseName + "</option>";
                            }
                        }
                        if(vm.type=='INSERT'){
                            $form.find('select[name=brand]').find('option').eq(0).removeAttr("selected").html("");
                        }
                        $form.find('select[name=brand]').find('option').eq(0).siblings().remove();

                        $form.find('select[name=brand]').append(opts);
                        form.render();
                    });
                },
                skuUnit:function (unitId) {
                    postUtil.call('/reusable/skuUnit/skuUnitJsonData', null, function (result) {
                        var opts;
                        for(var i=0;i<result.length;i++){
                            if(unitId==result[i].unitId){
                                opts += " <option value= '" + result[i].unitId + "' selected='' >" + result[i].unitName + "</option>";
                            }else {
                                opts += " <option value= '" + result[i].unitId + "' >" + result[i].unitName + "</option>";
                            }
                        }
                        if(vm.type=='INSERT'){
                            $form.find('select[name=skuUnit]').find('option').eq(0).removeAttr("selected").html("");
                        }
                        $form.find('select[name=skuUnit]').find('option').eq(0).siblings().remove();
                        $form.find('select[name=skuUnit]').append(opts);
                        form.render();
                    });
                },
                skuStorage:function () {
                    var queryParam = {};
                    queryParam.pageSize = 30;
                    queryParam.currentPageIndex = 1;
                    queryParam.skuId = this.skuId;
                    postUtil.call("/skuStorage/listJson",queryParam, function (res) {
                            vm.storages = res.list;
                    });
                },
                dropDown: function (treeShow) {
                    this[treeShow] = !this[treeShow];
                },
                deletePropertyList: function (n) {
                    this.queryParam.propertyList.splice(n, 1);
                },
                addPropertyList:function () {
                    // if(this.queryParam.propertyList==undefined) {
                    //     this.queryParam.propertyList = new Array;
                    // }
                    this.queryParam.propertyList.push({
                        propertyName: "",
                        propertyValue: ""
                    });
                },
                treeList: function (obj, url, id, name, treeShow) {
                    var treeOption = {};
                    treeOption.skin = "shihuang";
                    treeOption.elem = obj;
                    var classifyId, allParentName;
                    treeOption.click = function (node) {
                        var classifyIsLeaf = node.classifyIsLeaf;
                        var isLeaf = node.isLeaf;
                        if (classifyIsLeaf == "1"||isLeaf=="0") {
                            classifyId = node.classifyId;
                            allParentName = node.allParentName;
                            if (classifyId == "0") {
                                allParentName = "全部";
                            }
                            vm.queryParam[id] = classifyId;
                            vm.queryParam[name] = allParentName;
                            vm[treeShow] = false;
                        } else {
                            layer.msg("请选择叶子节点", {"icon": "5"});
                        }
                    };
                    postUtil.call(url, null, function (result) {
                        treeOption.nodes = result;
                        layui.tree(treeOption);
                    });
                }
            }
        })
    })
function rendPage(data) {
    //设置SPU

    if(data.spuSkuList && data.spuSkuList.length > 0) {
        var spuSku = data.spuSkuList[0];
        var spuId = spuSku.spuId;
        html = "";
        html +='<dt class="mt10"><span class="c-f">*</span>商品SPU编码：</dt>';
        html +='<dd class="mt10">'+spuId+'</dd>';
        html +='   <dd class="mt10">';
        html +='   <div class="layui-form" style="margin-left: 120px;">';
        html +='   <table class="layui-table pop" >';
        html +='    <colgroup>';
        html +='   <col width="100">';
        html +='   <col width="450">';
        html +='    <col width="350">';
        html +='   <col width="100">';
        html +='   <col>';
        html +='   </colgroup>';
        html +='   <thead>';
        html +='  <tr>';
        html +='  <th>SKU编码</th>';
        html +='  <th>商品名称</th>';
        html +='   <th>聚合属性</th>';
        html +='   <th>操作</th>';
        html +='   </tr>';
        html +='   </thead>';
        html +='   <tbody>';
        $.each(data.spuSkuList, function (index, item) {
            if(item.skuId == skuId) {
                html +='   <tr id="spuSkuList_'+index+'" style="height: 50px;background-color: #fafad2;">';
            } else {
                html +='   <tr id="spuSkuList_'+index+'" style="height: 50px;">';
            }
            html +='   <td>'+item.skuId+'</td>';
            html +='  <td>'+item.skuName+'</td>';
            html +='<td>'+item.skuPolymerizePropertyValues+'</td>';
            if(item.skuId == skuId) {
                html +=' <td><a class="c-h" href="javascript:removeFromSpu();">从该SPU脱离</a></td>';
            } else {
                html +=' <td></td>';
            }
            html +='   </tr>';

        });
        html +='   </tbody>';
        html +='   </table>';
        html +='   </div>';
        html +='  </dd>';
        $("#spuSkuList").html(html);
    }


    //设置详情
    if(data.describeEffective == "Y") {
        descEditor.html(data.describe);
    } else {
        $("[name='describeEffective']:eq(1)").click();
    }

    if(data.qaEffective == "Y") {
        qaEditor.html(data.qa);
    } else {
        $("[name='qaEffective']:eq(1)").click();
    }

    if(data.purchaseEffective == "Y") {
        purchaseEditor.html(data.purchase);
    } else {
        $("[name='purchaseEffective']:eq(1)").click();
    }

    if(data.afterSaleEffective == "Y") {
        afterSaleEditor.html(data.afterSale);
    } else {
        $("[name='afterSaleEffective']:eq(1)").click();
    }

    if(data.downloadEffective == "Y") {
        if(data.download) {
            downloadContent = data.download;
            var downloadArr = JSON.parse(data.download);
            html = "";
            if(downloadArr && downloadArr.length > 0) {
                $.each(downloadArr, function (index, item) {
                    html += '  <dd>';
                    html += '  <span style="flex:1;">'+item.MALL_FILE_ATTACHMENT_ID+'</span>';
                    html += ' <span style="flex:2;">'+item.MALL_FILE_NAME+'</span>';
                    html += ' <span style="flex:1;"><a href="javascript:void(0);" onclick="downLoadMallAttachment(\'' + item.MALL_FILE_ATTACHMENT_ID + '\')" class="c-h">下载</a></span>';
                    html += '  </dd>';
                });
                $("#downloadContent dd").remove();
                $("#downloadContent").append(html);
            }
        }
    } else {
        $("[name='downloadEffective']:eq(1)").click();
    }

    //设置图片
    html = "";
    $.each(data.images, function (index,item) {
        html += '<li>';
        html += '<img class="skuImg" src="'+item.origUrl+'" style="width:100px;height: 100px;">';
        html += '<div class="delImg jun-del" style="position:absolute;top:-12px;left:92px;cursor:pointer;display: none;" ><img src="/res/images/del.png" alt=""></div>';
        // html += ' <label class="delImg" style="top:0px;left:90px;cursor: pointer;">X</label>';
        html += '<input type="hidden" name="origUrl" value="'+item.origUrl+'">';
        html += '<input type="hidden" name="thumbUrl" value="'+item.thumbUrl+'">';
        if(item.isMainImage == 1) {
            html += ' <label><span class="pay_list_c2 on"><input type="radio" name="isMain"  class="radioclass" checked="checked"/></span>设为主图</label>';
        } else {
            html += ' <label><span class="pay_list_c2"><input type="radio" name="isMain"  class="radioclass" /></span>设为主图</label>';
        }
        html += ' </li>';
    });
    $(".img-list").append(html);
}

function removeFromSpu() {
    postUtil.call("/sku/removeFromSpu",{skuId:skuId}, function (res) {
        if(res.STATUS == "SUCCESS") {
            layer.msg("从该SPU脱离成功",{icon:6})
            postUtil.submit("/sku/goEdit", {skuId:skuId});
        } else {
            layer.msg("从该SPU脱离失败",{icon:5})
        }
    })
}