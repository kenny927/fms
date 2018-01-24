/**
 * Created by roger on 2017/1/17.
 */
var classify_list_data;
var classify_list_tree;
var log, className = "dark", max_classify = 3, blHasSort = false;
var classify_list_setting = {
    view: {
        showLine: false,
        showIcon: false,
        addDiyDom: addDiyDom,
        fontCss: getFont,
        nameIsHTML: true
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};
/**
 * 自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
    var spaceWidth = 15;
    var liObj = $("#" + treeNode.tId);
    var aObj = $("#" + treeNode.tId + "_a");
    var switchObj = $("#" + treeNode.tId + "_switch");
    var icoObj = $("#" + treeNode.tId + "_ico");
    var spanObj = $("#" + treeNode.tId + "_span");
    aObj.attr('title', '');
    aObj.append('<div class="diy swich"></div>');
    var div = $(liObj).find('div').eq(0);
    switchObj.remove();
    spanObj.remove();
    icoObj.remove();
    div.append(switchObj);
    div.append(spanObj);
    var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
    switchObj.before(spaceStr);
    var editStr = '';
    editStr += '<div class="diy">' + (treeNode.relation == null ? '&nbsp;' : getRelationString(treeNode.relation)) + '</div>';
    editStr += '<div class="diy">' + (treeNode.properties == null ? '&nbsp;' : getPropertiesString(treeNode.properties) ) + '</div>';
    if (treeNode.isLeaf == 1) {
        var idStr = "'" + treeNode.id + "'";
        editStr += '<div class="diy">' + '<button class="search-btn" style="cursor: pointer;width:60px;height: 24px;" onclick="openChooseSkuClassifyModal(' + idStr + ')">关联分类</button>' + '</div>';
    } else if (treeNode.level == 1) {
        var idStr = "'" + treeNode.id + "','" + treeNode.classifyPic + "'";
        editStr += '<div class="diy">' + '<button class="search-btn" style="cursor: pointer;width:90px;height: 24px;" onclick="openEdiMallClassifyPicModal(' + idStr + ')">设置分类图片</button>' + '</div>';
    } else {
        editStr += '<div class="diy">&nbsp;</div>';
    }
    aObj.append(editStr);
}

function getFont(treeId, node) {
    var maxSize = 1, relationSize = 2, propertiesSize = 2;
    if (node.relation) {
        relationSize = node.relation.length;
    }
    if (node.properties) {
        propertiesSize = node.properties.length;
    }
    maxSize = relationSize > propertiesSize ? relationSize : propertiesSize
    maxSize = maxSize < 2 ? 2 : maxSize;
    if (node.level == max_classify) {
        return {'background-color': '#efe', 'height': maxSize * 20 + 'px', 'vertical-align': 'top'};
    } else {
        return {'color': '#FF7F00'};
    }
}

function fixHtm(n, datalength, divEnd, value){
    var k = n + 1;
    var htm;
    var spanHtml = '<span style="margin-right: 10px;">' + value + '</span>';
    if (datalength == 1) {
        htm = '<div style="clear:both;text-align: left">' + spanHtml + divEnd;
    } else if (datalength == k && (k % 2 == 1)) {
        htm = '<div style="clear:both;text-align: left">' + spanHtml + divEnd;
    } else if (k % 2 == 1) {
        htm = '<div style="clear:both;text-align: left">' + spanHtml;
    } else if (k % 2 == 0) {
        htm = spanHtml + divEnd;
    }
    return htm;
}

function getRelationString(data) {
    var htm = '<div>', divEnd = '</div>';
    $.each(data, function (n, value) {
        htm = htm + fixHtm(n, data.length, divEnd, value.skuClassifyName);
    });
    htm = htm + divEnd;
    return htm;
}

function getPropertiesString(data) {
    var htm = '<div>', divEnd = '</div>';
    $.each(data, function (n, value) {
        htm = htm + fixHtm(n, data.length, divEnd, value.skuPropertyName);
    });
    htm = htm + divEnd;
    return htm;
}

function openChooseSkuClassifyModal(id) {
    var param = {};
    param.mallClassifyId = id;
    postUtil.submit("/mallClassificatorySku/preList",param);
    // layer.open({
    //     title:"关联分类",
    //     type: 2,
    //     area: ['600px', '550px'],
    //     fixed: false, //不固定
    //     maxmin: true,
    //     content: '/mall/classify/matchSkuClassify?classifyId='+id
    // });
}

function openEdiMallClassifyPicModal(id, classifyPic) {
    layer.open({
        title:"设置分类图片",
        type: 2,
        area: ['500px', '450px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/mall/classify/setClassifyPic?classifyId='+id+'&classifyPic='+classifyPic
    });
    // $("#classifyPicDiv img").attr("src", classifyPic);
    current_mallClassifyId = id;
}

function loadMallClassList(current_mallClassifyId) {
    var jsonParam = {};
    if (classify_list_tree) {
        var node = classify_list_tree.getNodeByParam("id", current_mallClassifyId, null);
        if (node) {
            jsonParam.currentMallClassifyId = node.pId;
        }
    }
    postUtil.call("/mall/classify/getMallClassificatoryForZTree", jsonParam, function (data) {
        classify_list_data = data;
        classify_list_tree = $.fn.zTree.init($("#classify_list_tree"), classify_list_setting, classify_list_data);
        //添加表头
        var li_head = ' <li class="head"><a><div class="diy">商品外部分类名称</div><div class="diy">关联内部叶子分类</div><div class="diy">筛选属性</div>' +
            '<div class="diy">操作</div></a></li>';
        var rows = $("#classify_list_tree").find('li');
        if (rows.length > 0) {
            rows.eq(0).before(li_head)
        } else {
            $("#classify_list_tree").append(li_head);
            $("#classify_list_tree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
        }
    });
}

$(function () {
    //加载zTree
    loadMallClassList();
});