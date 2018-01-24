
$(function () {
	initPage();
});

function initPage(){
	 var param={};
	 var now = new Date().Format("yyyy-MM");
	 $("#fromDateByDay").val(now);
	 param.fromDate = now;
	 param.chartType="1";
	 param.chartObject="1";
	 postUtil.call("/statistics/lineData", param, function (result) {
		 if(result.success==true){
			 var data = result.data;
			 if(data!=null){
				 makeUpEchart(data);
			 }else{
				 layer.msg("获取数据失败！", {icon: 5});
			 }
			 
		 }else{
			 layer.msg(result.msg, {icon: 5});
		 }
	 });
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function searchByDay(){
	$(".year").css({
		"display":"none"
	});
	$(".month").css({
		"display":"none"
	});
	
	$(".day").css({
		"display":"block"
	});
	 var now = new Date().Format("yyyy-MM");
	 $("#fromDateByDay").val(now);
	 _chartType="1";
	 doSearch();

}

function searchByWeek(){
	 var now = new Date().Format("yyyy-MM");
	 $("#fromDateByDay").val(now);
	 
	var now = new Date().Format("yyyy-MM");
	$("#toDate").val(now);
	_chartType="2";
	
	$(".year").css({
		"display":"none"
	});
	$(".month").css({
		"display":"block"
	});
	
	$(".day").css({
		"display":"block"
	});
	doSearch();
	
}

function searchByYear(){
	$(".year").css({
		"display":"block"
	});
	$(".month").css({
		"display":"none"
	});
	
	$(".day").css({
		"display":"none"
	});
	
	 var now = new Date().Format("yyyy");
	 $("#fromDateByYear").val(now);
	 _chartType="3";
	 doSearch();
}

function doSearch(){
	var param={};
	 param.type=$('#type_hidden').val();
	 param.creator=$('#creator').find("option:selected").val();
	 param.chartType=_chartType;
	 if(_chartType=="1"){
		 param.fromDate=$("#fromDateByDay").val();
	 }else if(_chartType=="2"){
		 param.fromDate=  $("#fromDateByDay").val();
		 param.toDate= $("#toDate").val();
	 }else{
		 param.fromDate= $("#fromDateByYear").val();
	 }
	 param.chartObject="1";
//	 alert(JSON.stringify(param));
	 postUtil.call("/statistics/lineData", param, function (result) {
		 if(result.success==true){
			 var data = result.data;
			 if(data!=null){
				 makeUpEchart(data);
			 }else{
				 layer.msg("获取数据失败", {icon: 5});
			 }
		 }
		 else{
			 layer.msg(result.msg, {icon: 5});
		 }
	 });
}

//function export(){
//	
//}

function  makeUpEchart(data){
	
	var axisLabel ={};
	var bottom =null;
	var gridLeft =null;
	var gridRight =null;
	if(_chartType=="1"){
		axisLabel.interval=0;
		axisLabel.rotate=60;
		bottom ="10%";
		gridLeft="3%";
	    gridRight="3%";
	}else{
		bottom ="3%";
		gridLeft="6%";
	    gridRight="7%";
	}
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    var category =[];
    for(var i=0;i<data.category.length;i++){
    	category.push(data.category[i]);
    }
    var data1 =[];
    
    for(var i=0;i<data.series[0].data.length;i++){
    	data1.push(data.series[0].data[i]);
    }
    var data2 =[];
    for(var i=0;i<data.series[1].data.length;i++){
    	data2.push(data.series[1].data[i]);
    }
   
    // 指定图表的配置项和数据
    option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['客户']
        },
        grid: {
            left: gridLeft,
            right: gridRight,
            bottom: bottom,
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                magicType : {  
                    show : true,  
                    type : [ 'line', 'bar' ]  
                }
            },
            right:"8%"
        },
        xAxis: {
            type: 'category',
//            data: ['2017/4/1','2017/4/2','2017/4/3',
//                '2017/4/4','2017/4/5','2017/4/6','2017/4/7','2017/4/8','2017/4/9','2017/4/10','2017/4/11','2017/4/12','2017/4/13','2017/4/14','2017/4/15','2017/4/16','2017/4/17','2017/4/18','2017/4/19'
//                ,'2017/4/20','2017/4/21','2017/4/22','2017/4/23','2017/4/24','2017/4/25','2017/4/26','2017/4/27','2017/4/28','2017/4/29','2017/4/30']
          data: category,
          axisLabel:axisLabel,
          boundaryGap : false 
        },
        yAxis: {
            type: 'value',
            min:0,
            minInterval: 1
            
        },
        series: [
            {
                name:'客户',
                type:'line',
                itemStyle: {
                    normal: {
                        color: '#035a9d'
                    }
                },
                smooth: true,
                data:data1,
            }
//            ,
//            {
//                name:'对应客户数',
//                type:'line',
//                smooth: true,
//                itemStyle: {
//                    normal: {
//                        color: '#f48000'
//                    }
//                },
//                data:data2,
//            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function exportCustomer(){
	var param={};
	 param.type=$('#type_hidden').val();
	 param.creator=$('#creator').find("option:selected").val();
	 param.chartType=_chartType;
	 if(_chartType=="1"){
		 param.fromDate=$("#fromDateByDay").val();
	 }else if(_chartType=="2"){
		 param.fromDate=  $("#fromDateByDay").val();
		 param.toDate= $("#toDate").val();
	 }else{
		 param.fromDate= $("#fromDateByYear").val();
	 }
	param.chartObject="1";
	postUtil.call("/statistics/lineData", param, function (result) {
		 if(result.success==true){
			 var data = result.data;
			 if(data!=null){
				 makeUpEchart(data);
				 postUtil.submit("/statistics/exportExcel",param);
			 }else{
				 layer.msg("获取数据失败", {icon: 5});
			 }
		 }
		 else{
			 layer.msg(result.msg, {icon: 5});
		 }
	});
	
}