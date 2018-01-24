/**
 * Created by roger on 2017/1/16.
 */
var classify_modal_zTree;
var data_changeNodes = {};
var newCount = 1;
var log, className = "dark", max_classify = 3, blHasSort = false;
var classify_modal_setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename,
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop
    }
};

function beforeEditName(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    classify_modal_zTree.selectNode(treeNode);
    setTimeout(function() {
        classify_modal_zTree.editName(treeNode);
    }, 0);
    return false;
}
function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    //showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    classify_modal_zTree.selectNode(treeNode);
    if(confirm("确认删除 节点 -- " + treeNode.name + " 吗？")){
        var nodeData = {};
        nodeData.classifyId = treeNode.id;
        nodeData.classifyName = treeNode.name;
        nodeData.operateIndex = new Date().getTime();
        nodeData.removeFlag = 1;
        data_changeNodes.removeList.push(nodeData);
        return true;
    };
    return false;
}

function beforeDrag(treeId, treeNodes) {
    // for (var i=0,l=treeNodes.length; i<l; i++) {
    //     if (treeNodes[i].level != max_classify) {
    //         return false;
    //     }
    // }
    return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    if(treeNodes[0].level == targetNode.level){
        blHasSort = true;
        return true;
    }
    return false;
}

function onRemove(e, treeId, treeNode) {

}
function beforeRename(treeId, treeNode, newName, isCancel) {
    className = (className === "dark" ? "":"dark");
    showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
    if (newName.length == 0) {
        setTimeout(function() {
            classify_modal_zTree.cancelEditName();
            layer.msg("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    //记录改名的节点
    var isLeaf, nodeData = {};
    if(treeNode.level  == max_classify){
        isLeaf = 1;
    }else{
        isLeaf = 0;
    }
    nodeData.classifyId = treeNode.id;
    nodeData.classifyName = treeNode.name;
    nodeData.operateIndex = new Date().getTime();
    nodeData.classifyParentId = treeNode.pId;
    nodeData.level = treeNode.level;
    nodeData.isLeaf = isLeaf;
    data_changeNodes.renameList.push(nodeData);
    showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
}

function showRemoveBtn(treeId, treeNode) {
    //是否显示删除按钮, 只能删除没有子节点的节点
    return !treeNode.isParent;
}
function showRenameBtn(treeId, treeNode) {
    //是否显示修改节点按钮
    return treeNode.level != 0;
}
function showLog(str) {
    if (!log) log = $("#log");
    log.append("<li class='"+className+"'>"+str+"</li>");
    if(log.children("li").length > 8) {
        log.get(0).removeChild(log.children("li")[0]);
    }
}
function getTime() {
    var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds(),
        ms=now.getMilliseconds();
    return (h+":"+m+":"+s+ " " +ms);
}

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    if (treeNode.level == max_classify) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);

    if (btn) btn.bind("click", function(){
        var isLeaf = 0;
        var dbLevel;
        //检查分类级别，是否为最大级别
        if(treeNode.level + 1  == max_classify){
            isLeaf = 1;
        }
        var newNodeId = "temp" + 100 + newCount;
        var newNodeName = "新增分类" + (newCount++);
        classify_modal_zTree.addNodes(treeNode, {id: newNodeId, pId:treeNode.id, name:newNodeName});

        //记录新增节点
        var nodeData = {};
        nodeData.classifyId = newNodeId;
        nodeData.classifyName = newNodeName;
        nodeData.operateIndex = new Date().getTime();
        nodeData.classifyParentId = treeNode.id;
        nodeData.level = treeNode.level + 1;
        nodeData.isLeaf = isLeaf;
        data_changeNodes.addList.push(nodeData);
        blHasSort = true;
        return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

var index = parent.layer.getFrameIndex(window.name);//当前窗口的标识

function loadEditMallClass(){
    // $('#chooseMallClassfyBtn').bind("click",function(){
        resetChangeNodesList();
        // $('#chooseMallClassfyModal').modal("show");
        postUtil.call("/mall/classify/getMallClassificatoryForZTree",null,function(data){
            $.fn.zTree.init($("#treeMallList"), classify_modal_setting, data);
            classify_modal_zTree = $.fn.zTree.getZTreeObj("treeMallList");
            classify_modal_zTree.setting.edit.drag.prev = true;
            classify_modal_zTree.setting.edit.drag.next = true;
            classify_modal_zTree.setting.edit.drag.inner = false;
        });
    // });

    $('#doChooseMallClassifyBtn').bind("click",function(){
        var jsonData = {}, newClassifySort = [], data_changeNodes_str;
        //收集增删改节点
        //收集排序
        if(blHasSort){
            var nodes = classify_modal_zTree.transformToArray(classify_modal_zTree.getNodes());
            for(var i=0; i<nodes.length; i++){
                var node = nodes[i], oneData={};
                oneData.classifyId = node.id;
                oneData.sort = i;
                newClassifySort[i] = oneData;
            }
        }
        data_changeNodes.sortData = newClassifySort;
        data_changeNodes_str = JSON.stringify(data_changeNodes);
        jsonData.data = data_changeNodes_str;
        postUtil.call("/mall/classify/newOrUpdateClasifys",jsonData,function(data){
            $.fn.zTree.init($("#treeMallList"), classify_modal_setting, data);
            classify_modal_zTree = $.fn.zTree.getZTreeObj("treeMallList");
            parent.layer.close(index);//关闭当前窗口
            parent.loadMallClassList();
            resetChangeNodesList();
        });
    });

    $(document).on("click", "#cancelChooseMallClassifyBtn", function () {
        parent.layer.close(index);//关闭当前窗口
    });
}

function resetChangeNodesList(){
    data_changeNodes.renameList = [];
    data_changeNodes.removeList = [];
    data_changeNodes.addList = [];
    data_changeNodes.picData = [];
    data_changeNodes.sortData = [];
    blHasSort = false;
}

$(function(){
    loadEditMallClass();
});