
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
	var param={};
	param.currentPageIndex=1;
	loadDATA(param);
}); 


function loadDATA(param) {
    postUtil.call("/customer/salesOpportunity/list", param, function (result) {
    	 var pageNumber = result.pageNumber;
         var pageSize = result.pageSize;
         var totalPage = result.totalPage;
         var totalRow = result.totalRow;
         var dataList = result.list;
         renderTable(dataList);
            laypage({
                cont: 'paginationDiv',
                pages: totalPage,
                curr: pageNumber,
                total: totalRow,
                skip: true,
                jump: function (obj, first) {
                    if (!first) {
                    	param.currentPageIndex=obj.curr;
                    	loadDATA(param);
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
                var stringDemand  = null;
                if(data.vagueDemandId==null||data.vagueDemandId==""){
                	stringDemand ="否";
                }else{
                	stringDemand ="是";
                }
                html+='  <tr>'+
			             '   <td>'+isExitsVariable(data.createTime)+'</td>'+
			             '   <td>'+isExitsVariable(data.accountName)+'</td>'+
			             '   <td>'+isExitsVariable(data.oppTypeCname)+'</td>'+
			             '   <td>'+isExitsVariable(data.sourceCname)+'</td>'+
			             '   <td>'+isExitsVariable(data.createUserName)+'</td>'+
			             '   <td><p>'+isExitsVariable(data.linkmanName)+'</p><p>'+isExitsVariable(data.linkmanTelephone)+'</p></td>'+
			             '   <td ><p style="width:120px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+isExitsVariable(data.remark)+'">'+isExitsVariable(data.remark)+'</p></td>'+
			             '   <td>'+isExitsVariable(stringDemand)+'</td>'+
			             '   <td><p>'+isExitsVariable(data.isTransmit)+'</p><p>'+isExitsVariable(data.transmitUserC)+'</p></td>'+
			             '   <td>'+isExitsVariable(data.province)+'</td>'+
			             '  </tr>'
           }
        }else{
        	 html+='<tr>'+
        	 		'<td  colspan="9" height="50px"  align="center">'+
        	 		'<span class="fz16">暂无相关信息</span> '+
        	 		'</td>'+
        	 		'</tr>'
        }
        $(".customerOpportunityTable tbody").html(html);
    }
function searchData(){
	var dateStr=$("#date-range0").val();
	var accountName=$('#accountName').val();
	var createUser=$('#createUser').val();
	var oppType = $('#oppTypeSelect1 #status_hidden').val();
	var param={};
	param.accountName=accountName;
	param.createUser=createUser;
	param.oppType=oppType;
	param.dateStr=dateStr;
	param.currentPageIndex=1;
	loadDATA(param);
}


function exportData(){
	var dateStr=$("#date-range0").val();
	var accountName=$('#accountName').val();
	var oppType = $('#oppTypeSelect1 #status_hidden').val();
	var createUser=$('#createUser').val();
	var param={};
	param.accountName=accountName;
	param.oppType=oppType;
	param.dateStr=dateStr;
	param.currentPageIndex=1;
	param.createUser=createUser;
	postUtil.submit("/customer/salesOpportunity/exportExcel",param);
	
}