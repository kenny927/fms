/**
 * Created by junior on 2017/9/7.
 */
var vm,form,layer;
layui.use(['form','element','tree'], function(){
    form = layui.form();
    layer = layui.layer;
    var $ = layui.jquery;
    $form = $($('.form-css')[0]);
    $formPopup = $('#edit');

    postUtil.call('/reusable/skuBrand/allBrandJsonData', null, function (result) {
        var opts = '<option value="" selected>全部</option>';
            for(var i=0;i<result.length;i++){
                opts += " <option value= '" + result[i].brandId + "' >" + result[i].brandChineseName + "</option>";
            }
            $form.find('select[name=brand]').find('option').eq(0).siblings().remove();
            $form.find('select[name=brand]').append(opts);
            form.render();
    });
    //过滤器
    Vue.filter('nullValue', function (input) {
        if (input == "" || input == undefined) {
            input = "--";
        }
        return input
    });
    Vue.filter("formatQuantity", function(value, length) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
        if(value != undefined ){
            return Number(value).toFixed(length);
        }else{
            return "--";
        }
    });

    vm = new Vue({
        el:'#newSkuList',
        data:{
            queryParam:{
                currentPageIndex:1,
                pageSize:10,
                skuName:'',
                brandId:'',
                skuMallStatus:'',
                skuOrderStatus:'',
                classifyDisplayName:'',
                mallClassifyDisplayName:'',
                orderSkuClassifyId:'',
                mallSkuClassifyId:'',
                skuClassifyIdEdit:'',
                classifyDisplayNameEdit:'',
                mallClassifyDisplayNameEdit:'',
                skuId:''
            },
            skuList:[],
            brandList:[],
            checkLists:[],
            treeShow:false,
            treeShowEdit:false,
            treeShowMall:false,
            treeShowMallEdit:false,
            allChecked : false,
            chooseNum:0,
            basePrice:'',
            directoryPrice:'',
            fxStatus:'',
            mallStatus:''
        },
        created: function () {
            this.showData(this.queryParam);
            this.treeList('#fxTree','/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree','orderSkuClassifyId','classifyDisplayName','treeShow',false);
            this.treeList('#mallTree','/reusable/mallClassificatory/getAllMallClassificatoryJsonForLayuiTree','mallSkuClassifyId','mallClassifyDisplayName','treeShowMall',false);
            this.treeList('#fxTreeEdit','/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree','skuClassifyIdEdit','classifyDisplayNameEdit','treeShowEdit',true);
            this.treeList('#mallTreeEdit','/reusable/mallClassificatory/getAllMallClassificatoryJsonForLayuiTree','mallSkuClassifyIdEdit','mallClassifyDisplayNameEdit','treeShowMallEdit',true);
        },
        methods:{
            showData:function (obj) {
                postUtil.call('/sku/getList', obj, function (pageResult) {
                    console.log(pageResult);
                    var pageNumber = pageResult.pageNumber;
                    var totalPage = pageResult.totalPage;
                    var totalRow = pageResult.totalRow;
                    laypage({
                        cont: 'paginationDiv',
                        pages: totalPage,
                        curr: pageNumber,
                        total:totalRow,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {
                                vm.chooseNum = 0;
                                vm.allChecked = false;
                                var queryParam = {};
                                queryParam.currentPageIndex =  obj.curr;
                                queryParam.pageSize = vm.queryParam.pageSize;
                                queryParam.skuName = vm.queryParam.skuName;
                                queryParam.skuOrderStatus = vm.queryParam.skuOrderStatus;
                                queryParam.skuMallStatus = vm.queryParam.skuMallStatus;
                                queryParam.brandId = vm.queryParam.brandId;
                                queryParam.orderSkuClassifyId =  vm.queryParam.orderSkuClassifyId;
                                queryParam.mallSkuClassifyId =  vm.queryParam.mallSkuClassifyId;
                                vm.queryParam.skuId='';
                                var skuIdTemp = $("#skuIdLists").html();
                                var skuIdArray = skuIdTemp.replace(/\n/g,";").split(/[;；,，\n ]/);
                                for(var i=0;i<skuIdArray.length;i++){
                                    vm.queryParam.skuId+=skuIdArray[i]+';';
                                }
                                queryParam.skuId = vm.queryParam.skuId;

                                vm.showData(queryParam);
                            }
                        }

                    });
                    var list = pageResult.list;
                    $.each(list,function (index,item) {
                        item.checked = false;
                        if(!item.mallClassifyAllParentName){
                            item.mallClassifyAllParentName="";
                        }
                        if(!item.mallSkuClassifyId){
                            item.mallSkuClassifyId="";
                        }
                    })
                    vm.skuList = list;
                });
            },
            dropDown:function (treeShow) {
                this[treeShow] = !this[treeShow];
            },
            bodyClick:function () {
                this.treeShow = false;
                this.treeShowMall = false;
                this.treeShowEdit = false;
                this.treeShowMallEdit = false;
            },
            treeClick:function (treeShow) {
                this[treeShow] = true;
            },
            chooseAllGoods:function () {
                this.allChecked = !this.allChecked;
                for(var i=0;i<this.skuList.length;i++) {
                    if(this.allChecked){
                        this.skuList[i].checked = true;
                        this.chooseNum=this.skuList.length;
                    }else {
                        this.skuList[i].checked = false;
                        this.chooseNum=0
                    }
                };
            },
            choose:function (e,n) {
                this.skuList[n].checked = !this.skuList[n].checked;
                var el = e.target;
                if(!el.checked){
                    this.allChecked = false;
                    this.chooseNum--;
                }else {
                    this.chooseNum++;
                    if(this.chooseNum==this.skuList.length){
                        this.allChecked = true;
                    }
                }
            },
            goEdit:function (n,skuId,fxName,fxId,mallName,mallId,basePrice,directoryPrice,fxStatus,mallStatus) {
                this.queryParam.classifyDisplayNameEdit = fxName;
                this.queryParam.mallClassifyDisplayNameEdit = mallName;
                this.queryParam.skuClassifyIdEdit = fxId;
                this.queryParam.mallSkuClassifyIdEdit = mallId;
                this.basePrice = basePrice;
                this.directoryPrice = directoryPrice;
                this.fxStatus = fxStatus;
                this.mallStatus = mallStatus;
                if(this.mallStatus=="D"){
                    var  mallPopup = '<option value="D" selected="">下架</option>';
                }else{
                    var  mallPopup = '<option value="D" >下架</option>';
                }
                if(this.fxStatus=="D"){
                    var  fxPopup = '<option value="D" selected="">下架</option>';
                }else{
                    var  fxPopup = '<option value="D" >下架</option>';
                }
                $formPopup.find('select[name=fxStatus]').find('option').eq(0).siblings().remove();
                $formPopup.find('select[name=mallStatus]').find('option').eq(0).siblings().remove();
                $formPopup.find('select[name=fxStatus]').append(fxPopup);
                $formPopup.find('select[name=mallStatus]').append(mallPopup);
                form.render();
                layer.open({
                    title: "请选择SKU",
                    skin:'msgskin',
                    type: 1,
                    area: ['800px','400px'],
                    content: $('#edit'),
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                     vm.skuList[n].classifyParentName = vm.queryParam.classifyDisplayNameEdit;
                     vm.skuList[n].mallClassifyAllParentName = vm.queryParam.mallClassifyDisplayNameEdit;
                     vm.skuList[n].orderSkuClassifyId = vm.queryParam.skuClassifyIdEdit;
                     vm.skuList[n].mallSkuClassifyId = vm.queryParam.mallSkuClassifyIdEdit;
                     vm.skuList[n].basePrice = vm.basePrice;
                     vm.skuList[n].directoryPrice = vm.directoryPrice;

                        var param={};
                        param.skuId=skuId;
                        param.orderSkuClassifyId = vm.queryParam.skuClassifyIdEdit;
                        param.mallSkuClassifyId= vm.queryParam.mallSkuClassifyIdEdit;
                        param.basePrice = vm.basePrice;
                        param.directoryPrice = vm.directoryPrice;
                        param.skuOrderStatus = vm.fxStatus;
                        param.skuMallStatus = vm.mallStatus;
                        if(vm.mallStatus == "U"){
                        	if(vm.queryParam.mallSkuClassifyIdEdit==""){
                        		layer.msg("商城分类上架时需要维护商城分类!",{icon:5});
                        		return;
                        	}
                        }
                        postUtil.call("/sku/updateSkuInfo",param, function (res) {
                            if(res.STATUS == "SUCCESS") {
                                layer.msg("修改成功");
                                vm.skuList[n].skuOrderStatus = vm.fxStatus;
                                vm.skuList[n].skuMallStatus = vm.mallStatus;
                            }else{
                            	layer.msg(res.MSG);
                            }
                        })
                    layer.close(index);
                    },btn2: function(index, layero){
                        layer.close(index);
                    },
                    cancel: function(){

                    }
                });
            },
            treeList:function (obj,url,id,name,treeShow,flg) {
                var treeOption ={};
                treeOption.skin = "shihuang";
                treeOption.elem = obj;
                var classifyId,allParentName;
                treeOption.click = function (node) {
                    var classifyIsLeaf = node.classifyIsLeaf;
                    var isLeaf = node.isLeaf;
                    if(flg){
                        if (classifyIsLeaf == "1"||isLeaf=="1") {
                            classifyId = node.classifyId;
                            allParentName = node.allParentName;
                            if (classifyId == "0") {
                                allParentName = "全部";
                            }
                            vm.queryParam[id] = classifyId;
                            vm.queryParam[name] = allParentName;
                            vm[treeShow] = false;
                        } else {
                            layer.msg("请选择叶子节点", {"icon": "5"});
                        }
                    }else{
                        classifyId = node.classifyId;
                        allParentName = node.allParentName;
                        if(classifyId == "0") {
                            allParentName = "全部";
                        }
                        vm.queryParam[id] = classifyId;
                        vm.queryParam[name] = allParentName;
                        vm[treeShow] = false;
                    }
                };
                postUtil.call(url, null, function (result) {
                    treeOption.nodes = result;
                    layui.tree(treeOption);
                });
            },
            goodDetail:function (skuId) {
                cardUtil.openCard("预览商品-" + skuId,"/sku/previewBySkuId?skuId=" + skuId);
                cardUtil.changeCard("预览商品-" + skuId);
            },
            goEditDetail:function (skuId) {
                cardUtil.openCard("修改商品-" + skuId,"/sku/goEdit?skuId=" + skuId);
                cardUtil.changeCard("修改商品-" + skuId);
            },
            goCopyDetail:function (skuId) {
                cardUtil.openCard("复制商品","/sku/goCopy?skuId=" + skuId);
                cardUtil.changeCard("复制商品");
            },
            addSkuDetail:function () {
                cardUtil.openCard("新增商品","/sku/goAdd");
                cardUtil.changeCard("新增商品");
            },
            batchUpdataIndex:function () {
                this.checkLists=[];
                $.each(this.skuList,function (index,item) {
                    if(item.checked == true){
                        vm.checkLists.push(item.skuId);
                    }
                })
                if(this.chooseNum==0){
                    layer.msg("请先勾选商品,再执行此操作");
                    return false;
                }
                var param={};
                param.skuIdList=this.checkLists;
                postUtil.call("/sku/batchUpdataIndex", {jsonData:JSON.stringify(param)}, function (res) {
                    if(res.STATUS == "SUCCESS") {
                        layer.msg("批量处理成功", {icon: 6});
                    }
                    else {
                        layer.msg(res.MSG, {icon: 5});
                    }
                    layer.closeAll("loading");
                });
                
            },
            allUpdataIndex:function () {
                postUtil.call("/sku/allUpdataIndex",null, function (res) {
                    if(res.STATUS == "SUCCESS") {
                        layer.msg("批量处理成功", {icon: 6});
                    }
                    else {
                        layer.msg(res.MSG, {icon: 5});
                    }
                    layer.closeAll("loading");
                });
            },
            //导出
            exportData:function () {
                this.checkLists=[];
                var param={};
                param.skuType = "NORMAL";
                $.each(this.skuList,function (index,item) {
                    if(item.checked == true){
                        vm.checkLists.push(item.skuId);
                    }
                })
                if(this.checkLists.length==0){
                    param.skuName = this.queryParam.skuName;
                    param.skuOrderStatus = this.queryParam.skuOrderStatus;
                    param.skuMallStatus = this.queryParam.skuMallStatus;
                    param.brandId = this.queryParam.brandId;
                    param.orderSkuClassifyId =  this.queryParam.orderSkuClassifyId;
                    param.mallSkuClassifyId =  this.queryParam.mallSkuClassifyId;
                    vm.queryParam.skuId='';
                    var skuIdTemp = $("#skuIdLists").html();
                    var skuIdArray = skuIdTemp.replace(/\n/g,";").split(/[;；,，\n ]/);
                    for(var i=0;i<skuIdArray.length;i++){
                        vm.queryParam.skuId+=skuIdArray[i]+';';
                    }
                    param.skuId = vm.queryParam.skuId;
                }else {
                    param.skuId=this.checkLists.join(";");
                }
                postUtil.submit("/sku/exportSkuExcel",param, function (res) {
                    layer.msg("导出成功");
                })
            },//上下架
            setAllStatus:function (status,type) {
                this.checkLists=[];
                $.each(this.skuList,function (index,item) {
                    if(item.checked == true){
                        vm.checkLists.push(item.skuId);
                    }
                })
                if(this.chooseNum==0){
                    layer.msg("请先勾选商品,再执行此操作");
                    return false;
                }
                var param={};
                param.skuIdList=this.checkLists;
                param.statusType=type;
                param.statusValue=status;

                postUtil.call("/sku/updateSkuStatus",{jsonData:JSON.stringify(param)}, function (res) {
                    if(res.STATUS == "SUCCESS") {
                        if(status == 'U'){
                        	if(res.skuIdFailList!=null&&res.skuIdFailList.length>0){
                        		var MSG="";
                        		var msgT = "上架失败的商品编码为("+res.skuIdFailList.length+"个)：";
                        		for(var i=0;i<res.skuIdFailList.length;i++){
                        			msgT+=res.skuIdFailList[i]+","
                        		}
                        		msgT=msgT.substring(0,msgT.length-1);
                        		MSG +=msgT;
                        		
                        		var msgF = ",上架成功的商品编码为("+res.skuIdSuccessList.length+"个)：";
                        		if(res.skuIdSuccessList.length!=null&&res.skuIdSuccessList.length>0){
                               		for(var j=0;j<res.skuIdSuccessList.length;j++){
                            			msgF+=res.skuIdSuccessList[j]+",";
                                        $.each(vm.skuList,function (index,item) {
                                                if(item.skuId == res.skuIdSuccessList[j]){
                                                    item[type]= status;
                                                }

                                        });
                            		}
                               		msgF=msgF.substring(0,msgF.length-1);
                               		MSG +=msgF;
                        		}
                        		layer.msg(MSG);
                        	}else{
                                $.each(vm.skuList,function (index,item) {
                                    if(item.checked == true){
                                    	item[type]= status;
                                    }
                                });

                        		layer.msg("上架成功");
                        	}
                            
                        }else{
                            $.each(vm.skuList,function (index,item) {
                                if(item.checked == true){
                                	item[type]= status;
                                }
                            });
                            layer.msg("下架成功");
                        }
                    }else{
                        alert("提交有误")
                    }
                })
            },//回车查询
            enterBtn:function (skuName) {
                var tempParam = {};
                tempParam.currentPageIndex = this.queryParam.currentPageIndex;
                tempParam.pageSize = this.queryParam.pageSize;
                tempParam.skuName = skuName
                postUtil.call('/sku/getList', tempParam, function (pageResult) {
                    var pageNumber = pageResult.pageNumber;
                    var totalPage = pageResult.totalPage;
                    var totalRow = pageResult.totalRow;
                    laypage({
                        cont: 'paginationDiv',
                        pages: totalPage,
                        curr: pageNumber,
                        total:totalRow,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {
                                var queryParam = {};
                                queryParam.currentPageIndex =  obj.curr;
                                queryParam.pageSize = vm.queryParam.pageSize;
                                queryParam.skuName = skuName;
                                vm.showData(queryParam);
                            }
                        }

                    });
                    var list = pageResult.list
                    $.each(list,function (index,item) {
                        item.checked = false;
                        if(!item.mallClassifyAllParentName){
                            item.mallClassifyAllParentName="";
                        }
                        if(!item.mallSkuClassifyId){
                            item.mallSkuClassifyId="";
                        }
                    })
                    vm.skuList = list;
                });
            },
            searchSkuList:function () {
                this.queryParam.skuId='';
                var skuIdTemp = $("#skuIdLists").html();
                var skuIdArray = skuIdTemp.replace(/\n/g,";").split(/[;；,，\n <br>]/);
                for(var i=0;i<skuIdArray.length;i++){
                    this.queryParam.skuId+=skuIdArray[i]+';';
                }
                var tempParam = {};
                tempParam.currentPageIndex = this.queryParam.currentPageIndex;
                tempParam.pageSize = this.queryParam.pageSize;
                tempParam.skuName = this.queryParam.skuName;
                tempParam.skuOrderStatus = this.queryParam.skuOrderStatus;
                tempParam.skuMallStatus = this.queryParam.skuMallStatus;
                tempParam.brandId = this.queryParam.brandId;
                tempParam.orderSkuClassifyId =  this.queryParam.orderSkuClassifyId;
                tempParam.mallSkuClassifyId =  this.queryParam.mallSkuClassifyId;
                tempParam.skuId = this.queryParam.skuId;
                postUtil.call('/sku/getList', tempParam, function (pageResult) {
                    var pageNumber = pageResult.pageNumber;
                    var totalPage = pageResult.totalPage;
                    var totalRow = pageResult.totalRow;
                    laypage({
                        cont: 'paginationDiv',
                        pages: totalPage,
                        curr: pageNumber,
                        total:totalRow,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {
                                vm.chooseNum=0;
                                vm.allChecked = false;
                                var queryParam = {};
                                queryParam.currentPageIndex =  obj.curr;
                                queryParam.pageSize = vm.queryParam.pageSize;
                                queryParam.skuName = vm.queryParam.skuName;
                                queryParam.skuOrderStatus = vm.queryParam.skuOrderStatus;
                                queryParam.skuMallStatus = vm.queryParam.skuMallStatus;
                                queryParam.brandId = vm.queryParam.brandId;
                                queryParam.orderSkuClassifyId =  vm.queryParam.orderSkuClassifyId;
                                queryParam.mallSkuClassifyId =  vm.queryParam.mallSkuClassifyId;
                                queryParam.skuId = vm.queryParam.skuId;
                                vm.showData(queryParam);
                            }
                        }

                    });
                    var list = pageResult.list
                    $.each(list,function (index,item) {
                        item.checked = false;
                        if(!item.mallClassifyAllParentName){
                            item.mallClassifyAllParentName="";
                        }
                        if(!item.mallSkuClassifyId){
                            item.mallSkuClassifyId="";
                        }
                    })
                    vm.skuList = list;
                });

            }
        }
    })
    //搜索上下架
    form.on('select(findFxStatus)', function(data){
        console.log(data.value)
        if(data.value=='D'){
            vm.queryParam.skuOrderStatus ='D'
        }else if(data.value=='U'){
            vm.queryParam.skuOrderStatus ='U'
        }else{
            vm.queryParam.skuOrderStatus = null;
        }
    });
    form.on('select(findMallStatus)', function(data){
        console.log(data.value)
        if(data.value=='D'){
            vm.queryParam.skuMallStatus ='D'
        }else if(data.value=='U'){
            vm.queryParam.skuMallStatus ='U'
        }else{
            vm.queryParam.skuMallStatus = null;
        }
    });
    form.on('select(findBrand)', function(data){
        console.log(data.value)
        if(data.value != null){
            vm.queryParam.brandId =data.value;
        }
    });
    //弹窗修改上下架
    form.on('select(fxStatus)', function(data){
        console.log(data.value)
        if(data.value=='D'){
            vm.fxStatus ='D'
        }else if(data.value=='U'){
            vm.fxStatus ='U'
        }
    });
    form.on('select(mallStatus)', function(data){
        console.log(data.value)
        if(data.value=='D'){
            vm.mallStatus ='D'
        }else if(data.value=='U'){
            vm.mallStatus ='U'
        }
    });
    renderUnitDisplay();
})
