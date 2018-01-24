/**
 * Copy from roger on 2017/3/22.
 */
var IDMark_Switch = "_switch",
    IDMark_Icon = "_ico",
    IDMark_Span = "_span",
    IDMark_Input = "_input",
    IDMark_Check = "_check",
    IDMark_Edit = "_edit",
    IDMark_Remove = "_remove",
    IDMark_Ul = "_ul",
    IDMark_A = "_a";
var department_modal_zTree;
var data_changeNodes = {};
var newCount = 1;
var log, className = "dark", max_department = 3, blHasSort = false;
var department_modal_setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: false,
        // removeTitle: "删除",
        showRenameBtn: false,
        // renameTitle: "修改"
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
        beforeDrop: beforeDrop,
        beforeClick: beforeClick,
        onClick: onClick
    }
};

var currentDepartmentId = "";
function beforeClick(treeId, treeNode, clickFlag) {

}

function onClick(event, treeId, treeNode, clickFlag) {
    currentDepartmentId = treeNode.id;
    initData();
}

function beforeEditName(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    // showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    department_modal_zTree.selectNode(treeNode);
    setTimeout(function() {
        department_modal_zTree.editName(treeNode);
    }, 0);
    return false;
}


function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].level == 0) {
            return false;
        }
    }
    return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    if(targetNode.level == 0 && (moveType == "next" || moveType =="prev")){
        return false;
    }
    var treeNode = treeNodes[0];
    //拖到目标节点的前后位置
    if(moveType == "next" || moveType =="prev") {
        updateDepartment(treeNode.id, treeNode.name, targetNode.pId);
    } else if(moveType == "inner") {
        //拖到目标节点里面
        updateDepartment(treeNode.id, treeNode.name, targetNode.id);
    }

    //切换当前节点为拖放的节点
    currentDepartmentId = treeNode.id;
    initData();

    return true;
}
function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    //showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    department_modal_zTree.selectNode(treeNode);

    return true;
}

function onRemove(e, treeId, treeNode) {

}
function beforeRename(treeId, treeNode, newName, isCancel) {
    className = (className === "dark" ? "":"dark");
    showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
    if (newName.length == 0) {
        setTimeout(function() {
            department_modal_zTree.cancelEditName();
            layer.msg("节点名称不能为空",{icon:5});
        }, 0);
        return false;
    } else if(treeNode.name == newName) {
        setTimeout(function() {
            department_modal_zTree.cancelEditName();
        }, 0);
        return false;
    }
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    updateDepartment(treeNode.id, treeNode.name, treeNode.pId);
    // showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
}

function showRemoveBtn(treeId, treeNode) {
    //是否显示删除按钮, 只能删除没有子节点的节点
    // return !treeNode.isParent;
    return treeNode.level != 0;
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
    var sObj = $("#" + treeNode.tId + "_a");
    if ($("#addBtn_"+treeNode.tId).length>0
     || $("#editBtn_"+treeNode.tId).length>0
     || $("#delBtn_"+treeNode.tId).length>0) return;
    // if (treeNode.level == 0) return;
    var addStr = "";

    if (treeNode.level == 0) {
        addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增' onfocus='this.blur();'></span>";
    } else {
        addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增' onfocus='this.blur();'></span>"
            + "<span class='button edit' id='editBtn_" + treeNode.tId
            + "' title='修改' onfocus='this.blur();'></span>"
            +"<span class='button remove' id='delBtn_" + treeNode.tId
            + "' title='删除' onfocus='this.blur();'></span>";
    }

    sObj.after(addStr);

    var btn = $("#addBtn_"+treeNode.tId);
    //新增
    if (btn) btn.bind("click", function(){
        var isLeaf = 0;
        var dbLevel;
        //检查分类级别，是否为最大级别
        if(treeNode.level + 1  == max_department){
            isLeaf = 1;
        }
        var newNodeId = "temp" + 100 + newCount;
        var newNodeName = "新增部门" + (newCount++);

        //记录新增节点
        addDepartment(newNodeName, treeNode);
        return false;
    });


    var btnEdit = $("#editBtn_"+treeNode.tId);

    //修改
    if (btnEdit) btnEdit.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("tree"),
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            layer.msg("请先选择一个节点",{icon:5});
            return;
        }
        zTree.editName(treeNode);
    });

    var btnDel = $("#delBtn_"+treeNode.tId);

    //删除
    if (btnDel) btnDel.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("tree"),
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
        if (nodes.length == 0) {
            layer.msg("请先选择一个节点",{icon:5});
            return;
        }
        layer.confirm('确认删除 节点 -- <span class="fz14 c-f fw-b">['+treeNode.name+']</span>吗？', {
            btn: ['确定', '取消']
        }, function(index, layero){
            deleteDepartment(treeNode.id);
            zTree.removeNode(treeNode, true);
            layer.close(index);
        }, function(index){
            layer.close(index);
        });
    });

};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
    $("#editBtn_"+treeNode.tId).unbind().remove();
    $("#delBtn_"+treeNode.tId).unbind().remove();
};


function loadEditDepartment(){
    resetChangeNodesList();
    postUtil.call("/authorityDepartment/listALlJsonForZTree",null,function(data){
        $.fn.zTree.init($("#tree"), department_modal_setting, data);
        department_modal_zTree = $.fn.zTree.getZTreeObj("tree");
        department_modal_zTree.setting.edit.drag = {};
        department_modal_zTree.setting.edit.drag.prev = true;
        department_modal_zTree.setting.edit.drag.next = true;
        department_modal_zTree.setting.edit.drag.inner = true;
        department_modal_zTree.setting.edit.drag.isMove = true;
        if(selectDepartmentId) {
            var nodes = department_modal_zTree.transformToArray(department_modal_zTree.getNodes());
            if (nodes.length>0) {
                $.each(nodes, function (index, node) {
                    if(node.id == selectDepartmentId) {
                        department_modal_zTree.selectNode(node);
                        currentDepartmentId = selectDepartmentId;
                        initData();
                        return false;
                    }
                });
            }
        }
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

function addDepartment(departmentName, treeNode) {
    layer.load();
    var param = {};
    param.departmentName = departmentName;
    param.pDepartmentId = treeNode.id;
    postUtil.call("/authorityDepartment/addSimpleDepartment",{jsonData:JSON.stringify(param)},function(res){
        if(res.STATUS = "SUCCESS") {
            layer.msg("新增成功");
            var department = res.DATA;
            department_modal_zTree.addNodes(treeNode, {id: department.departmentId, pId:treeNode.id, name:departmentName});
        } else {
            layer.msg("新增失败，错误信息如下:<br>" + res.MSG, {icon: 5});
        }
        layer.closeAll("loading");
    });
}

function updateDepartment(departmentId, departmentName, pDepartmentId) {
    layer.load();
    var param = {};
    param.departmentId = departmentId;
    param.departmentName = departmentName;
    param.pDepartmentId = pDepartmentId;
    postUtil.call("/authorityDepartment/update",{jsonData:JSON.stringify(param)},function(res){
        if(res.STATUS = "SUCCESS") {
            layer.msg("更新成功");
        } else {
            layer.msg("更新失败，错误信息如下:<br>" + res.MSG, {icon: 5});
        }
        layer.closeAll("loading");
    });
}

function deleteDepartment(departmentId) {
    layer.load();
    postUtil.call("/authorityDepartment/delete",{departmentId:departmentId},function(res){
        if(res.STATUS = "SUCCESS") {
            layer.msg("删除成功");
        } else {
            layer.msg("删除失败，错误信息如下:<br>" + res.MSG, {icon: 5});
        }
        currentDepartmentId = "";
        clearData();
        layer.closeAll("loading");
    });
}


$(function(){
    loadEditDepartment();
});