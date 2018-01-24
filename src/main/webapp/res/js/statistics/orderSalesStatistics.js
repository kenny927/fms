/**
 * Created by junior on 2017/9/22.
 */
var form,laydate,vm,$,layer;
layui.use(['form','laydate','layer'], function() {
    form = layui.form;
    laydate = layui.laydate;
    layer = layui.layer;
    $ = layui.$;
    //自定义查找
    laydate.render({
        elem: '#diyDate'
        ,range: true,
         max: moment().format('YYYY-MM-DD')
    });
    //按周查找
    $('#date-range1').dateRangePicker({
        batchMode: 'week',
        showShortcuts: false,
        separator:'至',
        endDate:moment().format('YYYY-MM-DD')
    });
    //按月查找
    laydate.render({
        elem: '#monthDate'
        ,type: 'month',
        max: moment().format('YYYY-MM')
    });
    Vue.filter("formatQuantity", function(value, length) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
        if(value != undefined ){
            return Number(value).toFixed(length);
        }else{
            return "--";
        }
    });
   vm = new Vue({
       el:'#orderSalesStatistics',
       data:{
           queryParam:{
               fromDate:'2017-01-01',
               toDate:moment().format('YYYY-MM-DD'),
               pageNumber:1,
               orderType:'ALL'
           },
           addTen:0,
           timeFrame:'diy',
           skuList:[],
           echartsList:[],
           echartsName:[],
           sumData:{
               orderSalesNum:'',
               accountNum:'',
               totalAmount:''
           }
       },
       created:function () {
           this.showData(this.queryParam);
       },
       ready:function () {
           $('#diyDate').val('2017-01-01 - '+moment().format('YYYY-MM-DD'));
       },
       methods:{
           showData:function (prarm) {
               postUtil.call('/statistics/getOrderSalesListPageData', prarm, function (pageResult) {
                   if(pageResult.success == true){
                       var pageNumber = pageResult.data.pageNumber;
                       var totalPage = pageResult.data.totalPage;
                       var totalRow = pageResult.data.totalRow;
                       laypage({
                           cont: 'paginationDiv',
                           pages: totalPage,
                           curr: pageNumber,
                           total:totalRow,
                           skip: true,
                           jump: function (obj, first) {
                               vm.addTen = 0;
                               vm.addTen =vm.addTen + (obj.curr -1)*10;
                               if (!first) {
                                   vm.queryParam.pageNumber =  obj.curr;
                                   vm.showData(vm.queryParam);
                               }
                           }
                       });
                       vm.skuList = pageResult.data.list;
                   }else {
                       layer.msg(pageResult.message, {icon: 6});
                   }
               })
               postUtil.call('/statistics/getAllOrderSalesData', prarm, function (pageResult) {
                   if(pageResult.success == true){
                       vm.echarts(pageResult);
                   }else {
                       layer.msg(pageResult.message, {icon: 6});
                   }
               })
           },
           searchSkuList:function () {
               if(this.timeFrame == 'diy'){
                   var str = $('#diyDate').val();
                   if(str==""){
                       layer.msg("请选择时间",{icon: 5});
                       return false;
                   }
                   this.queryParam.fromDate = str.split(" - ")[0];
                   this.queryParam.toDate = str.split(" - ")[1];
               }else if(this.timeFrame == 'week'){
                   var str = $('#date-range1').val();
                   if(str==""){
                       layer.msg("请选择时间",{icon: 5});
                       return false;
                   }
                   this.queryParam.fromDate = str.split("至")[0];
                   this.queryParam.toDate = str.split("至")[1];
               }else if(this.timeFrame == 'month'){
                   var str = $('#monthDate').val();
                   if(str==""){
                       layer.msg("请选择时间",{icon: 5});
                       return false;
                   }
                   this.queryParam.fromDate = str+"-01";
                   if(str==moment().format('YYYY-MM')){
                       this.queryParam.toDate = moment().format('YYYY-MM-DD');
                   }else {
                       this.queryParam.toDate = moment(str).endOf('month').format("YYYY-MM-DD");
                   }
               }
               this.queryParam.pageNumber=1;
               this.showData(this.queryParam);
           },
           exportData:function () {
               postUtil.submit("/statistics/orderSales/exportExcel",this.queryParam, function (res) {
                   layer.msg("导出成功");
               })
           },
           echarts:function (data) {
               // 指定图表的配置项和数据
               vm.echartsName = [];
               vm.echartsList = [];
               vm.sumData = data.sumData;
               var myChart = echarts.init(document.getElementById('main'));
               $.each(data.data,function (index,item) {
                   vm.echartsName.push(item.accountName);
                   vm.echartsList.push({
                       value:item.totalAmount,
                       name:item.accountName
                   })
               })
               option = {
                   title : {
                       text: '',
                   },
                   tooltip : {
                       trigger: 'item',
                       formatter: '{a} <br/>{b} : {c} ({d}%)'
                   },
                   legend: {
                       orient: 'vertical',
                       left: 'left',
                       top:'20%',
                       data: this.echartsName
                   },
                   series : [
                       {
                           name: '',
                           type: 'pie',
                           radius : '75%',
                           center: ['70%', '50%'],
                       //     label: {
                       //         normal: {
                       //             show: true,
                       // position: 'outside'
                       //         },
                       //         emphasis: {
                       //             show: false,
                       //             textStyle: {
                       //                 fontSize: '12'
                       //             }
                       //         }
                       //     },
                       //     labelLine: {
                       //         normal: {
                       //             show: false
                       //         }
                       //     },
                           data:this.echartsList,
                           x:'right',
                           itemStyle: {
                               emphasis: {
                                   shadowBlur: 10,
                                   shadowOffsetX: 0,
                                   shadowColor: 'rgba(0, 0, 0, 0.5)'
                               }
                           }
                       }
                   ]
               };
               myChart.setOption(option);
           }
       }
   })
    //时间查询
    form.on('select(timeFrame)', function(data){
        vm.timeFrame = data.value;
    });
    //类型查询
    form.on('select(findType)', function(data){
        vm.queryParam.orderType = data.value;
        console.log(data.value);
    });
})