/**
 * Created by hevenzheng on 2017/3/8.
 */
/*初始化富文本编辑器*/
// layui.use(['tree','layer'], function () {
//     var layer = layui.layer;
//     var treeOption = {};
//     treeOption.skin = "shihuang";
//     treeOption.elem = "#treeNav";
//     treeOption.click = function (node) {
//         var classifyIsLeaf = node.classifyIsLeaf;
//         if(classifyIsLeaf == "1") {
//             $('#skuClassifyName').val(node.allParentName);
//             $('#skuClassifyId').val(node.classifyId);
//             $('#treeNav').hide();
//         }else {
//             layer.msg("请选择叶子节点",{"icon":"5"});
//
//         }
//     };
//
//     postUtil.call("/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree", null, function (result) {
//         treeOption.nodes = result;
//         layui.tree(treeOption);
//     });
//
// });
$(function () {


    //单选
    $(".pay_list_c1").on("click",function(){
        $(this).addClass("on").parent().siblings().find("span").removeClass("on");
    })
    //单选
    $(".pay_list_c2").on("click",function(){
        $(this).addClass("on").parent().parent().siblings().find(".pay_list_c2").removeClass("on");
    })

    //单选
    $(".pay_list_c3").on("click",function(){
        $(this).addClass("on").parent().parent().parent().siblings().find(".pay_list_c3").removeClass("on");
    })



    // layui.use(['form', 'layedit', 'laydate'], function(){
    //     var form = layui.form()
    //         ,layer = layui.layer
    //         ,layedit = layui.layedit
    //         ,laydate = layui.laydate;
    //
    //     //创建一个编辑器
    //     var editIndex = layedit.build('LAY_demo_editor');
    //
    //     //自定义验证规则
    //     form.verify({
    //         title: function(value){
    //             if(value.length < 5){
    //                 return '标题至少得5个字符啊';
    //             }
    //         }
    //         ,pass: [/(.+){6,12}$/, '密码必须6到12位']
    //         ,content: function(value){
    //             layedit.sync(editIndex);
    //         }
    //     });
    //
    //     //监听指定开关
    //     form.on('switch(switchTest)', function(data){
    //         layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
    //             offset: '6px'
    //         });
    //         layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    //     });
    //
    //     //监听提交
    //     form.on('submit(demo1)', function(data){
    //         layer.alert(JSON.stringify(data.field), {
    //             title: '最终的提交信息'
    //         })
    //         return false;
    //     });
    // });


    //树形菜单选项

    $(document).on("click",".xiala",function(){
        if($(this).next().css("display")=="none"){
            $(this).next().show();
        }else{
            $(this).next().hide();
        }
    })
    $(document).on("click","#skuClassifyName",function(){
        if($(".xiala").next().css("display")=="none"){
            $(".xiala").next().show();
        }else{
            $(".xiala").next().hide();
        }
    })
    //两个Tab页切换
    $(document).on("click",".tap-ul ul li",function(){
        $(this).addClass("bg-fff").siblings().removeClass("bg-fff");
        if($("#productDescTab").css("display")=="none") {
            $("#productDescTab").show();
        } else {
            $("#productDescTab").hide();
        }

        if($("#produceImageTab").css("display")=="none") {
            $("#produceImageTab").show();
        } else {
            $("#produceImageTab").hide();
        }
    })

    $(document).on("change","#unitId",function(){
        if(this.value == "") {
            $('span[name="unitName"]').text("");
        } else {
            $('span[name="unitName"]').text($('#unitId option:selected').text());
        }
        $("#minNum").attr("unitName", $('#unitId option:selected').text());
        //渲染单位控制小数位数
        renderUnitDisplay();
    });



    $(document).on("click","#selectDesc",function(){
        // if($("#skuClassifyId").val() == "") {
        //     layer.msg('请先选择分类再选择模板', {icon: 5});
        //     return;
        // }
        selectTemplate("DESCRIBE");
    });

    $(document).on("click","#saveAsDesc",function(){
        saveAsTemplate("DESCRIBE");
    });

    $(document).on("click","#selectQA",function(){
        // if($("#skuClassifyId").val() == "") {
        //     layer.msg('请先选择分类再选择模板', {icon: 5});
        //     return;
        // }
        selectTemplate("QA");
    });

    $(document).on("click","#saveAsQA",function(){
        saveAsTemplate("QA");
    });

    $(document).on("click","#selectPurchase",function(){
        // if($("#skuClassifyId").val() == "") {
        //     layer.msg('请先选择分类再选择模板', {icon: 5});
        //     return;
        // }
        selectTemplate("PURCHASE");
    });

    $(document).on("click","#saveAsPurchase",function(){
        saveAsTemplate("PURCHASE");
    });

    $(document).on("click","#selectAfterSale",function(){
        // if($("#skuClassifyId").val() == "") {
        //     layer.msg('请先选择分类再选择模板', {icon: 5});
        //     return;
        // }
        selectTemplate("AFTER_SALE");
    });

    $(document).on("click","#saveAsAfterSale",function(){
        saveAsTemplate("AFTER_SALE");
    });

    $(document).on("click","#selectDownload",function(){
        // if($("#skuClassifyId").val() == "") {
        //     layer.msg('请先选择分类再选择模板', {icon: 5});
        //     return;
        // }
        selectTemplate("DOWNLOAD");
    });

    $(document).on("click","#saveAsDownload",function(){
        saveAsTemplate("DOWNLOAD");
    });
    //单选
    $(document).on("click", ".pay_list_c3",function(){
        $(this).addClass("on").parent().parent().parent().siblings().find(".pay_list_c3").removeClass("on");
    })


    // $(document).on("click", '[name="vendorName"]',function(){
    //     setVendor(this);
    //     layer.open({
    //         title:"请选择供应商",
    //         type: 2,
    //         area: ['1000px', '650px'],
    //         fixed: false, //不固定
    //         maxmin: true,
    //         content: '/reusable/systemAccount/chooseVendorPage'
    //     });
    // });


    // $(document).on("click", '#brand',function(){
    //     layer.open({
    //         title:"请选择品牌",
    //         type: 2,
    //         area: ['1000px', '650px'],
    //         fixed: false, //不固定
    //         maxmin: true,
    //         content: '/reusable/skuBrand/chooseBrandPage'
    //     });
    // });

    // $(document).on("click",'[name="upStatus"]',function(){
    //     if(this.value == "") {
    //         isPriceNeed = false;
    //         $("#isPriceNeed").text("");
    //     } else {
    //         isPriceNeed = true;
    //         $("#isPriceNeed").text("*");
    //     }
    // });

    $(document).on("click",'[name="skuStatus"]',function(){
        if(this.value == "N") {
            $("[name='upStatus']:eq(2)").click();
            $("[name='upStatus']:eq(0)").attr("disabled","disabled");
            $("[name='upStatus']:eq(1)").attr("disabled","disabled");
        } else {
            $("[name='upStatus']:eq(0)").removeAttr("disabled");
            $("[name='upStatus']:eq(1)").removeAttr("disabled");
        }
    });

    var isPriceNeed = true;
    function validateBaseInfo(isEdit) {
        var isPass = true;
        var msg = "";

        if(!isEdit) {
            if($.trim($("#skuId").val()) == ""){
                msg += "商品SKU编码不能为空;<br>";
                isPass = false;
            }
        }
        if($.trim($("#skuType").val()) == ""){
            msg += "商品类型不能为空;<br>";
            isPass = false;
        }
        if($.trim($("#skuName").val()) == ""){
            msg += "商品名称不能为空;<br>";
            isPass = false;
        }
        if($.trim($("#model").val()) == ""){
            msg += "商品型号不能为空;<br>";
            isPass = false;
        }
        if($.trim($("#brandId").val()) == ""){
            msg += "商品品牌不能为空;<br>";
            isPass = false;
        }
        if($.trim($("#skuClassifyId").val()) == ""){
            msg += "商品内部分类不能为空;<br>";
            isPass = false;
        }
        if($.trim($("#unitId").val()) == ""){
            msg += "计量单位不能为空;<br>";
            isPass = false;
        }
        var minNumMsg = "";
        var minNumPass = true;
        if($.trim($("#minNum").val()) == ""){
            minNumMsg += "起订量不能为空;";
            minNumPass = false;
        } else if (!$.isNumeric($.trim($("#minNum").val()))) {
            minNumMsg += '起订量必须为数字;';
            minNumPass = false;
        } else {
            if(parseFloat($.trim($("#minNum").val()))<0) {
                minNumMsg += '起订量必须为正数;';
                minNumPass = false;
            }
        }
        if(!minNumPass) {
            msg += minNumMsg+'<br>';
            isPass = false;
        }


        //校验属性
        var propertyList = $("#propertyList").children()
        if(propertyList.length == 1) {
            msg += '至少填写一条属性;<br>';
            isPass = false;
        } else {
            var propertyMsg = "";
            var propertyPass = true;
            $.each(propertyList, function (index, item) {
                if(index == 0) {
                    return true;
                }
                propertyPass = true;
                propertyMsg = '属性信息第【'+index+'】行';
                var propertyName = $(item).find('input[name="propertyName"]').val();
                var propertyValue = $(item).find('input[name="propertyValue"]').val();
                if($.trim(propertyName) == "") {
                    propertyMsg += '属性名称不能为空;';
                    propertyPass = false;
                }
                if($.trim(propertyValue) == "") {
                    propertyMsg += '属性值不能为空;';
                    propertyPass = false;
                }
                if(!propertyPass) {
                    msg += propertyMsg + "<br>";
                    isPass = false;
                }
            });
            //检查属性
            var propertyListTemp1 = propertyList;
            var propertyListTemp2 = propertyList;
            propertyMsg = "";
            $.each(propertyListTemp1, function (index, item) {
                if(index == 0) {
                    return true;
                }
                // propertyMsg = '属性信息第【'+index+'】行';
                $.each(propertyListTemp2, function (idx, itm) {
                    if(idx == 0 || index == idx) {
                        return true;
                    }
                    // propertyMsg += '与属性信息第【'+idx+'】行';
                    var propertyNameTemp1 = $(item).find('input[name="propertyName"]').val();
                    var propertyNameTemp2 = $(itm).find('input[name="propertyName"]').val();
                    if($.trim(propertyNameTemp1) == $.trim(propertyNameTemp2)) {
                        propertyMsg += '属性名重复;';
                        propertyPass = false;
                    }
                    if(!propertyPass) {
                        msg += propertyMsg + "<br>";
                        isPass = false;
                        return false;
                    }
                });
                if(!isPass) {
                    return false;
                }
            });
        }


        //校验状态

        var basePriceMsg = "";
        var basePricePass = true;
        if(isPriceNeed && $.trim($('#basePrice').val()) == "") {
            basePriceMsg += "基本售价不能为空;";
            basePricePass = false;
        }
        if($.trim($('#basePrice').val()) != "") {
            if (!$.isNumeric($.trim($("#basePrice").val()))) {
                basePriceMsg += '基本售价必须为数字;';
                basePricePass = false;
            } else {
                if (parseFloat($.trim($("#basePrice").val())) < 0) {
                    basePriceMsg += '基本售价必须为正数;';
                    basePricePass = false;
                }
            }
        }
        if(!basePricePass) {
            msg += basePriceMsg + '<br>';
            isPass = false;
        }
        var directoryPriceMsg = ""
        var directoryPricePass = true;
        // if(isPriceNeed && $.trim($('#directoryPrice').val()) == "") {
        //     directoryPriceMsg += "目录价不能为空;";
        //     directoryPricePass = false;
        // }
        if($.trim($('#directoryPrice').val()) != "") {
            if (!$.isNumeric($.trim($("#directoryPrice").val()))) {
                directoryPriceMsg += '目录价必须为数字;';
                directoryPricePass = false;
            } else {
                if (parseFloat($.trim($("#directoryPrice").val())) < 0) {
                    directoryPriceMsg += '目录价必须为正数;';
                    directoryPricePass = false;
                }
            }
        }
        if(!directoryPricePass) {
            msg += directoryPriceMsg +'<br>';
            isPass = false;
        }

        if($("#skuType").val() == "SPOT") {
            if($.trim($('#spotPrice').val()) == "") {
                msg += '现货商品必须填写现货价;<br>';
                isPass = false;
            }
        }

        var purchasePriceList = $("#purchasePriceList").children();
        if(isPriceNeed && purchasePriceList.length  == 0) {
            msg += '至少维护一条采购价;';
            isPass = false
        }

        if(purchasePriceList.length > 0) {
            var purchasePriceMsg = "";
            var purchasePricePass = true;
            $.each($("#purchasePriceList").children(), function (index, item) {
                purchasePricePass = true;
                purchasePriceMsg = '采购价信息第【'+(index+1)+'】行';
                var purchasePrice = $(item).find('input[name="purchasePrice"]').val();
                if($.trim(purchasePrice) == "") {
                    purchasePriceMsg += '采购价不能为空';
                    purchasePricePass = false;
                } else if (!$.isNumeric($.trim(purchasePrice))) {
                    purchasePriceMsg += '采购价必须为数字;';
                    purchasePricePass = false;
                } else {
                    if(parseFloat($.trim(purchasePrice))<0) {
                        purchasePriceMsg += '采购价必须为正数;';
                        purchasePricePass = false;
                    }
                }
                if(!purchasePricePass) {
                    msg += purchasePriceMsg + "<br>";
                    isPass = false;
                }
            });
            if($('input[name="default"]:checked').length == 0) {
                msg += "请选择一个供应商作为默认供应商;<br>";
                isPass = false;
            }
        }

        if(!isPass) {
            // layer.msg(msg, {icon: 5});
            layer.open({
                title: '数据填写有误',
                icon: 5,
                skin: 'youskin',
                area: ['820px', '350px'],
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
function validateData(isEdit) {
    var isPass = true;
    var msg = "";

    if(!isEdit) {
        if($.trim($("#skuId").val()) == ""){
            msg += "商品SKU编码不能为空;<br>";
            isPass = false;
        }
    }

    if($.trim($("#skuType").val()) == ""){
        msg += "商品类型不能为空;<br>";
        isPass = false;
    }
    if($.trim($("#skuName").val()) == ""){
        msg += "商品名称不能为空;<br>";
        isPass = false;
    }
    if($.trim($("#model").val()) == ""){
        msg += "商品型号不能为空;<br>";
        isPass = false;
    }
    if($.trim($("#brandId").val()) == ""){
        msg += "商品品牌不能为空;<br>";
        isPass = false;
    }
    if($.trim($("#skuClassifyId").val()) == ""){
        msg += "商品内部分类不能为空;<br>";
        isPass = false;
    }
    if($.trim($("#unitId").val()) == ""){
        msg += "计量单位不能为空;<br>";
        isPass = false;
    }
    var minNumMsg = "";
    var minNumPass = true;
    if($.trim($("#minNum").val()) == ""){
        minNumMsg += "起订量不能为空;";
        minNumPass = false;
    } else if (!$.isNumeric($.trim($("#minNum").val()))) {
        minNumMsg += '起订量必须为数字;';
        minNumPass = false;
    } else {
        if(parseFloat($.trim($("#minNum").val()))<0) {
            minNumMsg += '起订量必须为正数;';
            minNumPass = false;
        }
    }
    if(!minNumPass) {
        msg += minNumMsg+'<br>';
        isPass = false;
    }


    //校验属性
    var propertyList = $("#propertyList").children()
    if(propertyList.length == 1) {
        msg += '至少填写一条属性;<br>';
        isPass = false;
    } else {
        var propertyMsg = "";
        var propertyPass = true;
        $.each(propertyList, function (index, item) {
            if(index == 0) {
                return true;
            }
            propertyPass = true;
            propertyMsg = '属性信息第【'+index+'】行';
            var propertyName = $(item).find('input[name="propertyName"]').val();
            var propertyValue = $(item).find('input[name="propertyValue"]').val();
            if($.trim(propertyName) == "") {
                propertyMsg += '属性名称不能为空;';
                propertyPass = false;
            }
            if($.trim(propertyValue) == "") {
                propertyMsg += '属性值不能为空;';
                propertyPass = false;
            }
            if(!propertyPass) {
                msg += propertyMsg + "<br>";
                isPass = false;
            }
        });
        //检查属性
        var propertyListTemp1 = propertyList;
        var propertyListTemp2 = propertyList;
        propertyMsg = "";
        $.each(propertyListTemp1, function (index, item) {
            if(index == 0) {
                return true;
            }
            // propertyMsg = '属性信息第【'+index+'】行';
           $.each(propertyListTemp2, function (idx, itm) {
               if(idx == 0 || index == idx) {
                   return true;
               }
               // propertyMsg += '与属性信息第【'+idx+'】行';
               var propertyNameTemp1 = $(item).find('input[name="propertyName"]').val();
               var propertyNameTemp2 = $(itm).find('input[name="propertyName"]').val();
               if($.trim(propertyNameTemp1) == $.trim(propertyNameTemp2)) {
                   propertyMsg += '属性名重复;';
                   propertyPass = false;
               }
               if(!propertyPass) {
                   msg += propertyMsg + "<br>";
                   isPass = false;
                   return false;
               }
           });
            if(!isPass) {
                return false;
            }
        });
    }


    //校验状态

    var basePriceMsg = "";
    var basePricePass = true;
    if(isPriceNeed && $.trim($('#basePrice').val()) == "") {
        basePriceMsg += "基本售价不能为空;";
        basePricePass = false;
    }
    if($.trim($('#basePrice').val()) != "") {
        if (!$.isNumeric($.trim($("#basePrice").val()))) {
            basePriceMsg += '基本售价必须为数字;';
            basePricePass = false;
        } else {
            if (parseFloat($.trim($("#basePrice").val())) < 0) {
                basePriceMsg += '基本售价必须为正数;';
                basePricePass = false;
            }
        }
    }
    if(!basePricePass) {
        msg += basePriceMsg + '<br>';
        isPass = false;
    }
    var directoryPriceMsg = ""
    var directoryPricePass = true;
    // if(isPriceNeed && $.trim($('#directoryPrice').val()) == "") {
    //     directoryPriceMsg += "目录价不能为空;";
    //     directoryPricePass = false;
    // }
    if($.trim($('#directoryPrice').val()) != "") {
        if (!$.isNumeric($.trim($("#directoryPrice").val()))) {
            directoryPriceMsg += '目录价必须为数字;';
            directoryPricePass = false;
        } else {
            if (parseFloat($.trim($("#directoryPrice").val())) < 0) {
                directoryPriceMsg += '目录价必须为正数;';
                directoryPricePass = false;
            }
        }
    }
    if(!directoryPricePass) {
        msg += directoryPriceMsg +'<br>';
        isPass = false;
    }

    if($("#skuType").val() == "SPOT") {
        if($.trim($('#spotPrice').val()) == "") {
            msg += '现货商品必须填写现货价;<br>';
            isPass = false;
        }
    }

    var purchasePriceList = $("#purchasePriceList").children();
    if(isPriceNeed && purchasePriceList.length  == 0) {
        msg += '至少维护一条采购价;';
        isPass = false
    }

    if(purchasePriceList.length > 0) {
        var purchasePriceMsg = "";
        var purchasePricePass = true;
        $.each($("#purchasePriceList").children(), function (index, item) {
            purchasePricePass = true;
            purchasePriceMsg = '采购价信息第【'+(index+1)+'】行';
            var purchasePrice = $(item).find('input[name="purchasePrice"]').val();
           if($.trim(purchasePrice) == "") {
               purchasePriceMsg += '采购价不能为空';
               purchasePricePass = false;
           } else if (!$.isNumeric($.trim(purchasePrice))) {
               purchasePriceMsg += '采购价必须为数字;';
               purchasePricePass = false;
           } else {
               if(parseFloat($.trim(purchasePrice))<0) {
                   purchasePriceMsg += '采购价必须为正数;';
                   purchasePricePass = false;
               }
           }
           if(!purchasePricePass) {
               msg += purchasePriceMsg + "<br>";
               isPass = false;
           }
        });
        if($('input[name="default"]:checked').length == 0) {
            msg += "请选择一个供应商作为默认供应商;<br>";
            isPass = false;
        }
    }


    //校验图片商品详情页
    if($(".img-list li").length > 5) {
        msg += "最多只能上传5张图片;<br>";
        isPass = false;
    }

    if($(".img-list li").length > 0) {
        if($('input[name="isMain"]:checked').length == 0) {
            msg += "请选择一个图片作为主图;<br>";
            isPass = false;
        }
    }


    if(!isPass) {
        // layer.msg(msg, {icon: 5});
        layer.open({
            title: '数据填写有误',
            icon: 5,
            skin: 'youskin',
            area: ['820px', '350px'],
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
    function buildSubmitData() {
        var param = {};
        param.skuId = $.trim($("#skuId").val());
        param.skuType = $.trim($("#skuType").val());
        param.skuName = $.trim($("#skuName").val());
        param.model = $.trim($("#model").val());
        param.brandId = $.trim($("#brandId").val());
        if(typeof(hasSpu)!="undefined" && hasSpu && !isCopy) {
            param.brandName = $("#brandSelect").find("p").text();
        } else {
            param.brandName = $("#brandId").find("option:selected").text();
        }
        param.classifyId = $.trim($("#skuClassifyId").val());
        param.unitId = $.trim($("#unitId").val());
        param.unitName = $("#unitId").find("option:selected").text();
        param.minNum = $.trim($("#minNum").val());
        var propertyList = [];
        $.each($("#propertyList").children(), function (index, item) {
            if(index == 0) {
                return true;
            }
            var property = {};
            property.propertyName = $.trim($(item).find('input[name="propertyName"]').val());
            property.propertyValue = $.trim($(item).find('input[name="propertyValue"]').val());

            propertyList.push(property);
        });
        param.propertyList = propertyList;
        // var skuStatus = $('input[name="skuStatus"]:checked').val();
        // if(skuStatus == "Y") {
            var upStatus = $('input[name="upStatus"]:checked').val();
            if(upStatus != "") {
                param.status = upStatus;
            }
            // else {
            //     param.status = "Y";
            // }
        // } else {
        //     param.status = "N";
        // }
        param.basePrice = $.trim($('#basePrice').val());
        param.directoryPrice =$.trim($('#directoryPrice').val());
        //现货商品保存现货价
        if(param.skuType == "SPOT") {
            param.spotPrice =$.trim($('#spotPrice').val());
        }

        var purchasePriceList = [];
        $.each($("#purchasePriceList").children(), function (index, item) {
            var purchasePrice = {};
            purchasePrice.vendorAccountId = $(item).find('input[name="vendorId"]').val();
            purchasePrice.isDefault = $(item).find('input[name="default"]').is(":checked");
            purchasePrice.purchasePrice = $.trim($(item).find('input[name="purchasePrice"]').val());
            purchasePriceList.push(purchasePrice);
        });
        param.purchasePriceList = purchasePriceList;

        //商品描述
        param.describeEffective = $('input[name="describeEffective"]:checked').val();
        if(param.describeEffective == "Y") {
            param.describe = descEditor.html();
        }

        //商品问答
        param.qaEffective = $('input[name="qaEffective"]:checked').val();
        if(param.qaEffective == "Y") {
            param.qa = qaEditor.html();
        }

        //采购说明
        param.purchaseEffective = $('input[name="purchaseEffective"]:checked').val();
        if(param.purchaseEffective == "Y") {
            param.purchase = purchaseEditor.html();
        }

        //售后保障
        param.afterSaleEffective = $('input[name="afterSaleEffective"]:checked').val();
        if(param.afterSaleEffective == "Y") {
            param.afterSale = afterSaleEditor.html();
        }

        //相关下载
        param.downloadEffective = $('input[name="downloadEffective"]:checked').val();
        if(param.downloadEffective == "Y") {
            param.download = downloadContent;
        }

        var images = [];
        //图片
        $.each($(".img-list li"), function (index, item) {
            var image = {};
            image.origUrl = $(this).find('input[name="origUrl"]').val();
            image.thumbUrl = $(this).find('input[name="thumbUrl"]').val();
            image.isMain = $(this).find('input[name="isMain"]').is(":checked");
            images.push(image);
        })
        param.images = images;

        // console.log(param);
        return param;
    }

    //切换商品类型时显示现货价
    $(document).on("change","#skuType",function(){
        var skuType = $("#skuType").val();
        if(skuType == "SPOT") {
            $("#spotPriceDisplay").show();
        } else {
            $("#spotPriceDisplay").hide();
        }
    });

    //提交sku
    $(document).on("click","#submit",function(){
        layer.load();
        if(!validateData(false)) {
            layer.closeAll("loading");
            return;
        }
        var param = buildSubmitData();

        postUtil.call("/sku/add",{jsonData:JSON.stringify(param)}, function (res) {
            if(res.STATUS == "SUCCESS") {
                layer.msg("新增SKU成功", {icon:6});
                // postUtil.submit("/sku/list");
                cardUtil.closeCard("新增商品");
            } else {
                layer.msg(res.MSG, {icon:5});
            }
            layer.closeAll("loading");
        });
    });

    //修改sku
    $(document).on("click","#update",function(){
        layer.load();
        if(!validateData(true)) {
            layer.closeAll("loading");
            return;
        }
        var param = buildSubmitData();
        param.skuId = skuId;

        postUtil.call("/sku/update",{jsonData:JSON.stringify(param)}, function (res) {
            if(res.STATUS == "SUCCESS") {
                layer.msg("修改SKU成功", {icon:6});
                cardUtil.refreshCard("商品列表");
                cardUtil.refreshCard("现货SKU列表");
                cardUtil.closeCard("修改商品-"+skuId);
            } else {
                layer.msg(res.MSG, {icon:5});
            }
            layer.closeAll("loading");
        });
    });

    //保存sku基本信息
    $(document).on("click","#saveBaseInfo",function(){
        layer.load();
        if(!validateBaseInfo(true)) {
            layer.closeAll("loading");
            return;
        }
        var param = buildSubmitData();
        param.skuId = skuId;
        param.saveMode = "BASE_INFO";

        postUtil.call("/sku/update",{jsonData:JSON.stringify(param)}, function (res) {
            if(res.STATUS == "SUCCESS") {
                layer.msg("修改SKU成功", {icon:6});
                cardUtil.refreshCard("商品列表");
                cardUtil.refreshCard("现货SKU列表");
                cardUtil.closeCard("修改商品-"+skuId);
            } else {
                layer.msg(res.MSG, {icon:5});
            }
            layer.closeAll("loading");
        });
    });

    //复制sku
    $(document).on("click","#copy",function(){
        layer.load();
        if(!validateData(false)) {
            layer.closeAll("loading");
            return;
        }
        var param = buildSubmitData();

        postUtil.call("/sku/copy",{jsonData:JSON.stringify(param)}, function (res) {
            if(res.STATUS == "SUCCESS") {
                layer.msg("复制SKU成功", {icon:6});
                cardUtil.refreshCard("商品列表");
                cardUtil.refreshCard("现货SKU列表");
                cardUtil.closeCard("复制商品");
            } else {
                layer.msg(res.MSG, {icon:5});
            }
            layer.closeAll("loading");
        });
    });



    $(document).on("click","#goPreview",function(){
        var param = buildSubmitData();
        param.skuId = getSkuId();
        // postUtil.submit("/sku/preview", {jsonData:JSON.stringify(param)}, "_blank");
        cardUtil.openCard("预览商品-" + param.skuId,"/sku/preview", {jsonData:JSON.stringify(param)});
        cardUtil.changeCard("预览商品-" + param.skuId);
    });

    $(document).on("click","#cancelAdd",function(){
        cardUtil.closeCard("新增商品");
    });
    $(document).on("click","#cancelEdit",function(){
        cardUtil.closeCard("修改商品-"+getSkuId());
    });
    $(document).on("click","#cancelCopy",function(){
        cardUtil.closeCard("复制商品");
    });

    initDropdownList();

});

function isString(str){
    return (typeof str=='string')&&str.constructor==String;
}
function isObject(obj){
    return (typeof obj=='object')&&obj.constructor==Object;
}

function getSkuId() {
    var result = "";
    if(typeof(isCopy)!="undefined" && !isCopy) {
        if(isObject(skuId)) {
            result = $.trim($(skuId).val());
        } else if(isString(skuId)){
            result = skuId;
        }
    } else {
        result = $.trim($(skuId).val());
    }
    return result;
}

function initDropdownList() {

    postUtil.call("/reusable/skuBrand/allBrandJsonData", null, function (result) {
        if(result && result.length > 0) {
            var html = "";
            $.each(result, function (index, item) {
                html +='<option value="'+item.brandId+'">'+item.brandChineseName+'</option>';
            })
            $("#brandId").append(html);
        }
    });


    postUtil.call("/reusable/skuUnit/skuUnitJsonData", null, function (result) {
        if(result && result.length > 0) {
            var html = "";
            $.each(result, function (index, item) {
                html +='<option value="'+item.unitId+'">'+item.unitName+'</option>';
            })
            $("#unitId").append(html);
        }
    });
}

var rowNum = 0;
function addProperty() {
    rowNum++;
    var html = '<li id="property_'+rowNum+'"><input class="flt" type="text" name="propertyName" placeholder="请输入属性名"><input class="flt" style="width: 33%;" name="propertyValue" type="text" placeholder="请输入属性值"><p style="text-align: center;line-height: 45px;"><a href="javascript:removeProperty('+rowNum+');">移除</a></p></li>';
    $("#propertyList").append(html);
}

function removeProperty(rowId) {
    $("#property_"+rowId).remove();
}

var purchaseNum = 0;
function addPurchase() {
    layer.open({
        title:"请选择供应商",
        type: 2,
        area: ['1000px', '650px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/systemAccount/chooseVendorPage'
    });

}

function removePurchase(rowId) {
    $("#purchase_"+rowId).remove();
}

var currentTemplateType;
function selectTemplate(templateType) {
    currentTemplateType = templateType;
    layer.open({
        title: "请选择商品详情模板",
        type: 2,
        area: ['1000px', '650px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/reusable/skuDetail/chooseSkuDetailTemplatePage?templateType='+templateType+'&classifyId='+$("#skuClassifyId").val()
    });
}
function saveAsTemplate(templateType) {
    currentTemplateType = templateType;
    var editor = getEditorByType(currentTemplateType);
    var skuClassifyId = $.trim($("#skuClassifyId").val());
    var skuClassifyName = $.trim($("#skuClassifyName").val());
    layer.open({
        title: "另存为模板",
        type: 2,
        area: ['1000px', '480px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/sku/template/saveAsTemplate',
        success: function(layero, index){//设置父页面值
            var body = layer.getChildFrame('body', index);
            body.find('#skuClassifyId').val(skuClassifyId);
            body.find('#skuClassifyName').val(skuClassifyName);
            if(skuClassifyId != "") {
                body.find("[name='isGlobal']:eq(1)").click();
            } else {
                body.find("[name='isGlobal']:eq(0)").click();
            }
            body.find('#templateType').val(templateType);
            body.find('#templateType').change();
            var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            if(templateType !="DOWNLOAD") {
                iframeWin.setEditorValue(editor.html());
            } else {
                iframeWin.setDownloadContent(JSON.parse(downloadContent));
            }
        }
    });
}

function chooseSkuDetailTemplateCallback(tempList) {
    if(tempList) {
        if(tempList.length > 1) {
            layer.msg("请选择一个模板", {icon:5});
            return false;
        }
        var temp = tempList[0];

        if(temp.templateType != currentTemplateType) {
            layer.msg("选择的模板类型不匹配", {icon:5})
            return false;
        }

        if(currentTemplateType != "DOWNLOAD") {
            var editor = getEditorByType(currentTemplateType);
            editor.html(temp.templateContent);
        } else {
            rendDownload(temp.otherContent);
        }
        return true;
    }
}

function getEditorByType(type) {
    if(!type || type == "") {
        return;
    }
    if(type == "DESCRIBE") {
        return descEditor;
    }
    if(type == "QA") {
        return qaEditor;
    }
    if(type == "PURCHASE") {
        return purchaseEditor;
    }
    if(type == "AFTER_SALE") {
        return afterSaleEditor;
    }
}

var downloadContent = "";
function rendDownload(content) {
    if(content) {
        downloadContent = content;
        var downloadArr = JSON.parse(content);
        var html = "";
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
}

function downLoadMallAttachment(mallFileAttachmentId) {
    var param = {};
    param.fileAttachmentId = mallFileAttachmentId;
    postUtil.submit("/file_server/mall/generalFileDownload", param);
}

// function rendTabs() {
//     if($('input[name="describeEffective"]:checked').val() == "Y") {
//         loadTemplate("DESCRIBE");
//     }
//     if($('input[name="qaEffective"]:checked').val() == "Y") {
//         loadTemplate("QA");
//     }
//     if($('input[name="purchaseEffective"]:checked').val() == "Y") {
//         loadTemplate("PURCHASE");
//     }
//     if($('input[name="afterSaleEffective"]:checked').val() == "Y") {
//         loadTemplate("AFTER_SALE");
//     }
//     if($('input[name="downloadEffective"]:checked').val() == "Y") {
//         loadDownload();
//     }
// }

// function loadTemplate(type) {
//     postUtil.call("/sku/template/loadTemplate", null, function (result) {
//         treeOption.nodes = result;
//         layui.tree(treeOption);
//     });
// }

// function loadDownload() {
//
// }

var descEditor = null;
var qaEditor = null;
var purchaseEditor = null;
var afterSaleEditor = null;
KindEditor.ready(function (K) {
    descEditor = K.create('textarea[name="descContent"]', {
        allowFlashUpload: false,
        allowMediaUpload: false,
        allowFileUpload: true,
        filterMode: false,
        uploadJson: '/file_server/images/uploadForKindEditor'
    });
    qaEditor = K.create('textarea[name="qaContent"]', {
        allowFlashUpload: false,
        allowMediaUpload: false,
        allowFileUpload: true,
        filterMode: false,
        uploadJson: '/file_server/images/uploadForKindEditor'
    });
    purchaseEditor = K.create('textarea[name="purchaseContent"]', {
        allowFlashUpload: false,
        allowMediaUpload: false,
        allowFileUpload: true,
        filterMode: false,
        uploadJson: '/file_server/images/uploadForKindEditor'
    });
    afterSaleEditor = K.create('textarea[name="afterSaleContent"]', {
        allowFlashUpload: false,
        allowMediaUpload: false,
        allowFileUpload: true,
        filterMode: false,
        uploadJson: '/file_server/images/uploadForKindEditor'
    });
});

function chooseVendorCallback(choosedVendorDataArray) {
    if(choosedVendorDataArray) {
        var finalArr = [];
        $.each(choosedVendorDataArray, function (index, item) {
            var isExist = false;
            $.each($("#purchasePriceList").children(), function (idx, existItem) {
                var vendorAccountId = $(existItem).find('input[name="vendorId"]').val();
                if(item.accountId == vendorAccountId) {
                    isExist = true;
                    return true;
                }
            });
            if(!isExist) {
                finalArr.push(item);
            }
        });
        var unitName = "";
        if($('#unitId').val() != "") {
            unitName = $('#unitId option:selected').text()
        }
        var html = "";
        $.each(finalArr, function (index, item) {
            purchaseNum++;
            html += '<tr id="purchase_'+purchaseNum+'">';
            html +=  '<td><input type="text" name="vendorName" value="'+item.accountName+'" readonly="readonly" lay-verify="title" autocomplete="off" placeholder="点击选择供应商" class="layui-input"></td>';
            html +=  '<input type="hidden" name="vendorId" value="'+item.accountId+'">';
            html +=  '   <td><label>';
            html +=  '   <span class="pay_list_c3 mt5 ml10"><input type="radio" name="default"  class="radioclass" /></span>设为默认供应商</label></td>';
            html +=  '  <td><input type="text" name="purchasePrice" lay-verify="title" autocomplete="off" placeholder="请输入数字" oninput="filterQty(event,0);" class="layui-input wid0 inline"><span class="inline">元/<span name="unitName">'+unitName+'</span></span></td>';
            html +=  '   <td><a class="c-h" href="javascript:removePurchase('+purchaseNum+');">移除</a></td>';
            html +=  '   </tr>';
        });

        $("#purchasePriceList").append(html);

        return true;
    }
}

// function chooseBrandCallback(dataArray) {
//     if(dataArray) {
//         if(dataArray.length > 1) {
//             layer.msg("请选择一个品牌", {icon:5});
//             return false;
//         }
//         var brand = dataArray[0];
//         $("#brand").val(brand.brandChineseName);
//         $("#brandId").val(brand.brandId);
//         return true;
//     }
// }


//图片上传
layui.use('upload', function(){
    layui.upload({
        skin:'upload',
        url: '/file_server/images/upload' //上传接口
        ,before: function(input){
            // //返回的参数item，即为当前的input DOM对象
            // console.log('文件上传中');
        }
        ,success: function(res){ //上传成功后的回调
            if(res.STATUS == "SUCCESS") {
                var image = res.data[0];
                addImage(image);
            } else {
                layer.msg(res.MSG, {icon:5});
            }

        }
    });
});

function addImage(image) {
    if($(".img-list li").length >= 5) {
        layer.msg("最多只能上传5张图片", {icon:5});
        return;
    }
    var html = '<li>';
    html += '<img class="skuImg" src="'+image.ORIG+'" style="width:100px;height: 100px;">';
    html += '<div class="delImg jun-del" style="position:absolute;top:-12px;left:92px;cursor:pointer;display: none;" ><img src="/res/images/del.png" alt=""></div>';
    // html += ' <label class="delImg" style="top:0px;left:90px;cursor: pointer;">X</label>';
    html += '<input type="hidden" name="origUrl" value="'+image.ORIG+'">';
    html += '<input type="hidden" name="thumbUrl" value="'+image.THUMB+'">';
    html += ' <label><span class="pay_list_c2"><input type="radio" name="isMain"  class="radioclass" /></span>设为主图</label>';
    html += ' </li>';
    $(".img-list").append(html);
}

function filterQty(event, min, max) {
    var value = event.target.value;
    if(value == null || value == "") {
        return;
    }
    value = value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g,""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    var finalValue = 0;
    if($.isNumeric(value)) {
        if(value < min) {
            finalValue = min;
        } else if(value != null && value !="" && max != null && value > max){
            finalValue = max;
        } else {
            finalValue =value;
        }
    }
    $(event.target).val(finalValue);
}

$(document).on("click",".delImg",function(){
    $(this).parent().remove();
});
//单选
$(document).on("click",".pay_list_c2",function(){
    $(this).addClass("on").parent().parent().siblings().find(".pay_list_c2").removeClass("on");
});

$(document).on("mouseover", ".img-list li", function () {
    $(this).find(".jun-del").show();
});
$(document).on("mouseout", ".img-list li", function () {
    $(this).find(".jun-del").hide();
});


xOffset = 250;
yOffset = 30;
$(document).on("mouseover", ".skuImg", function (e) {
    jQuery("<img id='imgshow' src='" + this.src + "' />").appendTo("body");
    jQuery("#imgshow")
        .css("top", (e.pageY - xOffset) + "px")
        .css("left", (e.pageX + yOffset) + "px")
        .fadeIn("fast");
});
$(document).on("mouseout", ".skuImg", function () {
    jQuery("#imgshow").remove();
});
$(document).on("mousemove", ".skuImg", function (e) {
    jQuery("#imgshow")
         .css("top", (e.pageY - xOffset) + "px")
         .css("left", (e.pageX + yOffset) + "px")
});