$(function() {
	loadVerifyDetail();
});

function loadVerifyDetail() {
	var param = {
		verifyId : verifyId
	};

	postUtil.call("/member/verify/detail", param, function(result) {
		initPage(result);
		initLayUi();
	});
	
	postUtil.call("/member/verify/detaillog", param, function(result) {
		initLogsTable(result.DATA);
	});
}

function initPage(result) {
	var htm = '';
	htm = htm + initField("公司名称", result.DATA.accountName);
	var address = result.DATA.address || '';
	if( address != ''){
		htm = htm + initField("公司地址", address);
	}
	var fixedPhoneNumber = result.DATA.fixedPhoneNumber || '';
	if( fixedPhoneNumber != '' ){
		htm = htm + initField("公司电话", fixedPhoneNumber);
	}
	htm = htm + initLienceSelect(result);
	$("#field_div").append(htm);
	var status = result.DATA.status;
	if(status != 'VERIFYING'){
		initRadioByValue("verifyResult", status);
		$('textarea[name=remark]').val(result.DATA.remark);
		$('input[name=verifyResult]').attr("disabled", "disabled");
		$('textarea[name=remark]').attr("disabled", "disabled");
		$('button[lay-filter=demo1]').hide();
	}

	if( status == 'VERIFIED'){
		$("#inteSocialCreditNoDiv").show();
		$('input[name=inteSocialCreditNo]').val(result.DATA.inteSocialCreditNo);
		$('input[name=inteSocialCreditNo]').attr("disabled", "disabled");
	}

	$('#verify_data_table').html(initHead(result));
}

function initHead(result){
	var accountManage = result.DATA.accountManagerName || '';
	accountManage = (accountManage == "undefined" ? "":accountManage);
	return'<span>用户名称：' + result.DATA.userRealName + '</span><span class="ml50">联系电话：' + result.DATA.mobile + '</span><span class="ml50">客户经理：' + accountManage + '</span>';
}

function initField(displayName, value) {
	return '<div class="layui-form-item" style="margin-bottom: 0;">'
			+ '<label class="layui-form-label">' + displayName
			+ '：</label>' + '	<div class="layui-input-block t-l">'
			+ '   	<p class="line38">' + value + '</p>' + '	</div>'
			+ '</div>';
}

function initLienceSelect(result){
	var htm;
	var certificationType = result.DATA.certificationType || '';
	if(certificationType == 'NORMAL'){
		var objImgId1 = "'"+ result.DATA.businessLicenseImg +"'";
		var objImgId2 = "'"+ result.DATA.taxRegistrationCertificateImg +"'";
		var objImgId3 = "'"+ result.DATA.orgCodeCertificateImg +"'";
		htm ='<div class="layui-form-item">'
			+'	<label class="layui-form-label">证件类型：</label>'
			+'	<div class="layui-input-block t-l"> '
			+'		<p class="line38">营业执照+税务登记证+组织机构代码证 </p>'
			+'		<div class="jun-papers">'
			+'			<ul>'
			+'				<li>'
			+'					<p class="span">营业执照</p> <a href="' + result.DATA.businessLicenseImg + '" class="c-h" download="' + result.DATA.accountName + '_营业执照">下载</a> <img  onClick="viewLienceImgs(' + objImgId1 + ');"  src="' + result.DATA.businessLicenseImg + '" alt="">      '
			+'				</li>                                                                                                                    '
			+'				<li>                                                                                                                     '
			+'					<p class="span">税务登记证</p> <a href="' + result.DATA.taxRegistrationCertificateImg + '" class="c-h" download="' + result.DATA.accountName + '_税务登记证">下载</a> <img  onClick="viewLienceImgs(' + objImgId2 + ');"  src="' + result.DATA.taxRegistrationCertificateImg + '" alt="">    '
			+'				</li>                                                                                                                    '
			+'				<li>                                                                                                                     '
			+'					<p class="span">组织机构代码证</p> <a href="' + result.DATA.orgCodeCertificateImg + '" class="c-h" download="' + result.DATA.accountName + '_组织机构代码证">下载</a> <img  onClick="viewLienceImgs(' + objImgId3 + ');"  src="' + result.DATA.orgCodeCertificateImg + '" alt="">'
			+'				</li>                                                                                                                    '
			+'			</ul>'
			+'		</div>'
			+'	</div>'
			+'</div>';
	}else{
		var objImgId1 = "'"+ result.DATA.oneCertificateImg +"'";
		htm ='<div class="layui-form-item">'
			+'	<label class="layui-form-label">证件类型：</label>'
			+'	<div class="layui-input-block t-l">'
			+'		<p class="line38">三证合一</p>'
			+'		<div class="jun-papers">'
			+'			<ul>'
			+'				<li>'
			+'					<p class="span" style="top:-30px;width:300px;">包含：营业执照+税务登记证+组织机构代码证</p> <a href="' + result.DATA.oneCertificateImg + '" class="c-h" download="' + result.DATA.accountName + '_三证合一">下载</a> <img  onClick="viewLienceImgs(' + objImgId1 + ');"  src="' + result.DATA.oneCertificateImg + '" alt="">      '
			+'				</li>'
			+'			</ul>'
			+'		</div>'
			+'	</div>'
			+'</div>';
	}
	return htm;
}

function initLogsTable(data){
	var htm = '';
	$.each(data, function(n, item){
		var newDate = new Date();
		newDate.setTime(item.createTime);
		var result = (item.remark && item.remark != '' && item.remark != null ) ? (item.verifyResult + ',' + item.remark) : item.verifyResult;
		htm = htm + '<tr><td>' + item.createUser + '</td><td>' + newDate.format('yyyy-MM-dd h:m:s') + '</td><td>' + result  + '</td></tr>'
	});
	$('#logs_table tbody').append(htm);
	
	
}

function initLayUi(){
	layui.use(
		[ 'form', 'layedit', 'laydate', 'layer' ],
		function() {
			var form = layui.form(), layer = layui.layer, layedit = layui.layedit, laydate = layui.laydate;

			//创建一个编辑器
			var editIndex = layedit.build('LAY_demo_editor');

			//自定义验证规则
			/*form.verify({
				remark : function(value) {
					var checkValue = $('input[name=verifyResult]:checked').val();
					if(checkValue == 'VERIFY_FAILED'){
						if (value.length < 5) {
							return '审批意见至少得5个字符啊';
						}
					}
				},
				content : function(value) {
					layedit.sync(editIndex);
				}
			});*/

			form.on('radio(verifyResult)', function(data){
				if(data.value=="VERIFIED"){
					$("#inteSocialCreditNoDiv").show();
				}else{
					$("#inteSocialCreditNoDiv").hide();
				}
			});

			//监听指定开关
			form.on('switch(switchTest)', function(data) {
				layer.msg('开关checked：'
						+ (this.checked ? 'true' : 'false'), {
					offset : '6px'
				});
				layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF',
						data.othis)
			});

			//监听提交
			form.on('submit(demo1)', function(data) {
				/* layer.alert(JSON.stringify(data.field), {
					title : '最终的提交信息'
				}); */
				data.field.verifyId = verifyId;
				if(!data.field.verifyResult){
					layer.msg('请勾选审核意见', {icon: 5});
                    return false;
				}
				if(!data.field.inteSocialCreditNo && data.field.verifyResult == 'VERIFIED'){
					layer.msg('请输入企业社会信用代码', {icon: 5});
					return false;
				}
				if(!/(^[0-9A-Z]{18}$)|(^[0-9A-Z]{15}$)/.test(data.field.inteSocialCreditNo) && data.field.verifyResult=='VERIFIED'){
					layer.msg('请输入正确的企业社会信用代码', {icon: 5});
					return false;
				}
				if(data.field.verifyResult == "VERIFY_FAILED" && !data.field.remark){
					layer.msg('请输入审批意见啊', {icon: 5});
                    return false;
				}
				
				postUtil.call("/member/verify/apply", data.field, function(result) {
					layer.open({
	      				  title: '操作提示',
	      				  skin: 'youskin',
	      				  area: ['480px', '300px'],
	      				  btnAlign: 'c',
	      				  content: '<p class="iconfont icon-yiwancheng1" style="text-align: center;margin-top: 30px;"></p><p style="text-align: center;margin-top: 30px;font-size:12px;color:#222222">' + result.MSG + '</p>',
	      				  btn: ['关闭'],
	      				  yes: function(index, layero){
	      					  postUtil.submit('/member/verify/preList',null);
	      				  }
	      				});
				});
				return false;
			});
		});
}

function viewLienceImgs(img){
	layer.open({
		  type: 1,
		  title: false,
		  closeBtn: 1,
		  area: '400',
		  skin: 'layui-layer-nobg', //没有背景色
		  shadeClose: true,
		  content: '<img width="800px;" src="' + img +'"/>'
		});
}