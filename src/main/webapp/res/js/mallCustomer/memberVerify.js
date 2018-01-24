
var html2="";
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

$(function(){ 
	/*if(status == undefined || status == 'undefined' ||status == '' ){
		status = 'VERIFYING';
	}*/
	loadMallCustomerList(1, status);
}); 
function loadMallCustomerList(currentPageIndex,status) {
    var param = {};
    param.currentPage = currentPageIndex;
    if(status){
    	 param.status = status;
    }
    //alert(JSON.stringify(param));
    postUtil.call("/member/verify/list", param, function (result) {
    	 //alert(JSON.stringify(result));
    	 var pageNumber = result.DATA.pageNumber;
         var pageSize = result.DATA.pageSize;
         var totalPage = result.DATA.totalPage;
         var totalRow = result.DATA.totalRow;
         var dataList = result.DATA.list;
         renderTable(dataList);
            laypage({
                cont: 'paginationDiv',
                pages: totalPage,
                curr: pageNumber,
                total: totalRow,
                skip: true,
                jump: function (obj, first) {
                    if (!first) {
                    	loadMallCustomerList(obj.curr, status);
                    }
                }
            });
    });
}

function renderTable(dataList) {
	var html="";
    var length = dataList.length;
    if (length > 0) {
        for (var i1 = 0; i1 < dataList.length; i1++) {
            var data = dataList[i1]; 
            var operationHtml = "";
            if(data.verifyStatus == 'VERIFYING'){
            	operationHtml  = '<a class="c-h fz12" href="/member/verify/detailPage/' + isExitsVariable(data.verifyId) + '" style="margin-right:5px;">查看详情</a>|<a class="c-h fz12"  style="margin-left:5px;" href="/member/verify/detailPage/' + isExitsVariable(data.verifyId) + '">审核</a>';
            }else{
            	operationHtml  = '<a class="c-h fz12" href="/member/verify/detailPage/' + isExitsVariable(data.verifyId) + '">查看详情</>';
            }
            var verifyStatusCnName = '普通会员';
            if(data.verifyStatus == 'VERIFIED'){
                verifyStatusCnName = '注册会员';
            }
            html+='  <tr>'+
		             '   <td  width="10%">'+isExitsVariable(data.verifyId)+'</td>'+
		             '   <td  width="22%">'+isExitsVariable(data.accountName)+'</td>'+
		             '   <td  width="8%">'+isExitsVariable(data.userName)+'</td>'+
		             '   <td  width="8%">'+ verifyStatusCnName+'</td>'+
		             '   <td  width="15%">'+isExitsVariable(data.mobile)+'</td>'+
		             '   <td  width="8%">'+isExitsVariable(data.verifyStatusName)+'</td>'+
		             '   <td  width="15%">'+isExitsVariable(data.applyTime)+'</td>'+
		             '   <td  width="14%">'+ operationHtml +'</td>'+
		             '  </tr>'
       }
    }
    $(".layui-table tbody").html(html);
}

$(document).on("change",'.form-list input[name=status]',function(){
	var status=$('input[name=status]:checked').val();
	loadMallCustomerList(1,status);
})
