function addProduct() {
    layer.open({
        title:"请选择SKU",
        type: 2,
        area: ['1000px', '650px'],
        fixed: false, //不固定
        maxmin: true,
        content: contextPath+'/reusable/skuCommodity/chooseSkuCommodityPage'
    });
}

function chooseSkuCommodityCallback(choosedSkuDataArray){
	var html ="";
	for(var i=0;i<choosedSkuDataArray.length;i++){
		if($('#'+choosedSkuDataArray[i].skuId).length>0){
			layer.msg("您已经添加过商品："+choosedSkuDataArray[i].skuName,{"icon":"5"});
			return false;
		}
		html+=	"<tr id='"+choosedSkuDataArray[i].skuId+"'>" +
					"<td style='display:none'>"+choosedSkuDataArray[i].skuId+"</td>" +
					"<td>"+choosedSkuDataArray[i].model+"</td>" +
					"<td>"+choosedSkuDataArray[i].brandName+"</td>"+ 
					"<td>"+choosedSkuDataArray[i].skuName+"</td>" +
					"<td><input type='text' name='skuQuantity' autocomplete='off'  class='layui-input bor-e6 unitCheck unitDisplay' unitName='"+choosedSkuDataArray[i].unitName+"'></td>" +
					"<td>"+choosedSkuDataArray[i].unitName+"</td>" +
					'<td><input  type="text" name="expectSkuPrice" autocomplete="off"  class="layui-input bor-e6 num2"></td>' +
					"<td><a href=javascript:removeSkuNoticeInfo('"+choosedSkuDataArray[i].skuId+"','sku');>删除</a></td>" +
				"</tr>";
	}
	$("#skuTableBody").append(html);
	//渲染单位控制小数位数
	renderUnitDisplay();
	return true;
}

function addCustomProduct() {
	var trId ='customProduct';
	if($("#skuCustomTableBody").children().length>0){
		var e = $("#skuCustomTableBody").children().last();
		var id = e.attr("id");
		trId += parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var length = $("#skuCustomTableBody").children().last()

	var html ='<tr id="'+trId+'">'+
				'<td><input placeholder="请填写商品型号" type="text" name="skuModel" autocomplete="off"  class="layui-input bor-e6"></td>'+
				'<td><input placeholder="请填写品牌" type="text" name="skuBrandName" autocomplete="off"  class="layui-input bor-e6"></td>'+
				'<td><input placeholder="请填写商品名称" type="text" name="skuName" autocomplete="off"  class="layui-input bor-e6"></td>'+
				'<td><input placeholder="请填写数量" type="text" name="skuQuantity" autocomplete="off"  class="layui-input bor-e6 num3"></td>'+
				'<td><input placeholder="请填写计量单位" type="text" name="skuUnitName" autocomplete="off"  class="layui-input bor-e6"></td>'+
				'<td><input placeholder="请填写价格" type="text" name="expectSkuPrice" autocomplete="off"  class="layui-input bor-e6 num2"></td>'+
				'<td><a href="javascript:removeSkuNoticeInfo(\''+trId+'\',\'customSku\');">删除</a></td>'+
			  '</tr>';
	$("#skuCustomTableBody").append(html);
}

function addProprietor() {
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
				'<td class="pre">'+
					'<input type="text" placeholder="如果是事业单位，请填无" style="width:95%" name="proprietorCreditId" autocomplete="off" class="layui-input bor-e6">'+
					'<span class="placeholder"></span>'+
					'<span style="right:5px;top:30%;" class="jun-yang-msg iconfont icon-asmkticon0239"></span>'+
				'</td>'+
				'<td><input type="text" placeholder="请填写联系人" name="proprietorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" name="proprietorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" name="proprietorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteProprietorRow(\''+trId+'\')">删除</a></td>'+
			  '</tr>';	
	$("#proprietorTableBody").append(html);
}

function removeSkuNoticeInfo(trId,type){
	var data = getSkuData();
	var skuSize=0;
	var customSkuSize=0;
	for(var i=0;i<data.length;i++){
		if(data[i].type=='0'){
			skuSize++
		}else{
			customSkuSize++
		}
	}
	if(type=='sku' && skuSize==0){
		$('#'+trId).parent().parent().next().hide();
	}
	
	if(type=='customSku' || customSkuSize==0){
		$('#'+trId).parent().parent().next().hide();
	}
	$('#'+trId).remove();
}

function addIntegrator() {
	var trId ='integrator';
	if($("#integratorTableBody").children().length>0){
		var e = $("#integratorTableBody").children().last();
		var id = e.attr("id");
		trId +=parseInt(id.substring(id.length-1))+1;
	}else{
		trId +='0';
	}
	var html ='<tr id="'+trId+'">'+
				'<td><input type="text"placeholder="请填写公司名称" value="" name=integratorCompanyName autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td class="pre">'+
					'<input type="text" placeholder="请填写统一社会信用代码" style="width:95%" value="" name="integratorCreditId" autocomplete="off" class="layui-input bor-e6">'+
					'<span class="placeholder"></span>'+
					'<span style="right:5px;top:30%;" class="jun-yang-msg iconfont icon-asmkticon0239"></span>'+
				'</td>'+
				'<td><input type="text" placeholder="请填写联系人" value="" name="integratorLinkMan" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写联系电话" value="" name="integratorLinkMobile" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><input type="text" placeholder="请填写职位" value="" name="integratorLinkPosition" autocomplete="off" class="layui-input bor-e6"></td>'+
				'<td><a href="javascript:deleteIntegratorRow(\''+trId+'\')">删除</a></td>'+
			  '</tr>';			
	$("#integratorTableBody").append(html);
}

function getSkuData(){
	var array= new Array();
	$.each($("#skuTableBody").find("tr"),function(index,element){
		var sku ={};
		var tdArr = $(element).find("td");
		sku.skuId = $(element).attr("id");
		sku.skuModel = tdArr.eq(1).text();
		sku.skuBrandName =tdArr.eq(2).text();
		sku.skuName =tdArr.eq(3).text();
		sku.skuQuantity =tdArr.eq(4).find("input").val();
		sku.skuUnitName =tdArr.eq(5).text();
		sku.expectSkuPrice =tdArr.eq(6).find("input").val();
		sku.type="0";
		array.push(sku);
	});
	$.each($("#skuCustomTableBody").find("tr"),function(index,element){
		var sku ={};
		var tdArr = $(element).find("td");
		sku.skuModel = tdArr.eq(0).find("input").val();
		sku.skuBrandName =tdArr.eq(1).find("input").val();
		sku.skuName =tdArr.eq(2).find("input").val();
		sku.skuQuantity =tdArr.eq(3).find("input").val();
		sku.skuUnitName =tdArr.eq(4).find("input").val();
		sku.expectSkuPrice =tdArr.eq(5).find("input").val();
		sku.type="1";
		array.push(sku);
	});
	
	return array;
}

function getProprietorData(){
	var array= new Array();
	$.each($("#proprietorTableBody").find("tr"),function(index,element){
		var proprietor ={};
		var tdArr = $(element).find("td");
		proprietor.proprietorCompanyName = tdArr.eq(0).find("input").val();
		proprietor.proprietorCreditId =tdArr.eq(1).find("input").val();
		proprietor.proprietorLinkMan =tdArr.eq(2).find("input").val();
		proprietor.proprietorLinkMobile =tdArr.eq(3).find("input").val();
		proprietor.proprietorLinkPosition =tdArr.eq(4).find("input").val();
		//只要有一个不为空
		if(proprietor.proprietorCompanyName || proprietor.proprietorCreditId
				|| proprietor.proprietorLinkMan || proprietor.proprietorLinkMobile
				|| proprietor.proprietorLinkPosition){
			proprietor.orderIndex=index;
			array.push(proprietor);
		}
	});

	return array;
}

function getIntegratorData(){
	var array= new Array();
	$.each($("#integratorTableBody").find("tr"),function(index,element){
		var integrator ={};
		var tdArr = $(element).find("td");
		integrator.integratorCompanyName = tdArr.eq(0).find("input").val();
		integrator.integratorCreditId =tdArr.eq(1).find("input").val();
		integrator.integratorLinkMan =tdArr.eq(2).find("input").val();
		integrator.integratorLinkMobile =tdArr.eq(3).find("input").val();
		integrator.integratorLinkPosition =tdArr.eq(4).find("input").val();
		if(integrator.integratorCompanyName || integrator.integratorCreditId
				|| integrator.integratorLinkMan || integrator.integratorLinkMobile
				|| integrator.integratorLinkPosition){
			integrator.orderIndex=index;
			array.push(integrator);
		}
	});	
	return array;
}

function validValidation(thiz){
	$(thiz).addClass("bor-ff");
	$(thiz).next().show();
	$(thiz).attr("validate","false")
}

function unValidValidation(thiz){
	$(thiz).removeClass("bor-ff");
	$(thiz).next().hide();
	$(thiz).attr("validate","true")
}

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
		if(!resp.success){

		}else{
			$(thiz).attr("validate","true");
		}
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
			if(!resp.success){

			}else{
				$(thiz).attr("validate","true");
			}
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

//增加有效性校验
$(document).on('blur','input:text',function(){
	if($(this).val()){
		var val = $(this).val();
		if($(this).attr("name")=='distributorPrincipalMobile'
			|| $(this).attr("name")=='proprietorLinkMobile'
				||$(this).attr("name")=='integratorLinkMobile'
				||$(this).attr("name")=='visitLinkMobile'){
		    var reg1 = /^0?1[3|4|5|7|8][0-9]\d{8}$/; 
		    var reg2 = /^0[\d]{2,3}-[\d]{7,8}$/
			if(!reg1.test(val)&&!reg2.test(val)){ 
				validValidation(this);
				return;
			}
		}
		
		if($(this).attr("name")=='distributorPrincipalEmail'){
		    var reg1 = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 
			if(!reg1.test(val)){ 
				validValidation(this);
				return;
			}
		}
		if($(this).attr("name")=='integratorCreditId'
			/*|| $(this).attr("name")=='proprietorCreditId'*/){
		    var reg1 = /^[0-9A-Z]{18}$/; 
		    var reg2 = /^[0-9A-Z]{15}$/; 
			if(!reg1.test(val) && !reg2.test(val)){ 
				validValidation(this);
				return;
			}
		}
		if($(this).attr("name")=='skuQuantity'
			|| $(this).attr("name")=='expectSkuPrice'){
/*				|| $(this).attr("name")=='predictFiberKilometers'
					|| $(this).attr("name")=='predictAmount'*/
		    var reg1 = /^\d+(\.\d+)?$/; 
			if(!reg1.test(val)){ 
				validValidation(this);
				return;
			}
		}
		unBlankValidation(this);
		var prop = verifyProprietorAndIntegratorBelong(this);
		if(!prop.success){
			if(!prop.data.accountName || !prop.data.accountManagerName){
				showMsgNoAnim("数据错误，请管理员检查数据");
				validValidation(this);
			}else{
				validValidation(this);
				showMsgNoAnim("公司：'"+prop.data.accountName+"'不在您名下，请与销售代表'"+prop.data.accountManagerName+"'协调！")
			}
		}else{
			unValidValidation(this);
		}
	}else{
		unValidValidation(this);
		$(this).parent().find(".jun-danger-msg.iconfont.icon-jinggao-copy.c-f").hide();
	}
});

$(document).on('change blur','textarea',function(){
	if($(this).val()){
		var val = $(this).val();
		val = val.replace(/\s/g,""); //去除空格
		val = val.replace("\n",""); //去除换行
		if(val.length<15){
			validValidation(this);
		}else{
			unValidValidation(this);
		}
	}
});

function blankValidation(thiz){
	$(thiz).addClass("bor-ff");
	$(thiz).parent().find(".jun-danger-msg.iconfont.icon-jinggao-copy.c-f").show();
	$(thiz).attr("validate","false")
}

function unBlankValidation(thiz){
	$(thiz).removeClass("bor-ff");
	$(thiz).parent().find(".jun-danger-msg.iconfont.icon-jinggao-copy.c-f").hide();
	$(thiz).attr("validate","true")
}

function nonBlankValidation(){
	var nameArray=""+
		"projectName|projectNumber|projectProtectDate|projectProvince|projectCity|"+
		"proprietorCompanyName|proprietorCreditId|proprietorLinkMan|proprietorLinkMobile|proprietorLinkPosition"+
		"integratorCompanyName|integratorCreditId|integratorLinkMan|integratorLinkMobile|integratorLinkPosition"+
		"skuModel|skuBrandName|skuName|skuQuantity|skuUnitName|"+ /*expectSkuPrice*/
		"predictFiberKilometers|predictAmount|projectDecription|"+
		"followDate|followMan|visitCompanyName|visitLinkMan|visitLinkMobile|visitContentDescriptor";
	var projectLevel=$('input[name=projectLevel]:checked').val();
	
	$.each($("input"),function(index,element){
		var name = $(element).attr("name");
		if (projectLevel=='B' &&'proprietorCompanyName|proprietorCreditId|proprietorLinkMan|proprietorLinkMobile|proprietorLinkPosition'.indexOf(name)>-1){			
			var companyName = $(element).parent().parent().find("input[name='proprietorCompanyName']").val().replace(/(^\s*)|(\s*$)/g, "");//去掉两端空格;
			var creditId = $(element).parent().parent().find("input[name='proprietorCreditId']").val().replace(/(^\s*)|(\s*$)/g, "");//去掉两端空格;
			var proprietorLinkMan = $(element).parent().parent().find("input[name='proprietorLinkMan']").val().replace(/(^\s*)|(\s*$)/g, "");//去掉两端空格;
			var proprietorLinkMobile = $(element).parent().parent().find("input[name='proprietorLinkMobile']").val().replace(/(^\s*)|(\s*$)/g, "");//去掉两端空格;
			var proprietorLinkPosition = $(element).parent().parent().find("input[name='proprietorLinkPosition']").val().replace(/(^\s*)|(\s*$)/g, "");//去掉两端空格;
			if((companyName && creditId && proprietorLinkMan &&proprietorLinkMobile && proprietorLinkPosition)
					|| (!companyName && !creditId && !proprietorLinkMan && !proprietorLinkMobile && !proprietorLinkPosition)){
				return true; //继续
			}
		}		
		if(nameArray.indexOf(name)>-1){
			var val = $(element).val().replace(/(^\s*)|(\s*$)/g, ""); //去掉两端空格
			if(!val){
				blankValidation(element);
				if("proprietorCompanyName|proprietorCreditId|proprietorLinkMan|proprietorLinkMobile|proprietorLinkPosition".indexOf(name)>-1){
					$('#proprietorNoticeInfo').css('display','block');
				}
				if("integratorCompanyName|integratorCreditId|integratorLinkMan|integratorLinkMobile|integratorLinkPosition".indexOf(name)>-1){
					$('#integratorNoticeInfo').css('display','block');
				}
				if("skuModel|skuBrandName|skuName|skuQuantity|skuUnitName|expectSkuPrice".indexOf(name)>-1){
					$(element).css('display','block').parent().parent().parent().parent().next().show();
				}
			}else{
				//unBlankValidation(element);
			}
		}
	});
	$.each($("textarea"),function(index,element){
		var name = $(element).attr("name");
		if(nameArray.indexOf(name)>-1){
			var val = $(element).val();
			if(!val){
				blankValidation(element);
			}else{
				//unBlankValidation(element);
				//至少要输入15个字
				if(val.length<15){
					validValidation(element);
				}
			}
		}
	});
	$.each($("select"),function(index,element){
		var name = $(element).attr("name");
		if("projectCity|projectProvince|visitCompanyName".indexOf(name)>-1){
			var val = $(element).val();
			if(!val){
				$(element).parent().parent().find("span").show();
				$(element).attr("validate","false");
				$(element).parent().find("input").addClass("bor-ff");;
			}else{

			}
		}
	});
	
	var secrecyOpt=$('input[name=secrecyOpt]:checked').val();
	if(secrecyOpt=='OPEN_TO_SOMEAREA'){
		var secrecyArea =$('#secrecyArea').val();
		if(secrecyArea==null || secrecyArea.length==0){
			$('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").show();
			$('.ms-choice').addClass("bor-ff");
			$('input[name=secrecyOpt]').attr("validate","false");
		}
	}
}

function openNotice(url,yesFunction,data){
	$.get(url, {}, function(str){
        layer.open({
            title: '操作提示',
            type:1,
            skin: 'jun-close1',
            area: ['480px', '300px'],
            content: str,
            btnAlign: 'c',
            btn: ['继续提交', '关闭'],
            yes: function(index, layero){
            	$(layero).find('.layui-layer-btn0').text("提交中")
            	$(layero).find('.layui-layer-btn0').attr("disabled",true);
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
	if(data.projectLevel=='A'){
		if(isConflict){
			var url =contextPath+'/pages/projectReport/msg/submitNoticeConflictA.html';
			openNotice(url,submitBackup,data);
		}else{
			var url =contextPath+'/pages/projectReport/msg/submitNoticeA.html';
			openNotice(url,submitBackup,data);
		}
	}else{
		if(isConflict){
			var url =contextPath+'/pages/projectReport/msg/submitNoticeConflictB.html';
			openNotice(url,submitBackup,data);
		}else{
			var url =contextPath+'/pages/projectReport/msg/submitNoticeB.html';
			openNotice(url,submitBackup,data);
		}
	}
}

function submitBackup(data){
   postUtil.call(contextPath+"/projectReport/backupSubmit", data, function(result) {
	   if(result.success){
		   postUtil.submit(contextPath+"/projectReport/myPreReportList",null)
	   }else{
		   showMsg(result.data);
	   }
   });
}

function openProprietorIntegratorNoticeInfo(info){
	var html ='<body>'+
				'<div class="t-c jun-close fz14 c-2"  style="margin-top: 30px; ">'+
					'<span class="iconfont icon-jinggao-copy c-f mr5 mt5" style="font-size: 24px">'+
					'</span>#{reason}'+
				'</div>'+
			  '</body>';
	html = html.replace('#{reason}',info);
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


function deleteIntegratorRow(rowid){
	var length = $("#integratorTableBody").find("tr");
	if(length.length==1){
		openProprietorIntegratorNoticeInfo("必须填一条集成商信息，不能删除！");
		return;
	}
	$('#'+rowid).remove();
	loadVisitCompanyNameMap();
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
		type: 1,
		title: '提示',
		area: ['480px', '250px'],
        id: 'layerDemo1',//防止重复弹出
        content: html
        ,btn: '关闭'
        ,btnAlign: 'c' //按钮居中
        ,shade: 0 //不显示遮罩
        ,yes: function(){
          layer.closeAll();
        }
	 });
}

function deleteTableRow(rowid){
	$('#'+rowid).remove();
}

function deleteProprietorRow(rowid){
	$('#'+rowid).remove();
	loadVisitCompanyNameMap();
}

function loadVisitCompanyNameMap(){
	initVisitCompanyNameMap.clear();
	$.each($("input[name=proprietorCompanyName]"),function(index,element){
		var companyName = $(element).val();
		var linkMan = $(element).parent().parent().find("input[name=proprietorLinkMan]").val();
		var linkMobile = $(element).parent().parent().find("input[name=proprietorLinkMobile]").val();
		
		if(companyName){
			var key = 'proprietor'+index+'_'+companyName;
			if(!initVisitCompanyNameMap.containsKey(key)){
				var manAndMobile = new Array()
				if(linkMan){
					manAndMobile[0] = linkMan;
				}
				if(linkMobile){
					manAndMobile[1] = linkMobile;
				}
				manAndMobile[2] = '业主';
				initVisitCompanyNameMap.put(key,manAndMobile);
			}
		}
	});
	
	$.each($("input[name=integratorCompanyName]"),function(index,element){
		var companyName = $(element).val();
		var linkMan = $(element).parent().parent().find("input[name=integratorLinkMan]").val();
		var linkMobile = $(element).parent().parent().find("input[name=integratorLinkMobile]").val();
		
		if(companyName){
			var key = 'integrator'+index+'_'+companyName;
			if(!initVisitCompanyNameMap.containsKey(key)){
				var manAndMobile = new Array()
				if(linkMan){
					manAndMobile[0] = linkMan;
				}
				if(linkMobile){
					manAndMobile[1] = linkMobile;
				}
				manAndMobile[2] = '集成商';
				initVisitCompanyNameMap.put(key,manAndMobile);
			}
		}
	});

	loadVisitCompanyNameSelectValue();
}
$(document).on("change","input[name=integratorCompanyName]",function(){
	var val = $(this).val();
	if(!val){
		$(this).parent().parent().find("input").eq(1).val('')
		$(this).parent().parent().find("input").eq(1).attr("readonly",false);
	}
//	var old = $(this).attr("oldvalue");
//	$(this).attr('oldvalue',val);
	
	loadVisitCompanyNameMap();
	autoFillCreditId(this);
});

$(document).on("change","input[name=proprietorCompanyName]",function(){
	var val = $(this).val();
	if(!val){
		$(this).parent().parent().find("input").eq(1).val('')
		$(this).parent().parent().find("input").eq(1).attr("readonly",false);
	}	
//	var old = $(this).attr("oldvalue");
//	$(this).attr('oldvalue',val);
	
	loadVisitCompanyNameMap();
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

/*
 	加载项目跟进的拜访公司下拉框的值
*/
function loadVisitCompanyNameSelectValue(isClearLink){
	$.each($('#visitCompanyName').children(),function(index,element){
		if(index!=0){
			$(element).remove();
		}
	});
	//清空拜访联系人和电话的值
	if(typeof(isClearLink) =="undefined" ||isClearLink==true){
		$("input[name=visitLinkMan]").val('');
		$("input[name=visitLinkMobile]").val('');
	}
	
	var keys = initVisitCompanyNameMap.keys();
	for(var i=0;i<keys.length;i++){
		var key = keys[i];
		var companyName = key.substring(key.indexOf('_')+1);
		var manAndMobile = initVisitCompanyNameMap.get(key);
    	//var opt ="<option value='"+key+"'>"+companyName+(manAndMobile[0]?('_'+manAndMobile[0]):'')+(manAndMobile[1]?('_'+manAndMobile[1]):'')+"</option>";
		var opt ="<option value='"+key+"'>"+companyName+"</option>"
		
    	$('#visitCompanyName').append(opt);
	}
	form.render('select'); 
}

$(document).on("change","input[name=proprietorLinkMan]",function(){
	var val = $(this).val();
	var old = $(this).attr("oldvalue");
	$(this).attr('oldvalue',val);
	
	var companyName = $(this).parent().parent().find("input[name=proprietorCompanyName]").val();
	var rowid = $(this).parent().parent().attr("id");
	if(companyName){
		var key = rowid+'_'+companyName;
		if(initVisitCompanyNameMap.containsKey(key)){
			var manAndMobile = initVisitCompanyNameMap.get(key);
			manAndMobile[0] = val;
		}
	}
	loadVisitCompanyNameSelectValue(false);
	var visitLinkMan = $("input[name=visitLinkMan]").val();
	if(old ==visitLinkMan && old!=""){
		$("input[name=visitLinkMan]").val(val);
	}else{
		//清空拜访联系人的值
		$("input[name=visitLinkMan]").val('');
	}

});


$(document).on("change","input[name=proprietorLinkMobile]",function(){
	var val = $(this).val();
	var old = $(this).attr("oldvalue");
	$(this).attr('oldvalue',val);
	
	var companyName = $(this).parent().parent().find("input[name=proprietorCompanyName]").val();
	var rowid = $(this).parent().parent().attr("id");
	if(companyName){
		var key = rowid+'_'+companyName;
		if(initVisitCompanyNameMap.containsKey(key)){
			var manAndMobile = initVisitCompanyNameMap.get(key);
			manAndMobile[1] = val;
		}
	} 
	loadVisitCompanyNameSelectValue(false);
	var visitLinkMobile=$("input[name=visitLinkMobile]").val();
	if(old == visitLinkMobile && old!=""){
		$("input[name=visitLinkMobile]").val(val);
	}else{
		//清空拜访电话的值
		$("input[name=visitLinkMobile]").val('');
	}
	
});

$(document).on("change","input[name=integratorLinkMan]",function(){
	var val = $(this).val();
	var old = $(this).attr("oldvalue");
	$(this).attr('oldvalue',val);
	
	var companyName = $(this).parent().parent().find("input[name=integratorCompanyName]").val();
	var rowid = $(this).parent().parent().attr("id");
	if(companyName){
		var key = rowid+'_'+companyName;
		if(initVisitCompanyNameMap.containsKey(key)){
			var manAndMobile = initVisitCompanyNameMap.get(key);
			manAndMobile[0] = val;
		}
	}
	loadVisitCompanyNameSelectValue(false);
	var visitLinkMan = $("input[name=visitLinkMan]").val();
	if(old ==visitLinkMan && old!=""){
		$("input[name=visitLinkMan]").val(val);
	}else{
		//清空拜访联系人的值
		$("input[name=visitLinkMan]").val('');
	}

});

$(document).on("change","input[name=integratorLinkMobile]",function(){
	var val = $(this).val();
	var old = $(this).attr("oldvalue");
	$(this).attr('oldvalue',val);
	
	var companyName = $(this).parent().parent().find("input[name=integratorCompanyName]").val();
	var rowid = $(this).parent().parent().attr("id");
	if(companyName){
		var key = rowid+'_'+companyName;
		if(initVisitCompanyNameMap.containsKey(key)){
			var manAndMobile = initVisitCompanyNameMap.get(key);
			manAndMobile[1] = val;
		}
	}
	loadVisitCompanyNameSelectValue(false);
	var visitLinkMobile=$("input[name=visitLinkMobile]").val();
	if(old == visitLinkMobile && old!=""){
		$("input[name=visitLinkMobile]").val(val);
	}else{
		//清空拜访电话的值
		$("input[name=visitLinkMobile]").val('');
	}
	
});