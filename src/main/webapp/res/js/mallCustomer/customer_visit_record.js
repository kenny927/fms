function addVisitRecord(_accountId){
    layer.open({
        title: '新增拜访记录',
        type: 2,
        skin: 'msgskin',
        area: ['700px', '520px'],
        content: "/mallCustomer/addVisitRecordPage?accountId="+_accountId,
    });
}

function updateVisitRecord(_accountId,visitRecordId){
    layer.open({
        title: '修改拜访记录',
        type: 2,
        skin: 'msgskin',
        area: ['700px', '520px'],
        content: "/mallCustomer/addVisitRecordPage?accountId="+_accountId+"&visitRecordId="+visitRecordId,
    });
}

function validateForm(){
	var flag = true;
	var visitTime = $("input[name=visitTime]");
	if(!visitTime.val()){
		visitTime.attr("required","required");
		return false;
	}
	var content = layedit.getContent(edit_index);
	if(!content){
		showMsg("请填写拜访记录");
		return false;
	}
	return flag;
}

function closeLayer(){
	var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	parent.layer.close(index); //再执行关闭   
}

function saveVisitRecord(){
	if(!validateForm()){
		return;
	}
	var param={
		accountId:accountId,
		visitRecordId :visitRecordId,
		visitTime:$("input[name=visitTime]").val(),
		linkMan:$("select[name=linkman]").val(),
		visitType:$("select[name=visitType]").val(),
		content:layedit.getContent(edit_index)
	};
	if(!visitRecordId){
		//为空就是增加
		postUtil.call("/mallCustomer/saveVisitRecord",param,function(response){
			if(response.success){
				closeLayer();
				parent.saveVisitRecordCallback(response);
			}
		});
	}else{
		//不为空就是修改
		postUtil.call("/mallCustomer/updateVisitRecord",param,function(response){
			if(response.success){
				closeLayer();
				parent.updateVisitRecordCallback(response);
			}
		});
	}

}

function addLinkMan(){
    layer.open({
        skin: 'msgskin',
        title: "新增联系人",
        type: 2,
        area: ['450px', '470px'],
        fixed: false, //不固定
        maxmin: true,
        content: '/systemAccountLinkman/preAddSystemAccountLinkman?accountId='+ accountId
    });
}

function addAccountLinkmanCallback(result) {
    if(result.STATUS == "SUCCESS") {
    	loadLinkMan(accountId);
    	parent.refreshlinkmanlist();
        return true;
    }else {
        return false;
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

function loadVisitTime(){
	var config = {
		min: startDate,
		max: laydate.now(),
		istime:true,
		format: 'YYYY-MM-DD hh:mm',
		istoday: true
	};
	document.getElementById('visitTime').onclick = function(){
		config.elem = this;
		laydate(config);
	};
}

function loadLinkMan(accountId){
	postUtil.call("/mallCustomer/getLinkmanData",{accountId:accountId},function(response){
		if(response.success){
			$.each($('#linkman').children(),function(index,element){
				if(index!=0){
					$(element).remove();
				}
			});
			$.each(response.data,function(index,element){
				if(linkMan){
					var html = '<option value="'+element.linkmanId+'"'+(element.linkmanId==linkMan?'selected':'')+'>'+element.linkmanName+'('+element.linkmanTelephone+')'+(element.linkmanPosition||'')+'</option>'
				}else{
					var html = '<option value="'+element.linkmanId+'"'+(index==0?'selected':'')+'>'+element.linkmanName+'('+element.linkmanTelephone+')'+(element.linkmanPosition||'')+'</option>'
				}
				$('#linkman').append(html);
			});
			form.render('select');
		}
	});
}