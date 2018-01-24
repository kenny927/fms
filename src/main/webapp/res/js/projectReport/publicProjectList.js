
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
	param.currentPage=1;
	loadProjectReportList(param);
}); 
function loadProjectReportList(param) {
	    postUtil.call("/projectReport/queryPublicProjectList", param, function (result) {
	    	 var data =result.DATA;
	    	 _currentPage =data.pageNumber;
	    	 var pageNumber = data.pageNumber;
	         var pageSize = data.pageSize;
	         var totalPage = data.totalPage;
	         var totalRow = data.totalRow;
	         var dataList = data.list;
	         renderTable(dataList);
	            laypage({
	                cont: 'paginationDiv',
	                pages: totalPage,
	                curr: pageNumber,
	                total: totalRow,
	                skip: true,
	                jump: function (obj, first) {
	                    if (!first) {
	                    	param.currentPage=obj.curr;
	                    	loadProjectReportList(param);
	                    }
	                }
	            });
	 });
}
function viewSkuDetail(backupId){
	var html ='<body>'+
				'<div class="t-c jun-close fz14 c-2"  style="margin-top: 0px; ">'+
				'<table class="layui-table pop" lay-skin="line">'+
			    '<colgroup>'+
			      '<col  width="200">'+
			      '<col  width="100">'+
			      '<col  width="400">'+
			      '<col  width="100">'+
			      '<col  width="150">'+
			    '</colgroup>'+
			    '<thead>'+
			    '<tr>'+
			      '<th >商品型号</th>'+
			      '<th >品牌</th>'+
			      '<th >商品名称</th>'+
			      '<th >数量</th>'+
			      '<th >计量单位</th>'+
			    '</tr> '+
			    '</thead>'+
			    '<tbody>'+
			    '#{detail}'+
			    '</tbody>'+
			    '</table>'+
				'</div>'+
			  '</body>';
	postUtil.call('/projectReport/viewSkuDetail',{backupId:backupId},function(response){
		if(response.success){
			var detailList = response.data
			var detail='';
			$.each(detailList,function(index,element){
				detail+='<tr>'
				detail+='<td>'+element.skuModel+'</td>';
				detail+='<td>'+element.skuBrandName+'</td>';
				detail+='<td>'+element.skuName+'</td>';
                //根据单位名称获取输入小数位数
                var precision = 3;
                if(unitConfig[element.skuUnitName] != undefined) {
                    precision = unitConfig[element.skuUnitName];
                }
				detail+='<td>'+parseFloat(element.skuQuantity).toFixed(precision)+'</td>';
				detail+='<td>'+element.skuUnitName+'</td>';
				detail+='</tr>'
			});
			html = html.replace('#{detail}',detail);
		    layer.open({
		        title: '查看商品',
		        skin: 'jun-close',
		        area: ['980px', '350px'],
		        btnAlign: 'c',
		        content: html,
		        btn: ['关闭'],
		        yes: function(index, layero){
		          //关闭委托单的回调
		           layer.close(index);
		        },
		        cancel: function(){ 
		          //右上角关闭回调
		        }
		    });
		}
	});
}
function renderTable(dataList) {
		var html="";
        var length = dataList.length;
        if (length > 0) {
            for (var i1 = 0; i1 < dataList.length; i1++) {
                var data = dataList[i1]; 
                var location='';
                if(isExitsVariable(data.projectProvince)==isExitsVariable(data.projectCity)){
                	location=isExitsVariable(data.projectProvince);
                }else{
                	location=isExitsVariable(data.projectProvince)+isExitsVariable(data.projectCity);
                }
                var integratorCompanyName ='';
                var proprietorCompanyName ='';
                if(data.moreIntegrator=="Y"){
                	integratorCompanyName=integratorCompanyName+isExitsVariable(data.integratorCompanyName)+"...(联合)";
                }else{
                	integratorCompanyName=integratorCompanyName+isExitsVariable(data.integratorCompanyName);
                }
                if(data.moreProprietor=="Y"){
                	proprietorCompanyName=proprietorCompanyName+isExitsVariable(data.proprietorCompanyName)+"...(联合)";
                }else{
                	proprietorCompanyName=proprietorCompanyName+isExitsVariable(data.proprietorCompanyName);
                }
                
    			var reportTimeTemp =null;
    			if(data.status=="DRAFT"){
    			    reportTimeTemp = data.updateDate;
    			}else{
    				reportTimeTemp = data.commitDate;
    			}
    			
                html+='  <tr>'+
                         '   <td >'+isExitsVariable(reportTimeTemp)+'</td>'+
                         '   <td >'+isExitsVariable(data.projectName)+"("+isExitsVariable(data.projectLevel)+")"+'</td>'+
                         '   <td >'+proprietorCompanyName+'</td>'+
			             '   <td >'+location+'</td>'+
//			             '   <td >'+isExitsVariable(data.projectLevel)+'</td>'+
			             '   <td >'+isExitsVariable(data.mentioner)+'</td>'+
			             '   <td >'+isExitsVariable(data.statusName)+'</td>'+
			             '   <td >'+isExitsVariable(data.salesManager)+'</td>';
                if(data.isOpenSku=='Y'){
                	html+='<td><a style="color:#407fe7" href="javascript:viewSkuDetail(\''+data.backupId +'\');">查看商品</a></td>';
                }else{
                	html+='<td></td>';
                }
			        html+='  </tr>';

           }
        }
        $(".layui-table tbody").html(html);
    }


function viewReason(title,type,backupId){
	var html ='<body>'+
				'<div class="t-c jun-close fz14 c-2"  style="margin-top: 30px; ">'+
					'<span class="iconfont icon-jinggao-copy c-f mr5 mt5" style="font-size: 24px">'+
					'</span>#{reason}'+
				'</div>'+
			  '</body>';
	postUtil.call('/projectReport/viewReason',{type:type,backupId:backupId},function(response){
		if(response.STATUS=="SUCCESS"){
			html = html.replace('#{reason}',response.DATA);
			layui.use('layer', function(){
		    layer.open({
		        title: title,
		        skin: 'jun-close',
		        area: ['480px', '250px'],
		        btnAlign: 'c',
		        content: html,
		        btn: ['关闭'],
		        yes: function(index, layero){
		          //关闭委托单的回调
		           layer.close(index);
		        },
		        cancel: function(){ 
		          //右上角关闭回调
		        }
		     });
			});
		}
	});
}
function search(){
	var projectNameLike=$('#projectNameLike').val();
	var distributorAccountNameLike=$('#distributorAccountNameLike').val();
	var projectLevel=$('#projectLevel').find("option:selected").val();
	var backupFrom=$('#backupFrom').find("option:selected").val();
//	var backupGrantAuthorizationStatus=$('#backupGrantAuthorizationStatus').find("option:selected").val();
	var status = $('#status_hidden').val();
	var param={};
	param.projectNameLike=projectNameLike;
	param.projectLevel=projectLevel;
	param.distributorAccountNameLike=distributorAccountNameLike;
	param.status=status;
	param.backupFrom=backupFrom;
//	param.backupGrantAuthorizationStatus=backupGrantAuthorizationStatus;
	param.currentPage=1;
	loadProjectReportList(param);
}


function openDetailTab(backupId){
    cardUtil.openCard("项目详情-" + backupId,"/projectReport/projectDetail?backupId=" + backupId);
    cardUtil.changeCard("项目详情-" + backupId);
}

function setToInvalid(){
	var len = $("input[type=checkbox][name=primary]:checked").length;
	if(len==0){
		alert("请选中一条数据");
		return ;
	}
	var projectList = $("input[type=checkbox][name=primary]:checked");
	var backUpIds =[];
	for(var i=0;i<projectList.length;i++){
		backUpIds.push(projectList[i].value);
	}
	var ids = JSON.stringify(backUpIds);
	layui.use('layer', function(){
	layer.open({
			title: '置为失效',
			type: 2,
			skin:'myskin',
			scrollbar: false,
			area: ['600px', '360px'],
			fixed: false, //不固定
			maxmin: true,
			content: '/projectReport/setToInvalidWindow/' + ids,
			btn: ['确定','取消'],
			btnAlign: 'c',
			yes: function(index, layero){
				var body = layer.getChildFrame('body', index);
				var textarea = body.find("textarea");
				if(textarea){
					if($(textarea).val().length < 1){
						layer.msg('请填写失效原因！', {icon: 5});
						return;
					}
				}else{
					return;
				}
				var reason= textarea.val();
				postUtil.call("/projectReport/setToInvalid",{"backUpIds":JSON.stringify(backUpIds),"reason":reason},function(result){
					if(result.STATUS=="SUCCESS"){
						layui.use('layer', function(){
							var layer = layui.layer;
							layer.msg("置为失效操作成功！",{"icon":"6"});
						});
						//刷新页面
						var param ={};
						param.currentPage=_currentPage;
						loadProjectReportList(param);
						
						}else{
							layui.use('layer', function(){
								var layer = layui.layer;
								layer.msg(result.MSG,{"icon":"5"});
							});
					}
				});
				layer.close(index);
			}
			,btn2: function(index, layero){
		
			}
		});
	})

}


