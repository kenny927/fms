/**
 * Created by hevenzheng on 2017/3/16.
 */
//详情页商品基本信息渲染

// var str=location.href; //取得整个地址栏
// var str="http://localhost/detail?id=1";
// var arr=str.split("?")[1];
// var params = arr.split("&");
// var skuId=params[0].split("=")[1];
// var classifyCrumb = [];
// if(params[1]) {
//     classifyCrumb.push(params[1].split("=")[1])
// }
// if(params[2]){
//     classifyCrumb.push(params[2].split("=")[1])
// }
// if(params[3]){
//     classifyCrumb.push(params[3].split("=")[1])
// }
var param = {};
var propertyList = [];
var propertyConstraint = [];

$(function () {
    loadProduct();
    magnifier();
    rendDesc();
});

function loadProduct(){
    // param.skuId = skuId;
    // param.propertyList = [];
    // var htmlCrumb = '<a href="/index">首页</a>>';
    // if(classifyCrumb.length > 0) {
    //     $.each(classifyCrumb, function(index, item){
    //         htmlCrumb += '<a href="javascript:;">'+decodeURI(item)+'</a>>';
    //     });
    // }
    // htmlCrumb += '<span class="skuId">#'+skuId+'</span>';
    // $(".mianbaoxie").html(htmlCrumb);
    // $.ajax({
    //     type:"post",
    //     data: {"skuId" : skuId},
    //     url:apiUrl.getProductBaseInfo,
    //     success:function(result){
    //         detailList(result);
    //         setPropertyDisplay();
    //     }
    // })

    detailList();
}
function detailList(){
    console.log(previewData);
    console.log(spuData);
    var spuId = spuData.spuId;
    var skuId=previewData.skuId;
    var skuName=previewData.skuName;
    var model=previewData.model;
    var brand=previewData.brandName;

    var minNum=previewData.minNum;
    var unitName=previewData.unitName;

    // propertyConstraint = previewData.propertyConstraint;
    html='<p class="good-name">'+skuName+'</p>'
    if(spuId != undefined) {
        propertyList = spuData.propertyList;
        for(var i=0;i<propertyList.length;i++){
            var propertyName=propertyList[i].propertyName;
            var html2="";
            for(var j=0;j<propertyList[i].children.length;j++){
                var propertyChild=propertyList[i].children[j];

                if(propertyChild.isSelectable){
                    if(propertyChild.selected) {
                        html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyChild.propertyValue+'" class="selected"><a href="javascript:;">'+propertyChild.propertyValue+'</a></dd>';
                    } else {
                        html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyChild.propertyValue+'"><a href="javascript:;">'+propertyChild.propertyValue+'</a></dd>';
                    }
                }else{
                    html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyChild.propertyValue+'" class="selected"><a href="javascript:;">'+propertyChild.propertyValue+'</a></dd>';
                }
            }
            html+='<dl class="list-detail" propertyName="'+propertyName+'" id="detail'+(i+1)+'"><dt style="width: 98px;">'+propertyName+'：</dt>'+html2+'</dl>';
        }
    } else {
        propertyList = previewData.propertyList;
        for(var i=0;i<propertyList.length;i++){
            var propertyName=propertyList[i].propertyName;
            var html2="";
            // for(var j=0;j<propertyList[i].children.length;j++){
            //     var propertyChild=propertyList[i].children[j];
            //
            //     if(propertyChild.isSelectable){
            //         if(propertyChild.selected) {
            //             html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyChild.propertyValue+'" class="selected"><a href="javascript:;">'+propertyChild.propertyValue+'</a></dd>';
            //         } else {
            //             html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyChild.propertyValue+'"><a href="javascript:;">'+propertyChild.propertyValue+'</a></dd>';
            //         }
            //     }else{
                    html2+='<dd propertyName="'+propertyName+'" propertyValue="'+propertyList[i].propertyValue+'" class="selected"><a href="javascript:;">'+propertyList[i].propertyValue+'</a></dd>';
            //     }
            // }
            html+='<dl class="list-detail" propertyName="'+propertyName+'" id="detail'+(i+1)+'"><dt style="width: 98px;">'+propertyName+'：</dt>'+html2+'</dl>';
        }
    }


    html+='<p class="list-type">型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：<span class="red" style="margin-left: 37px;">'+model+'</span></p>';
    html+='<p class="list-type">SKU编码：<span class="red" style="margin-left: 37px;">'+skuId+'</span></p>'
    html+='<p class="list-type">品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：<span style="margin-left: 39px;">'+brand+'</span></p>'
    // if(!isLogin) {
    //     html+= '<p class="list-type">目&nbsp;录&nbsp;价：<span class="c-f"style="margin-left: 40px;">登录查看目录价</span></p>'
    // } else {
    var unitPrice = previewData.directoryPrice;
    // $.each(previewData.purchasePriceList, function (index, item) {
    //     if(item.isDefault) {
    //         unitPrice = item.purchasePrice;
    //         return false;
    //     }
    // });
        html+= '<p class="list-type">目&nbsp;录&nbsp;价：<span style="margin-left: 42px;">¥</span><span class="price" >'+parseFloat(unitPrice).toFixed(2)+'</span><span style="font-size: 12px !important;color:#CCCCCC;" >/'+unitName+'</span></p>'
    // }

    //html+='<dl class="buy"><dt>购买数量：</dt><dd><span class="reduce">-</span><input type="text" value="'+minNum+'"/><span class="add">+</span><span class="mi">'+unitName+'</span></dd></dl>'
    //html+='<dl class="zixun"><dt><a href="javascript:;"><span class="iconfont icon-zixun"></span>询价</a></dt><dd><a href="javascript:;"><span class="iconfont icon-xiugai"></span>修改</a></dd><dd class="collect"><a href="javascript:;"><span class="iconfont icon-shoucang"></span>收藏</a></dd></dl>'
    $(".miaoshu").find(".good-detail").html(html);

    //绑定点击属性事件
    // if(propertyList.length > 0) {
    //     for(var i = 1; i<propertyList.length+1; i++) {
    //         AttributeMove(i,propertyList.length+1);
    //     }
    // }


    //加减计算
    // $(".add").click(function(){
    //     var value=$(this).parent().find("input").val()*1;
    //     $(this).parent().find("input").val(value+1);
    // })
    // $(".reduce").click(function(){
    //     var value=$(this).parent().find("input").val()*1;
    //     if(value<=1){
    //
    //     }else{
    //         $(this).parent().find("input").val(value-1);
    //     }
    // })
}
//属性点击事件

// function AttributeMove(num){
//     //防止动态绑定事件后连续触发事件
//     $(document).off("click", "#detail"+num+" dd");
//     $(document).on("click", "#detail"+num+" dd", function() {
//         if($(this).hasClass("disabled") || $(this).hasClass("nonSelectable")
//             || $(this).siblings().length == 1) {
//             return;
//         }
//
//         var propertyName=$(this).attr("propertyName");
//         var propertyValue=$(this).attr("propertyValue");
//         //判断属性的选择模式是选中还是取消选中
//         var selectMode = "select";
//         if($(this).hasClass("selected") && $(this).siblings().length > 1) {
//             selectMode = "remove";
//             $(this).removeClass("selected");
//         } else {
//             $(this).addClass("selected").siblings().removeClass("selected");
//         }
//
//         var property = {
//             "propertyName":propertyName,
//             "propertyValue":propertyValue
//         };
//         if(selectMode == "select") {
//             var isExist = false;
//             $.each(param.propertyList, function(index, item){
//                 if(propertyName == item.propertyName) {
//                     param.propertyList[index].propertyValue = propertyValue;
//                     isExist = true;
//                 }
//             });
//             if(!isExist) {
//                 param.propertyList.push(property);
//             }
//         } else if(selectMode == "remove") {
//             $.each(param.propertyList, function(index, item){
//                 if(item != undefined) {
//                     if(propertyName == item.propertyName
//                         && propertyValue == item.propertyValue) {
//                         param.propertyList.splice(index, 1);
//                     }
//                 }
//             });
//         }
//
//         constraint(property, selectMode);
//
//         if (param.propertyList.length == propertyList.length) {
//             switchProperty(param);
//         }
//     })
// }

function setPropertyDisplay() {
    $.each($(".list-detail"), function(idx, listItem){
        var properValueList = $(listItem).find("dd");
        $.each(properValueList, function(idx1, valueItem){
            if($(valueItem).hasClass("selected") && $(valueItem).siblings().length > 1) {
                var propertyName=$(valueItem).attr("propertyName");
                var propertyValue=$(valueItem).attr("propertyValue");
                var property = {
                    "propertyName":propertyName,
                    "propertyValue":propertyValue
                };
                constraint(property, "select");
            }
        });
    });
}

//属性约束
function constraint(property, selectMode){
    var constraintContent = [];
    //获取当前选中属性的约束
    $.each(propertyConstraint, function(index, item){
        if(property.propertyName == item.propertyName
            && property.propertyValue == item.propertyValue) {
            constraintContent = item.contents;
            return false;
        }
    });

    //根据约束更新现有属性显示状态
    $.each(propertyList, function(index, item){
        //当前选中属性不做处理
        if(property.propertyName == item.propertyName) {
            return true;
        }

        $.each(constraintContent, function(idx, contentItem){
            if(item.propertyName == contentItem.propertyName) {
                $.each(item.children, function(idx1, propertyChild){
                    var isEnable = false;
                    $.each(contentItem.children, function(idx2, contentChild){
                        if(propertyChild.propertyValue == contentChild.propertyValue) {
                            isEnable = true;
                            return false;
                        }
                    });
                    //更新属性选项样式
                    if(selectMode=="select") {
                        updatePropertyCss(item.propertyName, propertyChild.propertyValue, isEnable);
                    } else if(selectMode=="remove" && !isEnable) {
                        updatePropertyCss(item.propertyName, propertyChild.propertyValue, !isEnable);
                    }

                    //移除已选择属性值
                    if(!isEnable && selectMode=="select") {
                        removeSelectedValue(item.propertyName, propertyChild.propertyValue);
                    }
                });
            }
        });
    });

}

// function updatePropertyCss(propertyName, propertyValue, isEnable) {
//     $.each($(".list-detail"), function(idx, listItem){
//         if(propertyName == $(listItem).attr("propertyName")){
//             var properValueList = $(listItem).find("dd");
//             $.each(properValueList, function(idx1, valueItem){
//                 if(propertyValue == $(valueItem).attr("propertyValue")) {
//                     if(!isEnable){
//                         $(valueItem).removeClass();
//                         $(valueItem).addClass("disabled");
//                     } else {
//                         if($(valueItem).hasClass("disabled")) {
//                             $(valueItem).removeClass("disabled");
//                         }
//                     }
//                 }
//             });
//         }
//     });
// }

function removeSelectedValue(propertyName, propertyValue) {
    //已选属性如果不在约束中则移除
    var tempList = param.propertyList;
    $.each(tempList, function(idx3, selectedProperty){
        if(selectedProperty != undefined) {
            if(propertyName == selectedProperty.propertyName
                && propertyValue == selectedProperty.propertyValue) {
                param.propertyList.splice(idx3, 1);
            }
        }
    });
}

// //切换商品属性
// function switchProperty(param) {
//     $.ajax({
//         type:"post",
//         data: {propertyJSON:JSON.stringify(param)},
//         url:apiUrl.switchProperty,
//         success:function(data){
//             skuId=data.data.skuId;
//             loadProduct();
//             magnifier();
//             rendDesc();
//         }
//     })
// }

//发大镜图片渲染
function magnifier(){
    // $.ajax({
    //     type:"post",
    //     data: {"skuId" : skuId},
    //     url:apiUrl.getProductImageInfo,
    //     success:function(data){
    var images = previewData.images;
            if(images.length > 0) {
                var defaultbigImg=images[0].origUrl;
                var defaultsmallImg=images[0].origUrl;
                $(".jqzoom").html('<img jqimg="'+defaultbigImg+'" src="'+defaultsmallImg+'" />');
                var html="";
                for(var i=0;i<images.length;i++){
                    var bigImgUrl = images[i].origUrl;
                    var smallImg = images[i].origUrl;
                    html+='<li><img alt="长飞" bimg="'+bigImgUrl+'" src="'+smallImg+'" onmousemove="preview(this);"></li>';
                }
                $(".items ul").html(html);
            }
//图片放大镜效果
//图片预览小图移动效果,页面加载时触发

            $(".jqzoom").jqueryzoom({xzoom:400,yzoom:400});
            var tempLength = 0; //临时变量,当前移动的长度
            var viewNum = 4; //设置每次显示图片的个数量
            var moveNum = 1.1; //每次移动的数量
            var moveTime = 300; //移动速度,毫秒
            var scrollDiv = $(".spec-scroll .items ul"); //进行移动动画的容器
            var scrollItems = $(".spec-scroll .items ul li"); //移动容器里的集合
            var moveLength = scrollItems.eq(0).width() * moveNum; //计算每次移动的长度
            var countLength = (scrollItems.length - viewNum) * scrollItems.eq(0).width(); //计算总长度,总个数*单个长度

            //下一张
            $(".spec-scroll .next").bind("click",function(){
                if(tempLength < countLength){
                    if((countLength - tempLength) > moveLength){
                        scrollDiv.animate({left:"-=" + moveLength + "px"}, moveTime);
                        tempLength += moveLength;
                    }else{
                        scrollDiv.animate({left:"-=" + (countLength - tempLength) + "px"}, moveTime);
                        tempLength += (countLength - tempLength);
                    }
                }
            });
            //上一张
            $(".spec-scroll .prev").bind("click",function(){
                if(tempLength > 0){
                    if(tempLength > moveLength){
                        scrollDiv.animate({left: "+=" + moveLength + "px"}, moveTime);
                        tempLength -= moveLength;
                    }else{
                        scrollDiv.animate({left: "+=" + tempLength + "px"}, moveTime);
                        tempLength = 0;
                    }
                }
            });
    //     }
    // });
}
//商品详情渲染

function rendDesc(){
    // $.ajax({
    //     type:"post",
    //     data: {"skuId" : skuId},
    //     url:apiUrl.getProductDescInfo,
    //     success:function(data){
            var content = previewData;
            var parameterHtml="";
            for(var i=0;i<content.propertyList.length;i++){
                parameterHtml+='<dl><dt>'+content.propertyList[i].propertyName+'</dt><dd>'+content.propertyList[i].propertyValue+'</dd></dl>'
            }
            var html="";
            var describe = "";
            var parameter = "";
            var qa = "";
            var purchase = "";
            var afterSale = "";
            var download = "";
            $("#descContent section").remove();
            if(content.describeEffective == "Y") {
                html += '<li><a class="cs-p">商品描述</a></li>';
                describe += '<section class="xq-list" id="Introduction">';
                describe += '   <div class="xq">';
                describe += '   <h3>商品描述</h3>';
                describe += '   <div class="good-detail">';
                describe += '   <div class="productDescribe">';
                describe += content.describe;
                describe += '   </div>';
                describe += '  </div>';
                describe += '  </div>';
                describe += '  </section>';
                $("#descContent").append(describe);
            }

            html += '<li><a class="cs-p">规格参数</a></li>';
            parameter += '<section class="xq-list" id="Specifications">';
            parameter += '  <div class="xq">';
            parameter += '  <h3>规格参数</h3>';
            parameter += '  <div class="good-detail">';
            parameter += '  <div class="canshu">';
            parameter += parameterHtml;
            parameter += '  </div>';
            parameter += '  </div>';
            parameter += ' </div>';
            parameter += ' </section>';
            $("#descContent").append(parameter);

            if(content.qaEffective == "Y") {
                html += '<li><a class="cs-p">商品问答</a></li>';
                qa += '<section class="xq-list" id="answer">';
                qa += '   <div class="xq">';
                qa += '    <h3>商品问答</h3>';
                qa += '   <div class="good-detail">';
                qa += '  <div>';
                qa +=  content.qa;
                qa += '   </div>';
                qa += '   </div>';
                qa += '   </div>';
                qa += '   </section>';
                $("#descContent").append(qa);
            }
            if(content.purchaseEffective == "Y") {
                html += '<li><a class="cs-p">采购说明</a></li>';
                purchase += '<section class="xq-list" id="description">';
                purchase += '  <div class="xq">';
                purchase += '  <h3>采购说明</h3>';
                purchase += '  <div class="good-detail">';
                purchase += '  <div>';
                purchase += content.purchase;
                purchase += ' </div>';
                purchase += ' </div>';
                purchase += '  </div>';
                purchase += '  </section>';
                $("#descContent").append(purchase);
            }
            if(content.afterSaleEffective == "Y") {
                html += '<li><a class="cs-p">售后保障</a></li>';
                afterSale += '<section class="xq-list" id="support">';
                afterSale += '  <div class="xq">';
                afterSale += '  <h3>售后保障</h3>';
                afterSale += ' <div class="good-detail">';
                afterSale += ' <div>';
                afterSale += content.afterSale;
                afterSale += '  </div>';
                afterSale += '  </div>';
                afterSale += '  </div>';
                afterSale += '  </section>';
                $("#descContent").append(afterSale);
            }
            if(content.downloadEffective == "Y") {
                html += '<li><a class="cs-p">相关资料下载</a></li>';
                download += '<section class="xq-list" id="download">';
                download += '  <div class="xq">';
                download += '  <h3>相关资料下载</h3>';
                download += '  <div class="good-detail">';
                download += '  <div class="xiazai">';
                download += '  <dl class="xiazai-list toubu">';
                download += '  <dd class="xiazai-name" style="width:920px;">资料名称</dd>';
                download += '  <dt class="xiazai-icon">下载</dt>';
                download += '  </dl>';
                var downloadHtml = "";
                if(content.download) {
                    var downloadArr = JSON.parse(content.download);
                    if(downloadArr && downloadArr.length > 0) {
                        $.each(downloadArr, function (index, item) {
                            downloadHtml += '<dl class="xiazai-list">';
                            downloadHtml += '    <dd class="xiazai-name" style="width:920px;">'+item.MALL_FILE_NAME+'</dd>';
                            downloadHtml += ' <dt class="xiazai-icon"><span class="iconfont icon-xiazai" style="cursor: pointer;" ></span></dt>';
                            downloadHtml += '</dl>';
                        });
                    }
                }
                download += downloadHtml;
                download += '  </div>';
                download += '  </div>';
                download += '  </div>';
                download += '  </section>';
                $("#descContent").append(download);
            }
            $("#descTabs").empty("")
            $("#descTabs").html(html);
            $("#descTabs li:first").find("a").addClass("active");
    //     }
    // });
}

// function downLoadMallAttachment(mallFileAttachmentId) {
//     var param = {};
//     param.fileAttachmentId = mallFileAttachmentId;
//     postUtil.submit("/file_server/mall/generalFileDownload", param);
// }

//鼠标经过预览图片函数
function preview(img){
    $("#preview .jqzoom img").attr("src",$(img).attr("src"));
    $("#preview .jqzoom img").attr("jqimg",$(img).attr("bimg"));
}

//==================图片详细页函数=====================



// $(".nav1 ul").find("li").on("click",function(){
//     $(this).find("a").addClass("active").parent().siblings().find("a").removeClass("active");
// });

$(document).on("click", ".nav1 ul li", function () {
    $(this).find("a").addClass("active").parent().siblings().find("a").removeClass("active");
});

//导航固定定位

$(window).scroll(function(){
    var t=$(this).scrollTop();
    if(t>640){
        $(".nav1").addClass("nav2");
    }else{
        $(".nav1").removeClass("nav2");
    }
})