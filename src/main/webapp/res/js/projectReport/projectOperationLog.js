/**
 * Created by roger on 2017/5/4.
 */
$(function () {
    if(backupId == '' || typeof(backupId) == 'undefined' ){
        $('#operationPaginationTbl').parent().hide();
        return;
    }
    var param = {};
    param.currentPage = 1;
    param.backupId = backupId;
    loadOperationLogs(param);
})

function loadOperationLogs(param) {
    postUtil.call("/projectReport/operationLog", param, function (result) {
        //alert(JSON.stringify(result));
        var pageNumber = result.DATA.pageNumber;
        var pageSize = result.DATA.pageSize;
        var totalPage = result.DATA.totalPage;
        var totalRow = result.DATA.totalRow;
        var dataList = result.DATA.list;
        if(dataList.length < 1){
            return;
        }
        renderOperationLogsTable(dataList);
        laypage({
            cont: 'operationPaginationDiv',
            pages: totalPage,
            curr: pageNumber,
            total: totalRow,
            skip: true,
            jump: function (obj, first) {
                if (!first) {
                    param.currentPage = obj.curr;
                    param.backupId = backupId;
                    loadOperationLogs(param);
                }
            }
        });
    });
}

function renderOperationLogsTable(dataList) {
    var html="";
    var length = dataList.length;
    if (length > 0) {
        for (var i1 = 0; i1 < dataList.length; i1++) {
            var data = dataList[i1];
            html += '<tr>';
            html += '<td>' + moment(isExitsVariable(data.createTime)).format("YYYY-MM-DD HH:mm:ss") + '</td>';
            html += '<td>' + isExitsVariable(data.operator) + '</td>';
            html += '<td>' + isExitsVariable(data.typeCName) + '</td>';
            html += '<td>' + isExitsVariable(data.comment) + '</td>';
            html += '</tr>';
        }
    }else{
        $('#operationPaginationTbl').parent().hide();
    }
    $("#operationPaginationTbl tbody").html(html);
}

function isExitsVariable(variableName) {
    try {
        if (typeof (variableName) == "undefined") {
            return "";
        } else if ( variableName == null) {
            return "";
        }else {
            return variableName;
        }
    } catch (e) {
    }
    return "";
}
