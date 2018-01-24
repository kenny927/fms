function addVisit(){
//	if($("#visitForm").css("display")=="block"){
//		var html = $("#form1").html();
//		$("#visitForm").find(".t-c").before('<form id="form1" class="layui-form layui-form-pane jun-form-s" action="">'+html+'</form>'); 
//	}else{
//		$("#visitForm").css("display","block");
//	}
	$("#visitForm").css("display","block");
//	form.render();
	scrollToEnd();
}

function cancel(){
	$("#visitForm").css("display","none");
	scrollToEnd();
}

function scrollToEnd(){//滚动到底部
    var h = $(document).height()-$(window).height();
    $(document).scrollTop(h); 
}

function renderOtherVisitLinkMan(thiz){
	var html ='<div class="layui-form-item inline mb5" style="margin-left:15px;margin-bottom:7px;">'+
        		'<div class="layui-inline">'+
        			'<label class="layui-form-label" style="width:90px;"><span class="c-f">*</span>联系人：</label>'+
        			'<div class="layui-input-block" style="margin-left: 90px;">'+
        				'<input  style="width: 240px;"  type="text" name="visitLinkMan" autocomplete="off" placeholder="请填写联系人" class="layui-input">'+
        			'</div>'+
        		'</div>'+
        	  '</div>'+
        	  '<div class="layui-form-item inline mb5 ml10 visitLinkMobile" style="margin-bottom:7px;">'+
        	  	'<div class="layui-inline">'+
        	  		'<label class="layui-form-label"  style="width:90px;"><span class="c-f">*</span>联系电话：</label>'+
        	  		'<div class="layui-input-block" style="margin-left: 100px;">'+
        	  			'<input  style="width: 240px;"  type="text" name="visitLinkMobile" autocomplete="off" placeholder="请输入联系电话" class="layui-input ">'+
        	  			'<span class="jun-wrong-msg c-f" style="display:none">请输入正确的电话号码</span>'+
        	  		'</div>'+
        	  	'</div>'+
        	  '</div>';
	$(".visitLinkContent").html(html);
}
function removeOtherVisitLinkMan(thiz){
	/*var dom = $(thiz).parent().parent().parent().next();
	if(dom.hasClass('visitContentDescriptor')){
		return;
	}*/
	$(".visitLinkContent").html("");
	//$(thiz).parent().parent().parent().next().remove();
}

//保存拜访跟进信息
function saveVisitFollow(){
	if(!validate()){
		return ;
	}
	var data = $("#visitForm").find("form").serialize();
	postUtil.call(contextPath+"/projectReport/addBackupFollow",data+"&backupId="+backupId,function(response){
		if(response.success){
			//postUtil.submit(contextPath+"/projectReport/myPreReportList",null);
			window.location.reload();
		} else {
			layer.msg(response.data, {icon: 5});
		}
	});
}
function saveProjectBakupInfo(){
   var secrecyAreaArray= $("#secrecyArea").val(); 
   var secrecyOpt =$("input[name=secrecyOpt]:checked").val();
   var secrecyArea='';
   if(secrecyOpt=='OPEN_TO_SOMEAREA'){
	   if(secrecyAreaArray.length==0){
		   $('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").show();
		   $('.ms-choice').addClass("bor-ff");
		   return;
	   }
		for(var i=0;i<secrecyAreaArray.length;i++){
			secrecyArea+=secrecyAreaArray[i]+",";
		}
   }
   var isOpenSku = $("input[name=isOpenSku]:checked").val();
   if(!validateProprietorAndIntegrator()){
	   $(".bor-ff")[0].focus();
	   return;
   }
   var param={
		backupId:backupId,
		secrecyOpt:secrecyOpt,
		secrecyArea:secrecyArea,
		isOpenSku:isOpenSku,
		projectNumber:$('input[name=projectNumber]').val(),
		projectProtectDate:$('input[name=projectProtectDate]').val(),
		predictFiberKilometers:$('input[name=predictFiberKilometers]').val(),
		predictAmount:$('input[name=predictAmount]').val()
   };
   var integratorList = getIntegratorNew();
   if(integratorList.length>0){
	   param.integratorList= JSON.stringify(integratorList);
   }
   var proprietorList =getProprietorNew();
   if(proprietorList.length>0){
	   param.proprietorList= JSON.stringify(proprietorList);
   }
   postUtil.call(contextPath+"/projectReport/saveSecrecyOpt",param,function(response){
		if(response.success){
			//postUtil.submit(contextPath+"/projectReport/myPreReportList",null);
			 window.location.reload();
		}
   });
}
//增加有效性校验
$(document).on('blur change','input:text',function(){
	var val = $(this).val();
	if(val){
		if($(this).attr("name")=='visitLinkMobile'){
		    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
		    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/;
			if(!reg1.test(val)&&!reg2.test(val)){ 				
				$(this).next().show();
				$(this).addClass("bor-ff");
			}else{
				$(this).removeClass("bor-ff");
				$(this).next().hide();
			}
		}else if ($(this).attr("name")=='proprietorLinkMobile'
			||$(this).attr("name")=='integratorLinkMobile'){
		    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
		    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/;
			if(!reg1.test(val)&&!reg2.test(val)){ 				
				$(this).addClass("bor-ff");
			}else{
				$(this).removeClass("bor-ff");
			}
		}else if($(this).attr("name")=='integratorCreditId'){
		    var reg1 = /^[0-9A-Z]{18}$/; 
		    var reg2 = /^[0-9A-Z]{15}$/; 
			if(!reg1.test(val)&&!reg2.test(val)){				
				$(this).addClass("bor-ff");
			}
			else{
				$(this).removeClass("bor-ff");
			}
		}else{
			$(this).removeClass("bor-ff");
		}
		
		var prop = verifyProprietorAndIntegratorBelong(this);
		if(!prop.success){
			if(!prop.data.accountName || !prop.data.accountManagerName){
				showMsgNoAnim("数据错误，请管理员检查数据");
			}else{
				showMsgNoAnim("公司：'"+prop.data.accountName+"'不在您名下，请与销售代表'"+prop.data.accountManagerName+"'协调！")
			}
		}
		
	}else{
		$(this).addClass("bor-ff");
		$(this).next().show();
	}
});


/**
 * 校验报备的集成商和业主是否在对应的销售代表名下
 */
function verifyProprietorAndIntegratorBelong(thiz){
	if($(thiz).attr("name")=='integratorCreditId'){
		var val = $(thiz).val();
		var param = {
			integratorCreditId:val
		};
		var resp = JSON.parse(postUtil.syncCall('/projectReport/verifyIntegratorBelong',param));

		return resp;
	}
	if($(thiz).attr("name")=='proprietorCompanyName'){
		var val = $(thiz).val();
		var proprietorCreditId = $(thiz).parent().parent().find("input[name=proprietorCreditId]").val();
		if(val && proprietorCreditId){
			var param = {
				proprietorCompanyName:val,
				proprietorCreditId:proprietorCreditId	
			};
			var resp = JSON.parse(postUtil.syncCall('/projectReport/verifyProprietorBelong',param));
			return resp;
		}
	}
	if($(thiz).attr("name")=='proprietorCreditId'){
		var val = $(thiz).val();
		var proprietorCompanyName = $(thiz).parent().parent().find("input[name=proprietorCompanyName]").val();
		if(val && proprietorCompanyName){
			var param = {
				proprietorCompanyName:proprietorCompanyName,
				proprietorCreditId:val	
			};
			var resp = JSON.parse(postUtil.syncCall('/projectReport/verifyProprietorBelong',param));
			return resp;
		}
	}
	return {
		success:true
	};
}

function showMsgNoAnim(msg){
	var html ='<body>'+
				'<div class="t-c jun-close fz14 c-2"  style="margin-top: 30px; ">'+
					'<span class="iconfont icon-jinggao-copy c-f mr5 mt5" style="font-size: 24px">'+
					'</span>#{reason}'+
				'</div>'+
			  '</body>';
	html = html.replace('#{reason}',msg);
	layer.closeAll();
	layer.open({
	    title: '提示',
	    skin: 'jun-close',
	    area: ['480px', '250px'],
	    btnAlign: 'c',
	    anim:-1, //弹窗动画
	    isOutAnim: false, //关闭动画
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

function validate(){
	var input = $("#visitForm").find("form").find("input");
	var bool =true;
	$.each(input,function(index,element){
		var v= $(element).val();
		if(!v){
			$(element).addClass("bor-ff");
			bool=false;
		}else{
			if($(element).attr("name")=='visitLinkMobile'){
			    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
			    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
				if(!reg1.test(v)&&!reg2.test(v)){ 				
					$(element).addClass("bor-ff");
					$(element).next().show();
					bool=false;
				}
			}
		}
	});
	if(!$("#visitForm").find("form").find("textarea").val()){
		$("#visitForm").find("form").find("textarea").addClass("bor-ff");
		bool = false;
	}
	return bool;
}

function validateProprietorAndIntegrator(){
	var bool = true;
	if(!$('input[name=projectNumber]').val()){
		bool=false;
	}
	if(!$('input[name=projectProtectDate]').val()){
		$('input[name=projectProtectDate]').addClass("bor-ff");
		bool=false;
	}
	$.each($("#proprietorTableBody").find("input"),function(index,element){
		var val= $(element).val();
		if ($(element).attr("name")=='proprietorLinkMobile'){
		    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
		    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/;
			if(!reg1.test(val)&&!reg2.test(val)){
				bool = false;
				$(element).addClass("bor-ff");
			}
		}/*else if($(element).attr("name")=='proprietorCreditId'){
		    var reg1 = /^[0-9A-Z]{18}$/; 
		    var reg2 = /^[0-9A-Z]{15}$/; 
			if(!reg1.test(val)&&!reg2.test(val)){
				bool = false;
				$(element).addClass("bor-ff");
			}
		}*/else{
			if(!val){
				bool = false;
				$(element).addClass("bor-ff");
			}
		}
	});
	
	$.each($("#integratorTableBody").find("input"),function(index,element){
		var val= $(element).val();
		if ($(element).attr("name")=='integratorLinkMobile'){
		    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
		    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/;
			if(!reg1.test(val)&&!reg2.test(val)){ 
				bool = false;
				$(element).addClass("bor-ff");
			}
		}else if($(element).attr("name")=='integratorCreditId'){
		    var reg1 = /^[0-9A-Z]{18}$/; 
		    var reg2 = /^[0-9A-Z]{15}$/; 
			if(!reg1.test(val)&&!reg2.test(val)){
				bool = false;
				$(element).addClass("bor-ff");
			}
		}else{
			if(!val){
				bool = false;
				$(element).addClass("bor-ff");
			}
		}
	});
	return bool;
}
function addProprietor(proprietorCompanyName,proprietorCreditId) {
	var trId ='proprietor';
	if($("#proprietorTableBody").children().length>0){
		var e = $("#proprietorTableBody").children().last();
		var id = e.attr("id");
		trId +=parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var html ='<tr id="'+trId+'">'+
				'<td>'+proprietorCompanyName+'</td>'+
				'<td class="pre">'+proprietorCreditId+
				'</td>'+
				'<td><input type="text" placeholder="请填写联系人" name="proprietorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" name="proprietorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" name="proprietorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteProprietorRow(\''+trId+'\');">删除</a></td>'+
			  '</tr>';	
	$("#proprietorTableBody").append(html);
}

function addProprietor2() {
	var trId ='proprietor';
	if($("#proprietorTableBody").children().length>0){
		var e = $("#proprietorTableBody").children().last();
		var id = e.attr("id");
		trId +=parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var html ='<tr id="'+trId+'">'+
				'<td><input type="text" placeholder="请填写公司名称" name="proprietorCompanyName" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="如果是事业单位，请填无" name="proprietorCreditId" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系人" name="proprietorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" name="proprietorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" name="proprietorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteProprietorRow(\''+trId+'\');">删除</a></td>'+
			  '</tr>';	
	$("#proprietorTableBody").append(html);
}

function deleteProprietorRow(rowid){
	$('#'+rowid).remove();
}

function addIntegrator(integratorCompanyName,integratorCreditId) {
	var trId ='integrator';
	if($("#integratorTableBody").children().length>0){
		var e = $("#integratorTableBody").children().last();
		var id = e.attr("id");
		trId +=parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var html ='<tr id="'+trId+'">'+
				'<td>'+integratorCompanyName+'</td>'+
				'<td class="pre">'+integratorCreditId+
				'</td>'+
				'<td><input type="text" placeholder="请填写联系人" value="" name="integratorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" value="" name="integratorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" value="" name="integratorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteIntegratorRow(\''+trId+'\')">删除</a></td>'+
			  '</tr>';			
	$("#integratorTableBody").append(html);
}

function addIntegrator2() {
	var trId ='integrator';
	if($("#integratorTableBody").children().length>0){
		var e = $("#integratorTableBody").children().last();
		var id = e.attr("id");
		trId +=parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var html ='<tr id="'+trId+'">'+
				'<td><input type="text" placeholder="请填写公司名称" value="" name="integratorCompanyName" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写统一社会信用代码" value="" name="integratorCreditId" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系人" value="" name="integratorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" value="" name="integratorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" value="" name="integratorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteIntegratorRow(\''+trId+'\')">删除</a></td>'+
			  '</tr>';			
	$("#integratorTableBody").append(html);
}
function deleteIntegratorRow(rowid){
	$('#'+rowid).remove();
}

/**
 * 增加联系人增加的业主信息
 */
function getProprietorNew(){
	var data=[];
	$.each($("#proprietorTableBody").children(),function(index,element){
		if($(element).find("input").length==3 ){ //存在新增的input框
			var tdArr = $(element).find("td"); //没有业主id的，就是新增的联系人
			if(tdArr.eq(6).length==0){
				var obj ={
						proprietorCompanyName:tdArr.eq(0).text(),
						proprietorCreditId:tdArr.eq(1).text(),
						proprietorLinkMan:tdArr.eq(2).find("input").val(),
						proprietorLinkMobile:tdArr.eq(3).find("input").val(),
						proprietorLinkPosition:tdArr.eq(4).find("input").val(),
						orderIndex:index
					};
					data.push(obj);
			}
		}
	});
	return data;
}
/**
 * 项目变更增加的业主信息
 */
function getProprietorNew2(){
	var data=[];
	$.each($("#proprietorTableBody").children(),function(index,element){
		if($(element).find("input").length==5){ //存在新增的input框
			var tdArr = $(element).find("td"); 
			var obj ={
				proprietorCompanyName:tdArr.eq(0).find("input").val(),
				proprietorCreditId:tdArr.eq(1).find("input").val(),
				proprietorLinkMan:tdArr.eq(2).find("input").val(),
				proprietorLinkMobile:tdArr.eq(3).find("input").val(),
				proprietorLinkPosition:tdArr.eq(4).find("input").val(),
				orderIndex:index
			};
			data.push(obj);
		}
	});
	return data;
}

/**
 * 项目变更需要补全的业主信息
 */
function getProprietorNew3(){
	var data=[];
	$.each($("#proprietorTableBody").children(),function(index,element){
		if($(element).find("td").eq("6").length!=0){  //如果存在隐藏的业主id,说明是修改的行
			var tdArr = $(element).find("td"); 
			if(tdArr.find("input").length>0){
				var obj ={
						proprietorCompanyName:tdArr.eq(0).text(),
						proprietorCreditId:tdArr.eq(1).text(),
						proprietorLinkMan:tdArr.eq(2).find("input").val(),
						proprietorLinkMobile:tdArr.eq(3).find("input").val(),
						proprietorLinkPosition:tdArr.eq(4).find("input").val(),
						proprietorId:tdArr.eq(6).text(),
					};
					data.push(obj);
			}
		}
	});
	return data;
}

function getIntegratorNew(){
	var data=[];
	$.each($("#integratorTableBody").children(),function(index,element){
		if($(element).find("input").length==3){ //存在新增的input框
			var tdArr = $(element).find("td"); 
			var obj ={
				integratorCompanyName:tdArr.eq(0).text(),
				integratorCreditId:tdArr.eq(1).text(),
				integratorLinkMan:tdArr.eq(2).find("input").val(),
				integratorLinkMobile:tdArr.eq(3).find("input").val(),
				integratorLinkPosition:tdArr.eq(4).find("input").val(),
				orderIndex:index
			};
			data.push(obj);
		}
	});
	return data;

}

function checkAuthorizationApplication(backupId){
	postUtil.call('/orderProjectBackupGrantAuthorization/checkAuthorization', {"backupId":backupId}, function (data) {
		var checkConflict=data.data;
		var showApplcation=false;
		if(true==checkConflict){
			 var layerContent = '<span class="c-f t-c"><p>您申请授权的项目与项目库中已提报或正在提报的项目检测到</p><p>存在冲突，项目授权申请将提交至冲突裁判员处进行授权审</p><p>核，是否继续提交授权申请？</p></span>';
		        layer.open({
		            title: "冲突提示",
		            skin: 'myskin3',
		            area: ['430px', '252px'],
		            btnAlign: 'c',
		            content: layerContent,
		            btn: ['继续申请授权', '关闭'],
		            yes: function (index, layero) {
		            	layer.close(index);
		            	authorizationApplication(backupId,checkConflict);
		            }, btn2: function (index, layero) {
		                layer.close(index);
		            },
		            cancel: function () {

		            }
		        });	
		}else{
			authorizationApplication(backupId,checkConflict);
		}
	})
}

function showAuthorityList(backupId){
	layer.open({
		title: '集成商授权详情',
		type: 2,
		skin: 'jun-close1',
		scrollbar: false,
		area: ['720px', '380px'],
		content: ['/projectReport/preIntegratorList?backupId=' + backupId,"no"],
		btn: ['关闭'],
		btnAlign: 'c',
		yes: function (index, layero) {
			layer.close(index);
		}
	
	})
}


function authorizationApplication(backupId,checkConflict){
	layer.open({
		title: '项目授权申请',
		type: 2,
		skin: 'jun-close1',
		scrollbar: false,
		area: ['720px', '400px'],
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
				tempItem.integratorId = $(item).parent().find("input[name=integratorId]").val();
				tempItem.integratorCreditId = $(item).parent().find("input[name=integratorCreditId]").val();
				tempItem.integratorCompanyName = $(item).parent().find("input[name=integratorCompanyName]").val();
				data[n] = tempItem;
			});
			if (data.length < 1) {
				layer.alert("请至少选择一个集成商！", {icon: 5});
				return false;
			}
			param.backupId = backupId;
			param.checkConflict=checkConflict;
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
							cardUtil.refreshCard("项目详情-"+backupId);
							postUtil.submit('/projectReport/backupViewPage',{"backupId":backupId});
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
function followProjectBackup(){
//	postUtil.submit('/projectReport/backupViewPage',{backupId:backupId,action:'follow'});
	$('#visitForm').css('display','block');
	$('input[name=followDate]').focus();
}

function followProjectBackup(){
	$('#visitForm').css('display','block');
	$('input[name=followDate]').focus();
}


//function authorizationApplication(backupId){
//	layer.open({
//		title: '项目授权申请',
//		type: 2,
//		skin: 'jun-close1',
//		scrollbar: false,
//		area: ['720px', '400px'],
//		content: contextPath + '/projectBackup/authorization?backupId=' + backupId,
//		btn: ['确定','取消'],
//		btnAlign: 'c',
//		yes: function(index, layero){
//			var param = {};
//			var data = [];
//			var body = layer.getChildFrame('body', index);
//			body.find("input[name=chooseIntegratorsCb]:checked");
//			$.each(body.find("input[name=chooseIntegratorsCb]:checked"), function(n, item) {
//				var tempItem = {};
//				tempItem.integratorId = $(item).parent().find("input[name=integratorCreditId]").val();
//				tempItem.integratorCompanyName = $(item).parent().find("input[name=integratorCompanyName]").val();
//				data[n] = tempItem;
//			});
//			if(data.length < 1){
//				layer.alert("请至少选择一个集成商！", {icon: 5});
//				return false;
//			}
//			param.backupId = backupId;
//			param.data = JSON.stringify(data);
//			postUtil.call(contextPath + '/projectBackup/submitAuthorization',param,function(data){
//				if(data.success){
//					layer.open({
//						title: '操作提示',
//						skin: 'youskin',
//						area: ['480px', '200px'],
//						btnAlign: 'c',
//						content: '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin-top: 30px;font-size:12px;color:#222222">' + data.msg + '</p>',
//						btn: ['关闭'],
//						yes: function(index, layero){
//							postUtil.submit(contextPath+'/projectBackup/project_backup_detail',{"backupId":backupId});
//						}
//					});
//				}else{
//					layer.alert(data.msg, {icon: 5});
//				}
//			})
//		}
//		,btn2: function(index, layero){
//
//		}
//	});
//}

function getIntegratorNew2(){
	var data=[];
	$.each($("#integratorTableBody").children(),function(index,element){
		if($(element).find("input").length==5){ //存在新增的input框
			var tdArr = $(element).find("td"); 
			var obj ={
				integratorCompanyName:tdArr.eq(0).find("input").val(),
				integratorCreditId:tdArr.eq(1).find("input").val(),
				integratorLinkMan:tdArr.eq(2).find("input").val(),
				integratorLinkMobile:tdArr.eq(3).find("input").val(),
				integratorLinkPosition:tdArr.eq(4).find("input").val(),
				orderIndex:index
			};
			data.push(obj);
		}
	});
	return data;
}

function projectChange(thiz){
	$("#projectChangeBtn").hide();
	$("#projectChangeBar").show();
	$("#addIntegrator").show();
	$("#authorityBtn").hide();
	
	var projectName = $("#projectName").find("span").text();
	$("#projectName").html('项目名称：<input class="no-css projectName" type="text" name="projectName" oldvalue="'+projectName+'/" value="'+projectName+'/" />');
	
	var projectLevel = $("#projectLevel").find("span").text();
	oldvalue={
		projectName	:projectName,
		projectLevel:projectLevel
	};
	if(projectLevel=='B'){ //只能从B改成A
		$("#projectLevel").html('<form  class="jun-form-s form-css" style="height:43px;">'
				+'<dl class="dl-form" style="margin-bottom:0;">'
				+'<dt class="flt fz12" style="font-weight:500;line-height:30px;margin-left:0px;">项目等级：</dt>'
				+'<dd class="flt layui-form radios" style="margin-left:30px;">'
				+'<input type="radio" lay-filter="projectLevel" name="projectLevel" value="A" title="A" '+(projectLevel=='A'?'checked':'')+' />'
				+'<input type="radio" lay-filter="projectLevel" name="projectLevel" value="B" title="B" '+(projectLevel=='B'?'checked':'')+ ' />'
				+'</dd>'
				+'</dl>'
				+'</form>');
		
		form.render('radio');
	}
}

function projectChangeCancel(){
	$("#projectChangeBtn").show();
	$("#projectChangeBar").hide();
	$("#authorityBtn").show();
	$("#addIntegrator").hide();
	
	$("#projectName").html('项目名称：<span class="c-2">'+oldvalue.projectName+'</span>');
	$("#projectLevel").html('项目等级：<span class="c-2">'+oldvalue.projectLevel+'</span>');
	
	$.each($("#integratorTableBody").children(),function(index,element){
		if($(element).find("input").length==5){ //存在新增的input框
			$(element).remove();
		}
	});
	
	$.each($("#proprietorTableBody").children(),function(index,element){
		if($(element).find("input").length==5){ //存在新增的input框
			$(element).remove();
		}
	});
}

function addPropertyInput(){
	$.each($("#proprietorTableBody").children(),function(index,element){
		$.each($(element).find("td"),function(td_index,td_element){
			if(!$(td_element).text()){
				if(td_index==2){
					$(td_element).html('<input type="text" placeholder="请填写联系人" value="" name="proprietorLinkMan" autocomplete="off" class="layui-input bor-e6">')
				}else if(td_index==3){
					$(td_element).html('<input type="text" placeholder="请填写联系电话" value="" name="proprietorLinkMobile" autocomplete="off" class="layui-input bor-e6">');
				}else if(td_index==4){
					$(td_element).html('<input type="text" placeholder="请填写职位" value="" name="proprietorLinkPosition" autocomplete="off" class="layui-input bor-e6">');
				}
			}
		});
	});
}

function deletePropertyInput(){
	$.each($("#proprietorTableBody").children(),function(index,element){
		if(!($(element).find("td").eq("6").length==0)){  //如果不存在隐藏的业主id,说明是新增联系人的行
			$.each($(element).find("td"),function(td_index,td_element){
				if($(td_element).find("input").length>0){
					$(td_element).html("");
				}
			});
		}
	});
}

function projectChangeSubmit(){
   var secrecyAreaArray= $("#secrecyArea").val(); 
   var secrecyOpt =$("input[name=secrecyOpt]:checked").val();
   var secrecyArea='';
   if(secrecyOpt=='OPEN_TO_SOMEAREA'){
	   if(secrecyAreaArray.length==0){
		   $('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").show();
		   $('.ms-choice').addClass("bor-ff");
		   return;
	   }
		for(var i=0;i<secrecyAreaArray.length;i++){
			secrecyArea+=secrecyAreaArray[i]+",";
		}
   }
   var isOpenSku = $("input[name=isOpenSku]:checked").val();
   if(!validateProprietorAndIntegrator()){
	   $(".bor-ff")[0].focus();
	   return;
   }
   var projectName = $('input[name=projectName]').val();
   if(projectName.substring(projectName.lastIndexOf('/'))=='/'){
	   projectName = projectName.substring(0,projectName.lastIndexOf('/'));
   }
   var projectLevel = $('input[name=projectLevel]:checked').val();
   if(!projectLevel){
	   projectLevel = oldvalue.projectLevel;
   }
   var param={
		backupId:backupId,
		secrecyOpt:secrecyOpt,
		secrecyArea:secrecyArea,
		isOpenSku:isOpenSku,
		projectName:projectName,
		projectLevel:projectLevel,
		projectNumber:$('input[name=projectNumber]').val(),
		projectProtectDate:$('input[name=projectProtectDate]').val(),
		predictFiberKilometers:$('input[name=predictFiberKilometers]').val(),
		predictAmount:$('input[name=predictAmount]').val()
   };
   var integratorList = getIntegratorNew();
   if(integratorList.length>0){
	   param.integratorList= JSON.stringify(integratorList);
   }
   var proprietorList =getProprietorNew();
   if(proprietorList.length>0){
	   param.proprietorList= JSON.stringify(proprietorList);
   }
   var integratorListChange = getIntegratorNew2();
   if(integratorListChange.length>0){
	   param.integratorListChange= JSON.stringify(integratorListChange);
   }
   var proprietorListChange =getProprietorNew2();
   if(proprietorListChange.length>0){
	   param.proprietorListChange= JSON.stringify(proprietorListChange);
   }
   var proprietorListEdit = getProprietorNew3();
   if(proprietorListEdit.length>0){
	   param.proprietorListEdit= JSON.stringify(proprietorListEdit);
   }
   if(oldvalue.projectName == param.projectName &&
		   oldvalue.projectLevel == param.projectLevel &&
		   integratorListChange.length==0 &&
		   proprietorListChange.length==0){
	   showMsg("没有任何项目变更，不能提交");
	   return;
   }
   if(projectLevel && projectLevel=="A" && $("#proprietorTableBody").children().length==0){
	   showMsg("A类项目必须要填写集成商和业主信息");
	   return;
   }
   var belongCheckArray =[];
   
   $.each($("input[name='integratorCreditId']"),function(index,element){
	   belongCheckArray.push(element);
   });
   $.each($("input[name='proprietorCompanyName']"),function(index,element){
	   belongCheckArray.push(element);
   });
   $.each($("input[name='proprietorCreditId']"),function(index,element){
	   belongCheckArray.push(element);
   });
     
   var belongCheckResult = false;
   $.each(belongCheckArray,function(index,element){
		var prop = verifyProprietorAndIntegratorBelong(element);
		if(!prop.success){
			if(!prop.data.accountName || !prop.data.accountManagerName){
				showMsgNoAnim("数据错误，请管理员检查数据");
				belongCheckResult = true;
				return false;
			}else{
				showMsgNoAnim("公司：'"+prop.data.accountName+"'不在您名下，请与销售代表'"+prop.data.accountManagerName+"'协调！");
				belongCheckResult = true;
				return false;
			}
		}
   });
   
   if(belongCheckResult){
	   return;
   }
   
   layer.load();
   postUtil.call(contextPath+"/projectChange/changeConflictCheck",param,function(result){
	   layer.closeAll('loading');
	   if(result.success){
		   openSubmitNotice(param,result.data)
	   }else{
		   showMsg(result.data);
	   }
   });

}

function changeCommit(data){
   postUtil.call(contextPath+"/projectChange/changeCommit",data,function(response){
		if(response.success){
			 window.location.reload();
		}else{
			showMsg(response.data);
		}
   });
}
function openNotice(url,yesFunction,data){
	$.get(url, {}, function(str){
        layer.open({
            title: '操作提示',
            skin: 'jun-close1',
            area: ['480px', '300px'],
            content: str,
            btnAlign: 'c',
            btn: ['继续提交', '关闭'],
            yes: function(index, layero){
            	yesFunction(data);
            },btn2: function(index, layero){
                //取消的回调
            },
            cancel: function(){ 
                //右上角关闭回调
            }
        });
	});
}

function openSubmitNotice(data,isConflict){
	if(isConflict){
		var url =contextPath+'/pages/projectReport/msg/changeSubmitNoticeConflict.html';
		openNotice(url,changeCommit,data);
	}else{
		var url =contextPath+'/pages/projectReport/msg/changeSubmitNotice.html';
		openNotice(url,changeCommit,data);
	}
}

function showMsg(msg){
	var html ='<body>'+
				'<div class="t-c jun-close fz14 c-2"  style="margin-top: 30px; ">'+
					'<span class="iconfont icon-jinggao-copy c-f mr5 mt5" style="font-size: 24px">'+
					'</span>#{reason}'+
				'</div>'+
			  '</body>';
	html = html.replace('#{reason}',msg);
	layer.open({
	    title: '提示',
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
}

$(document).on("input", "input.projectName",function(event){
    var min = 0;
    var max = null;
    var value = event.target.value;
    var oldvalue = $(event.target).attr("oldvalue");
    var reg=new RegExp("^"+oldvalue);   
    if (!reg.test(value)){
    	$(event.target).val(oldvalue)
    }
});

$(document).on("change","input[name=integratorCompanyName]",function(){
	var val = $(this).val();
	if(!val){
		$(this).parent().parent().find("input").eq(1).val('')
		$(this).parent().parent().find("input").eq(1).attr("readonly",false);
	}	
	autoFillCreditId(this);
});

$(document).on("change","input[name=proprietorCompanyName]",function(){
	var val = $(this).val();
	if(!val){
		$(this).parent().parent().find("input").eq(1).val('')
		$(this).parent().parent().find("input").eq(1).attr("readonly",false);
	}
	autoFillCreditId(this);
});

function autoFillCreditId(thiz){
	var val = $(thiz).val();
	if(val){
		var response = JSON.parse(postUtil.syncCall(contextPath+"/projectReport/getCreditIdByAccountName",{accountName:val}));
	    var reg1 = /^[0-9A-Z]{18}$/; 
	    var reg2 = /^[0-9A-Z]{15}$/; 
		if(response.data && (reg1.test(response.data)||reg2.test( response.data))){
			$(thiz).parent().parent().find("input").eq(1).val(response.data);
			$(thiz).parent().parent().find("input").eq(1).attr("readonly",true);
		}
	}
}