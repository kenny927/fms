/**
 * Created by roger on 2017/1/16.
 */
var current_mallClassifyId;
var current_checked_property;
var sku_classify_setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onCheck: onCheck
    }
};

function onCheck(e, treeId, treeNode) {
    doOnCheck(current_checked_property);
}

function setCheck() {
    var zTree = $.fn.zTree.getZTreeObj("treeSkuList"), type = { "Y" : "s", "N" : "s" };;
    zTree.setting.check.chkboxType = type;
}


function initMallClassifyProperties(data){
    $("#propertiesDilterDiv").html("");
    if(data){
        var propertiesHtm = '';
        $.each(data, function (n, value) {
            var pvalue = value.skuPropertyName;
            propertiesHtm = propertiesHtm +
                '<label class="checkbox-inline"><input type="checkbox" id="choosedProperty_checkbox_' + n + '" value="'+ pvalue +'">'+ pvalue+'</label>';
        });
        $("#propertiesDilterDiv").append(propertiesHtm);
        updateCheckedValues();
    }
}

function doOnCheck(data){
    var zTree = $.fn.zTree.getZTreeObj("treeSkuList");
    var nodes = zTree.getCheckedNodes();
    var jsonData = {};
    var mapData = [];
    for(var i=0;i<nodes.length;i++) {
        mapData[i] = nodes[i].id;
    }
    jsonData.data = JSON.stringify(mapData);
    postUtil.call("/mall/classify/getAllPropertiesBySkuClassifies", jsonData, function (result) {
        if (result.STATUS == "SUCCESS") {
            $("#propertiesDilterDiv").html("");
            if(result.skuClassifies){
                var propertiesHtm = '';
                $.each(result.skuClassifies, function (n, value) {
                    var pvalue = value.propertyName;
                    var checked = 0;
                    $.each(data, function (n, value) {
                        if(value.skuPropertyName == pvalue){
                            checked = 1;
                        }
                    });
                    if(checked == 1){
                        propertiesHtm = propertiesHtm +
                            '<label class="checkbox-inline"><input type="checkbox" checked id="choosedProperty_checkbox_' + n + '" value="'+ pvalue +'">'+ pvalue+'</label>';
                    } else{
                        propertiesHtm = propertiesHtm +
                            '<label class="checkbox-inline"><input type="checkbox" id="choosedProperty_checkbox_' + n + '" value="'+ pvalue +'">'+ pvalue+'</label>';
                    }
                });
                $("#propertiesDilterDiv").append(propertiesHtm);
                updateCheckedValues();
            }
        } else {
            layer.msg(result.MSG);
        }
    });
}

function openChooseSkuClassifyModal(id) {
    var jsonData = {};
    jsonData.mallClassifyId = id;
    current_mallClassifyId = id;
    $('#chooseSkuClassfyModal').modal("show");
    postUtil.call("/mall/classify/initAllCheckedSkuClassificatoryForTreeData",jsonData,function(data){
        $.fn.zTree.init($("#treeSkuList"), sku_classify_setting, data.mallClassifies);
        setCheck();
        current_checked_property = data.properties;
        doOnCheck(data.properties);
    });
}

function updateCheckedValues() {
    $("input[id^='choosedProperty_checkbox_']").bind("click", function () {
        var newChecked = {};
        newChecked.skuPropertyName = this.value;
        if(this.checked) {
            current_checked_property.push(newChecked);
        }else{
            removeNotCheckedValue(newChecked.skuPropertyName);
        }
    });
}

function removeNotCheckedValue (val) {
    for (var i = 0; i < current_checked_property.length; i++) {
        if (current_checked_property[i].skuPropertyName == val) {
            current_checked_property.splice(i, 1);
        }
    }
}

var index = parent.layer.getFrameIndex(window.name);//当前窗口的标识

function loadSkuClassList() {
    var jsonData = {};
    jsonData.mallClassifyId = classifyId;
    current_mallClassifyId = classifyId;
    postUtil.call("/mall/classify/initAllCheckedSkuClassificatoryForTreeData",jsonData,function(data){
        $.fn.zTree.init($("#treeSkuList"), sku_classify_setting, data.mallClassifies);
        setCheck();
        current_checked_property = data.properties;
        doOnCheck(data.properties);
    });

    $('#doChooseSkuClassfyBtn').bind("click",function(){
        var treeObj = $.fn.zTree.getZTreeObj("treeSkuList");
        var nodes = treeObj.getCheckedNodes();
        var jsonData = {}, mapData = [], skuClassifyIds = [], k = 0;
        var choosedPropertiesObj = $("input[id^='choosedProperty_checkbox_']");
        for(var i=0;i<nodes.length;i++) {
            var oneData = {};
            var node = nodes[i];
            oneData.mallClassifyId = current_mallClassifyId;
            oneData.skuClassifyId = node.id;
            mapData[i] = oneData;
        }
        $("input[id^='choosedProperty_checkbox_']").each(function(i,element) {
            var oneData = {};
            if(element.checked) {
                oneData.mallClassifyId = current_mallClassifyId;
                oneData.skuPropertyName = element.value;
                skuClassifyIds[k] = oneData;
                k = k + 1;
            }
        });
        jsonData.data = JSON.stringify(mapData);
        jsonData.skuClassifyIds = JSON.stringify(skuClassifyIds);
        postUtil.call("/mall/classify/mappingMallSkuClassify", jsonData, function (result) {
            if (result.STATUS == "SUCCESS") {
                layer.msg("关联成功");
                //window.location.href = "/mall/classify/list";
                parent.loadMallClassList(current_mallClassifyId);
                parent.layer.close(index);//关闭当前窗口
            } else {
                layer.msg(result.MSG);
            }
        });

    });
}

$(document).on("click", "#cancelChooseSkuClassfyBtn", function () {
    parent.layer.close(index);//关闭当前窗口
});

$(function(){
    loadSkuClassList();
})