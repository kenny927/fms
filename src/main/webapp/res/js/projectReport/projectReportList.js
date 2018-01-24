
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

layui.use('layer', function() {});

function loadProjectReportList(param) {
	if(_listType=="all"){
	    postUtil.call("/projectReport/list", param, function (result) {
	    	if(result.STATUS=="SUCCESS"){
		    	 var data =result.DATA;
		    	 _currentPage =data.pageNumber;
		    	 var pageNumber = data.pageNumber;
		         var pageSize = data.pageSize;
		         var totalPage = data.totalPage;
		         var totalRow = data.totalRow;
		         var dataList = data.list;
		         renderTable(dataList, 1);
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
	    	}else{
	    		alert(result.MSG);
	    	}

	 });
		
	}else{
	    postUtil.call("/projectReport/myList", param, function (result) {
	     if(result.STATUS=="SUCCESS"){
	    	 var data =result.DATA;
	    	 _currentPage =data.pageNumber;
	    	 var pageNumber = data.pageNumber;
	         var pageSize = data.pageSize;
	         var totalPage = data.totalPage;
	         var totalRow = data.totalRow;
	         var dataList = data.list;
	         rederMyTable(dataList);
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
	     }else{
	    	 alert(result.MSG);
	     }
	 });
		
	}

}

function rederMyTable(dataList){
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
			var authorizationRefuseReason = data.authorizationRefuseReason || '';
			var reportTimeTemp =null;
			if(data.status=="DRAFT"){
			    reportTimeTemp = data.updateDate;
			}else{
				reportTimeTemp = data.commitDate;
			}
            html+='  <tr>'+
                     '   <td><input type="checkbox" name="primary" value="'+data.backupId+'"status="'+data.status+'"projectName="'+data.projectName+"("+isExitsVariable(data.projectLevel)+")"+'"></td>';
            if(data.backupFrom=='DISTRIBUTOR'){
            	html+= '   <td ><a class="fz12 jun-a" href="javascript:viewPrjBackup('  + data.backupId + ')" ' +'>'+isExitsVariable(data.projectName)+"("+isExitsVariable(data.projectLevel)+")"+'</a></td>';
            }else{
            	html+='   <td ><a class="fz12 jun-a" href="javascript:viewPrjBackup(\''+data.backupId+'\')"  ' +'>'+isExitsVariable(data.projectName)+"("+isExitsVariable(data.projectLevel)+")"+'</a></td>';
            }
                     
            	html+='   <td >'+location+'</td>'+
//		             '   <td >'+isExitsVariable(data.projectLevel)+'</td>'+
		             '   <td >'+isExitsVariable(data.secrecyOptName)+'</td>'+
//		             '   <td >'+integratorCompanyName+'</td>'+
		             '   <td >'+proprietorCompanyName+'</td>'+
		             '   <td >'+isExitsVariable(data.mentioner)+'</td>'+
		             '   <td >'+isExitsVariable(data.statusName)+'</td>'+
		             '   <td >'+isExitsVariable(reportTimeTemp)+'</td>';
    			if(data.status=='PROTECTED' && data.invalidDays){
    				html+="<td>剩余<span class='fw-b c-f'>"+(data.invalidDays||'')+"</span>天</td>";
    			}else{
    				html+="<td>"+('')+"</td>";
    			}
       }
    }
    $(".layui-table tbody").html(html);
}
function followProjectBackup(backupId){
	postUtil.submit('/projectReport/backupViewPage',{backupId:backupId,action:'follow'});
}

function renderTable(dataList, type) {
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
                
    			if(data.status=="DRAFT"){
    			    reportTimeTemp = data.updateDate;
    			}else{
    				reportTimeTemp = data.commitDate;
    			}
                html+='  <tr>'+
                         '   <td><input type="checkbox" name="primary" value="'+data.backupId+'"status="'+data.status+'"></td>'+
                         '   <td ><a class="fz12 jun-a" href="javascript:openDetailTab('  + data.backupId + ')" ' +'>'+isExitsVariable(data.projectName)+"("+isExitsVariable(data.projectLevel)+")"+'</a></td>'+
			             '   <td >'+location+'</td>'+
//			             '   <td >'+isExitsVariable(data.projectLevel)+'</td>'+
			             '   <td >'+isExitsVariable(data.secrecyOptName)+'</td>'+
			             '   <td >'+proprietorCompanyName+'</td>'+
			             '   <td >'+isExitsVariable(data.mentioner)+'</td>'+
			             '   <td >'+isExitsVariable(data.statusName)+'</td>'+
			             '   <td >'+isExitsVariable(reportTimeTemp)+'</td>';
		    			 if(data.status=='PROTECTED' && data.invalidDays){
		    				html+="<td>剩余<span class='fw-b c-f'>"+(data.invalidDays||'')+"</span>天</td>";
		    			 }else{
		    				html+="<td>"+('')+"</td>";
		    			 }
//			             if(data.status=='PROTECTED_INVALID'){
//			            	 html+=	 ' <td><a class="fz12" href="javascript:openDetailTab('  + data.backupId + ')" ' +' style="color:#428bca">查看</a>'
//			            	 +'<br><a class="c-h  fz12" href="javascript:viewReason(\'查看失效原因\',\'PROTECTED_INVALID\',\''+data.backupId+'\');">失效原因</a></td>'+
//			            	 + '  </tr>';
//			             }else if(data.status=='FAILED'){
//			            	 html+=	 ' <td><a href="javascript:openDetailTab('  + data.backupId + ')" ' +' style="color:#428bca">查看</a>'
//			            	 +'<br><a class="c-h  fz12" href="javascript:viewReason(\'查看失败原因\',\'FAILED\',\''+data.backupId+'\');">失败原因</a></td>'+
//			            	 +'   </tr>';
//			             }else{
//			            	 html+=	 ' <td><a  class="fz12" href="javascript:openDetailTab('  + data.backupId + ')" ' +' style="color:#407fe7">查看</a>'
//			            	 + '  </tr>';
//			             }

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
//	var status=$('#allTheValue').val();//allTheValue的id是在MultiSelectDropList.js定义
    var status = $('#status_hidden').val();
    //var backupGrantAuthorizationStatus = $('#applyStatus_hidden').val();
	var param={};
	param.projectNameLike=projectNameLike;
	param.projectLevel=projectLevel;
	param.distributorAccountNameLike=distributorAccountNameLike;
	param.status=status;
	param.backupFrom=backupFrom;
	//param.backupGrantAuthorizationStatus=backupGrantAuthorizationStatus;
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
			skin:'msgskin',
			scrollbar: false,
			area: ['600px', '360px'],
			fixed: false, //不固定
			maxmin: true,
			content: ['/projectReport/setToInvalidWindow/' + ids,'no'],
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

function deletePrjBackup(){
	var inputs= $('input[name=primary][type=checkbox]:checked');
	var backupIds = '';
	for (var i = 0; i < inputs.length; i++) {
		   if(inputs.eq(i).attr("status")=="DRAFT"||inputs.eq(i).attr("status")=="COMPLETE_CHECK_REJECT"){
			   backupIds += inputs[i].value + ";";
		   }else{
    			layer.open({
	     			  title: '操作提示',
	     			  skin: 'msgskin',
	     			  area: ['350px', '280px'],
	     			  btnAlign: 'c',
	     			  content: '<p style="text-align: center;margin-top: 50px;">'+"项目："+inputs.eq(i).attr("projectName")+"状态不允许项目被删除"+'<span style="color:#fd4800"></span></p>',
	     			  btn: ['确认关闭'],
	     			  yes: function(index, layero){
	     			    //关闭委托单的回调
	     			    layer.close(index);
	     			  },
	     			  cancel: function(){ 
	     			    //右上角关闭回调
	     			  }
	     			});
    			
    			
    			return;
		   }
			
	}
   $.get('/pages/projectReport/msg/delete.html', {}, function(str){
       layer.open({
           title: '操作提示',
           skin: 'msgskin',
           area: ['480px', '250px'],
           btnAlign: 'c',
           content: str,
           btn: ['确认','取消'],
           yes: function(index, layero){
        	   postUtil.call('/projectReport/backupDelete',{backupIds:backupIds},function(data){
        		   if(data.success){
        			   postUtil.submit('/projectReport/myPreReportList',null);
        		   }
        	   });
           },
           btn2:function(index,layero){
        	   layer.close(index);
           },
           cancel: function(){ 
             //右上角关闭回调
           }
       });
   });
}

function authorizationApplication(backupId){
		layer.open({
			title: '项目授权申请',
			type: 2,
			skin: 'jun-close1',
			scrollbar: false,
			area: '720px',
			content: ['/orderProjectBackupGrantAuthorization/authorization?backupId=' + backupId,"no"],
			btn: ['确定', '取消'],
			btnAlign: 'c',
			yes: function (index, layero) {
				var param = {};
				var data = [];
				var body = layer.getChildFrame('body', index);
				body.find("input[name=chooseIntegratorsCb]:checked");
				$.each(body.find("input[name=chooseIntegratorsCb]:checked"), function (n, item) {
					var tempItem = {};
					tempItem.integratorId = $(item).parent().find("input[name=integratorCreditId]").val();
					tempItem.integratorCompanyName = $(item).parent().find("input[name=integratorCompanyName]").val();
					data[n] = tempItem;
				});
				if (data.length < 1) {
					layer.alert("请至少选择一个集成商！", {icon: 5});
					return false;
				}
				param.backupId = backupId;
				param.data = JSON.stringify(data);
				postUtil.call('/orderProjectBackupGrantAuthorization/submitAuthorization', param, function (data) {
					if (data.success) {
						layer.open({
							title: '操作提示',
							skin: 'youskin',
							area: ['480px', '300px'],
							btnAlign: 'c',
							content: '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin-top: 30px;font-size:12px;color:#222222">' + data.msg + '</p>',
							btn: ['关闭'],
							yes: function (index, layero) {
								cardUtil.refreshCard("我的项目");
								//postUtil.submit('/projectBackup/backuplistPage',null);
							}
						});
					} else {
						layer.alert(data.msg, {icon: 5});
					}
				})
			}
			, btn2: function (index, layero) {

			}
		});
}

function viewPrjBackup(backupId){
    cardUtil.openCard("项目详情-" + backupId,"/projectReport/backupViewPage?backupId=" + backupId);
    cardUtil.changeCard("项目详情-" + backupId);
}

function viewReasonLoaded(title, content) {
	var html ='<body>'+
		'<div class="t-c jun-close fz14 c-2 mb20-i"  style="margin-top: 30px; ">'+
		'<span class="iconfont icon-jinggao-copy c-f mr5 mt5" style="font-size: 24px">'+
		'</span>'+content
	'</div>'+
	'</body>'
	layer.open({
		title: title,
		skin: 'jun-close',
		area: ['480px', '270px'],
		btnAlign: 'c',
		content: html,
		btn: ['关闭'],
		yes: function (index, layero) {
			//关闭委托单的回调
			layer.close(index);
		},
		cancel: function () {
			//右上角关闭回调
		}
	});
}