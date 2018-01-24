/**
 * Created by hevenzheng on 2017/3/9.
 */
$(function () {
    layui.use(['form', 'tree','layer','layedit'], function () {
        //加载获取数据
        var layer = layui.layer;
        var form = layui.form();
        var $ = layui.jquery;
        var layedit = layui.layedit;
        var editIndex = layedit.build('LAY_demo_editor');
        $form = $($('.form-css')[0]);

        //过滤器
        Vue.filter('nullValue', function (input) {
            if (input == "" || input == undefined) {
                input ="-";
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
            el: "#editSku",
            data: {
                queryParam: {
                    skuType:'',
                    classifyId: '',
                    mallClassifyId: '',
                    classifyName: '',
                    mallClassifyName: '',
                    skuName:'',
                    propertyList:[],
                    purchasePriceList:[],
                    basePrice:'',
                    spotPrice:'',
                    brandName:'长飞',
                    unitName:'千米',
                    directoryPrice:'',
                    skuOrderStatus:'D',
                    spotMallPrice:'',
                    skuMallStatus:'D'
                },
                isNew:'N',
                mallUp:true,
                propertyNames:[],
                type:type,
                storages:[],
                currentSkuStorageDetaiData:[],
                skuId:skuId,
                treeShowMallEdit: false,
                treeShowEdit: false,
                priceShow:true,
                storagesShow:false,
                goodStatus:true,
                goodDetail:false
            },
            created: function () {
                if(this.type!='INSERT'){
                    this.showData();
                }else {
                    this.skuBrand("");
                    this.skuUnit("");
                }
                this.treeList('#fxTreeEdit', '/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree', 'classifyId', 'classifyName', 'treeShowEdit');
                this.treeList('#mallTreeEdit', '/reusable/mallClassificatory/getAllMallClassificatoryJsonForLayuiTree', 'mallClassifyId', 'mallClassifyName', 'treeShowMallEdit');
            },
            computed: {
                mallUp:function () {
                    if(this.queryParam.skuType == 'SPOT'){
                       return false;
                    }else {
                        return true;
                    }
                }
            },
            methods: {
                showData:function () {
                    postUtil.call("/sku/detail",{skuId: this.skuId}, function (res) {
                        if(res.STATUS == "SUCCESS") {
                            var data = res.data;
                            console.log(data);
                            vm.queryParam = data;
                            if(!vm.queryParam.directoryPrice){
                                vm.queryParam.directoryPrice=0;
                            }
                            if(vm.type!='UPDATE'){
                                vm.queryParam.skuId="";
                                vm.queryParam.skuType="";
                            }
                            vm.skuBrand(vm.queryParam.brandId);
                            vm.skuUnit(vm.queryParam.unitId);
                            if(vm.type=='UPDATE'&&vm.queryParam.skuType == 'SPOT'){
                                vm.skuStorage();
                            }
                            rendPage(data);
                            vm.mallStatus();
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                    });

                },
                mallStatus:function () {
                    if(this.queryParam.skuType == 'SPOT'){//现货商品如下逻辑：订货系统上架&&商品有商城分类
                        if(this.queryParam.skuMallStatus == 'D' || vm.queryParam.mallClassifyId == undefined ||
                            vm.queryParam.mallClassifyId == null || vm.queryParam.mallClassifyId == ''){
                            var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架" disabled>';
                            html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked disabled>';
                            vm.$nextTick(function () {
                                $('#mallStatus').html("");
                                $('#mallStatus').html(html);
                                form.render();
                            })
                        }
                    }
                },
                skuBrand:function (brandId) {
                    postUtil.call('/reusable/skuBrand/allBrandJsonData', null, function (result) {
                        var opts;
                        for(var i=0;i<result.length;i++){
                            if(brandId==result[i].brandId){
                                opts += " <option value= '" + result[i].brandId +'_'+ result[i].brandChineseName +"' selected='' >" + result[i].brandChineseName + "</option>";
                                vm.queryParam.brandName = result[i].brandChineseName;
                            }else {
                                opts += " <option value= '" + result[i].brandId +'_'+ result[i].brandChineseName +"' >" + result[i].brandChineseName + "</option>";
                            }
                        }
                        if(vm.type=='INSERT'){
                            $form.find('select[name=brand]').find('option').eq(0).removeAttr("selected").html("").val("");
                            vm.queryParam.brandName = '';
                        }
                        if(brandId=='1005'){
                            $form.find('select[name=brand]').find('option').remove();
                        }else {
                            $form.find('select[name=brand]').find('option').eq(0).siblings().remove();
                        }

                        $form.find('select[name=brand]').append(opts);
                        form.render();
                    });
                },
                skuUnit:function (unitId) {
                    postUtil.call('/reusable/skuUnit/skuUnitJsonData', null, function (result) {
                        var opts;
                        for(var i=0;i<result.length;i++){
                            if(unitId==result[i].unitId){
                                opts += " <option value= '" + result[i].unitId +'_'+ result[i].unitName+"' selected='' >" + result[i].unitName + "</option>";
                            }else {
                                opts += " <option value= '" + result[i].unitId +'_'+ result[i].unitName+"' >" + result[i].unitName + "</option>";
                            }
                        }
                        if(vm.type=='INSERT'){
                            $form.find('select[name=skuUnit]').find('option').eq(0).removeAttr("selected").html("").val("");
                        }
                        if(unitId=='1007'){
                            $form.find('select[name=skuUnit]').find('option').remove();
                        }else{
                            $form.find('select[name=skuUnit]').find('option').eq(0).siblings().remove();
                        }
                        $form.find('select[name=skuUnit]').append(opts);
                        form.render();
                    });
                },
                skuStorage:function () {
                    var queryParam = {};
                    queryParam.pageSize = 30;
                    queryParam.currentPageIndex = 1;
                    queryParam.skuId = this.skuId;
                    queryParam.salableStatus = 'ALL';
                    postUtil.call("/skuStorage/listJson",queryParam, function (res) {
                        vm.storages = res.list;
                        if(res.list[0].currentSkuStorageDetaiData){
                            vm.currentSkuStorageDetaiData = res.list[0].currentSkuStorageDetaiData;
                        }
                        //若未维护库存，库存个项值默认为零
                        // $.each(vm.storages,function (index,item) {
                        //     if(item.accountName){item.accountName=0;}else if(item.city){item.city=0}else
                        //     if(item.salableQuantity){item.salableQuantity=0;}else if(item.stockQuantity){item.stockQuantity=0}else
                        //     if(item.salableQuantity){item.salableQuantity=0;}else if(item.orderPreholdingQuantity){item.orderPreholdingQuantity=0}else
                        //     if(item.deliveryPreholdingQuantity){item.deliveryPreholdingQuantity=0;}else if(item.deliveryPreholdingQuantity){item.deliveryPreholdingQuantity=0}else
                        //     if(item.deliveryPreholdingQuantity){item.deliveryPreholdingQuantity=0;}else if(item.unitName){item.unitName=0}
                        //
                        // })
                    });
                },
                dropDown: function (treeShow) {
                    this[treeShow] = !this[treeShow];
                },
                bodyClick:function () {
                    this.treeShowEdit = false;
                    this.treeShowMallEdit = false;
                },
                treeClick:function (treeShow) {
                    this[treeShow] = true;
                },
                deletePropertyList: function (n) {
                    this.queryParam.propertyList.splice(n, 1);
                },
                addPropertyList:function () {
                    if(this.queryParam.propertyList==undefined) {
                        this.queryParam.propertyList = new Array;
                    }
                    this.queryParam.propertyList.push({
                        propertyName: "",
                        propertyValue: ""
                    });
                },//分类树
                deletePurchasePriceList: function (n) {
                	if(this.queryParam.purchasePriceList[n].isDefaultVendor =='Y'){
                		layer.msg("不能移除默认供应商!");
                	}else{
                		this.queryParam.purchasePriceList.splice(n, 1);
                	}
                    
                },
                turnTotrue:function(n,id){
                	for(var i=0;i<this.queryParam.purchasePriceList.length;i++){
                		if(i==n){
                			this.queryParam.purchasePriceList[i].isDefaultVendor ='Y';
                		}else{
                			this.queryParam.purchasePriceList[i].isDefaultVendor ='N';
                		}
                	}
                },
                addPurchasePriceList:function(){
                    if(this.queryParam.purchasePriceList==undefined) {
                        this.queryParam.purchasePriceList = new Array;
                    }
                    
                	layer
					.open({
						title : "选择供应商",
						type : 2,
						area : [
								'600px',
								'460px' ],
						btnAlign : 'c',
						skin : 'msgskin',
						content :'/sku/preAddPurchasePriceWindow?skuId='+skuId,
						btn : [
								'确认',
								'取消' ],
						yes : function(
								index,
								layero) {
							var body = layer
									.getChildFrame(
											'body',
											index);
							var iframeWin = window[layero
									.find('iframe')[0]['name']];// 获得iframe的窗口对象
							
							var childrens= body
									.find(
											'input[type=checkbox][name=primary]:checked');
							var repeat = checkRepeat(childrens,vm.queryParam.purchasePriceList);
							if(!repeat){
								for(var i=0;i<childrens.length;i++){
									var param2 = {};
									param2.vendorName = childrens[i].getAttribute("accountName");
									param2.purchasePrice = "";
									param2.isDefaultVendor = "N";
									param2.vendorCode = childrens[i].value;
									vm.queryParam.purchasePriceList.push(param2);
								}
								layer.close(index);// 关闭弹窗
							}else{
								layer.msg("不允许重复添加供应商",{icon:5});
							}


						},
						btn2 : function(
								index,
								layero) {
							layer.close(index);// 关闭弹窗
							// 取消的回调

						},
						});
                },
                treeList: function (obj, url, id, name, treeShow) {
                    var treeOption = {};
                    treeOption.skin = "shihuang";
                    treeOption.elem = obj;
                    var classifyId, allParentName;
                    treeOption.click = function (node) {
                        var classifyIsLeaf = node.classifyIsLeaf;
                        var isLeaf = node.isLeaf;
                        if (classifyIsLeaf == "1"||isLeaf=="1") {
                            classifyId = node.classifyId;
                            allParentName = node.allParentName;
                            if (classifyId == "0") {
                                allParentName = "全部";
                            }
                            vm.queryParam[id] = classifyId;
                            vm.queryParam[name] = allParentName;
                            vm[treeShow] = false;
                            if(id == "mallClassifyId" && vm.queryParam.skuType == 'SPOT'){
                                if(vm.queryParam.skuOrderStatus == 'U' && classifyId != undefined && classifyId != null && classifyId != ''){
                                    vm.queryParam.skuMallStatus = 'D';
                                    var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架">';
                                    html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked>';
                                    vm.$nextTick(function () {
                                        $('#mallStatus').html("");
                                        $('#mallStatus').html(html);
                                        form.render();
                                    })
                                }
                            }
                        } else {
                            layer.msg("请选择叶子节点", {"icon": "5"});
                        }
                    };
                    postUtil.call(url, null, function (result) {
                        treeOption.nodes = result;
                        layui.tree(treeOption);
                    });
                },//校验
                validate:function () {
                    var isPass = true;
                    var msg = "";
                    var errorCount=0;
                    if(this.type!='UPDATE') {
                        if($.trim(this.queryParam.skuId) == ""){
                            errorCount++;
                            msg += "<"+errorCount+">商品SKU编码不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }
                    if(this.queryParam.skuType == ""){
                        errorCount++;
                        msg += "<"+errorCount+">商品类型不能为空";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    if($.trim(this.queryParam.skuName) == ""){
                        errorCount++;
                        msg += "<"+errorCount+">商品名称不能为空";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    if($.trim(this.queryParam.model) == ""){
                        errorCount++;
                        msg += "<"+errorCount+">商品型号不能为空";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    if(this.type=='INSERT'){
                        if($.trim(this.queryParam.brandId) == ""){
                            errorCount++;
                            msg += "<"+errorCount+">商品品牌不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                        if($.trim(this.queryParam.unitId) == ""){
                            errorCount++;
                            msg += "<"+errorCount+">计量单位不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                        if($.trim(this.queryParam.classifyId) == ""){
                            errorCount++;
                            msg += "<"+errorCount+">内部分类不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }
                    var minNumMsg = "";
                    var minNumPass = true;
                    if($.trim(this.queryParam.minNum) == ""){
                        minNumMsg += "起订量不能为空;";
                        minNumPass = false;
                    } else if (isNaN($.trim(this.queryParam.minNum))) {
                        minNumMsg += '起订量必须为数字;';
                        minNumPass = false;
                    } else {
                        if(parseFloat($.trim(this.queryParam.minNum))<0) {
                            minNumMsg += '起订量必须为正数;';
                            minNumPass = false;
                        }
                    }
                    if(!minNumPass) {
                        errorCount++;
                        msg += "<"+errorCount+">"+minNumMsg;
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    if(this.queryParam.propertyList.length<=0){
                        errorCount++;
                        msg += "<"+errorCount+">至少有一条属性";
                        if(errorCount%3==0){
                            msg+="</br>";
                        }
                        isPass = false;
                    }
                    //检查属性
                    vm.propertyNames=[];
                    $.each(this.queryParam.propertyList, function (index, item) {
                        if (item.propertyName=="") {
                            errorCount++;
                            msg += "<"+errorCount+">属性名称不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }else {
                            if(vm.propertyNames.indexOf(item.propertyName)==-1){
                                vm.propertyNames.push(item.propertyName);
                            }else {
                                errorCount++;
                                msg += "<"+errorCount+">属性名重复";
                                if(errorCount%3==0){
                                    msg+="</br>";
                                }
                                isPass = false;
                            }

                        }
                        if (item.propertyValue=="") {
                            errorCount++;
                            msg += "<"+errorCount+">属性值不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }

                    });

                    if(this.type == 'INSERT'){
                        if(this.queryParam.skuOrderStatus == ""){
                            errorCount++;
                            msg += "<"+errorCount+">订货系统商品状态不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                        if(this.queryParam.skuMallStatus == ""&&this.queryParam.skuType=='NORMAL'){
                            errorCount++;
                            msg += "<"+errorCount+">商城商品状态不能为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }
                    // 1、若选择上架订货系统-订货商品，必填字段如下：
                    // 1.1、订货价,1.2、采购价(不可维护)
                    if(this.queryParam.skuType=='NORMAL'&&this.queryParam.skuOrderStatus=='U'){
                        if (!this.queryParam.basePrice||this.queryParam.basePrice<0) {
                            errorCount++;
                            msg += "<"+errorCount+">订货价不可为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }  //若选择上架订货系统-现货商品，必填字段如下: 2.1、现货价 1.2、采购价(不可维护) 2.3、原价（划线价）
                        //校验采购价
                        if(this.queryParam.purchasePriceList.length<=0){
                            errorCount++;
                            msg += "<"+errorCount+">订货商品上架至订货系统时至少有一条采购价";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }else if(this.queryParam.skuType=='SPOT'&&this.queryParam.skuOrderStatus=='U') {
                        if (!this.queryParam.spotPrice||this.queryParam.spotPrice<0) {
                            errorCount++;
                            msg += "<"+errorCount+">现货价不可为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                        if (!this.queryParam.basePrice||this.queryParam.basePrice<0) {
                            errorCount++;
                            msg += "<"+errorCount+">原价不可为空";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                        //校验采购价
                        if(this.queryParam.purchasePriceList.length<=0){
                            errorCount++;
                            msg += "<"+errorCount+">订货商品上架至订货系统时至少有一条采购价";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }
                    
                    //检查采购价
                    if(this.queryParam.purchasePriceList.length>0){
                    	var isDefaultVendors ="";
                        $.each(this.queryParam.purchasePriceList, function (index, item) {
                        	isDefaultVendors+=item.isDefaultVendor;
                            if(isNaN(item.purchasePrice)){
                                    errorCount++;
                                    msg += "<"+errorCount+">采购价必须为数字";
                                    if(errorCount%3==0){
                                        msg+="</br>";
                                    }
                                    isPass = false;

                            }else if(!(item.purchasePrice>0)||item.purchasePrice==""){
                                errorCount++;
                                msg += "<"+errorCount+">采购价必须大于0";
                                if(errorCount%3==0){
                                    msg+="</br>";
                                }
                                isPass = false;

                        }

                        });
                        
                        if(isDefaultVendors.indexOf("Y")==-1){
                            errorCount++;
                            msg += "<"+errorCount+">采购价必须设置一个默认供应商";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                        }
                    }
                    
                    //商城只能非现货上架
                    if(this.queryParam.skuType=='NORMAL'&&this.queryParam.skuMallStatus=='U'){
                    	if(this.queryParam.mallClassifyId==""||this.queryParam.mallClassifyId==null){
                            errorCount++;
                            msg += "<"+errorCount+">商品上架至商城时必须维护商城分类!";
                            if(errorCount%3==0){
                                msg+="</br>";
                            }
                            isPass = false;
                    	}
                    }
                    
                    return {isPass:isPass,msg:msg};
                }
            }
        })
        //基本信息保存
        form.on('submit(goodBaseMsg)', function(data){
            var result = vm.validate();
            if(!result.isPass) {
                layer.open({
                    title: '数据填写有误',
                    icon: 5,
                    skin: 'youskin',
                    area: ['550px', '300px'],
                    btnAlign: 'c',
                    content: result.msg,
                    btn: ['我知道了'],
                    yes: function(index1, layero){
                        layer.close(index1);
                    },
                    cancel: function(){
                        //右上角关闭回调
                    }
                });
            }else{
                    var  param = {};
                    param.saveMode = "BASE";
                    param.skuType = vm.queryParam.skuType;
                    param.skuId = vm.queryParam.skuId;
                    param.model = vm.queryParam.model;
                    param.skuName = vm.queryParam.skuName;
                    param.classifyId = vm.queryParam.classifyId;
                    param.brandId = vm.queryParam.brandId;
                    param.unitId = vm.queryParam.unitId;
                    param.mallClassifyId = vm.queryParam.mallClassifyId;
                    param.minNum = vm.queryParam.minNum;
                    param.propertyList = vm.queryParam.propertyList;
                    param.purchasePriceList = vm.queryParam.purchasePriceList;
                    if(vm.queryParam.skuType == 'SPOT'){
                        param.spotPrice = vm.queryParam.spotPrice;
                    }
                    param.basePrice = vm.queryParam.basePrice;
                    param.skuOrderStatus = vm.queryParam.skuOrderStatus;
                    param.skuMallStatus = vm.queryParam.skuMallStatus;
					param.directoryPrice = vm.queryParam.directoryPrice;
                if(vm.type == 'UPDATE') {
                    postUtil.call("/sku/update", {jsonData: JSON.stringify(param)}, function (res) {
                        layer.load();
                        if (res.STATUS == "SUCCESS") {
                            layer.msg("基本信息保存成功", {icon: 6});
                        } else {
                            layer.msg(res.MSG, {icon: 5});
                        }
                        layer.closeAll("loading");
                    });
                }else if(vm.type == 'COPY'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/copy",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("基本信息保存成功", {icon:6});
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });

                }else if(vm.type == 'INSERT'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/add",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("基本信息保存成功", {icon:6});
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });
                }
            }
        })
        //类型修改
        form.on('radio(goodType)', function(data){
            vm.queryParam.skuType=data.value;
            vm.queryParam.skuMallStatus='D';
            if(data.value=='SPOT'){
                if(vm.queryParam.skuOrderStatus == 'D' || vm.queryParam.mallClassifyId == undefined
                    || vm.queryParam.mallClassifyId == null || vm.queryParam.mallClassifyId ==''){
                    var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架" disabled>';
                    html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked disabled>';
                    vm.$nextTick(function () {
                        $('#mallStatus').html("");
                        $('#mallStatus').html(html);
                        form.render();
                    })
                }
            }else{
                var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架">';
                html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked>';
                vm.$nextTick(function () {
                    $('#mallStatus').html("");
                    $('#mallStatus').html(html);
                    form.render();
                })
            }
        });
        //订货上下架
        form.on('radio(fxStatus)', function(data){
            vm.queryParam.skuOrderStatus=data.value;
            if(vm.queryParam.skuType == 'SPOT'){//现货商品如下逻辑：订货系统上架&&商品有商城分类
                if(data.value == 'D'){
                    vm.queryParam.skuMallStatus = 'D';
                    var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架" disabled>';
                    html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked disabled>';
                    vm.$nextTick(function () {
                        $('#mallStatus').html("");
                        $('#mallStatus').html(html);
                        form.render();
                    })
                }else if(data.value == 'U' && vm.queryParam.mallClassifyId != undefined) {
                    vm.queryParam.skuMallStatus = 'D';
                    var html = '<input type="radio" name="mallStatus" value="U"  lay-filter="mallStatus"  title="上架">';
                    html += '<input type="radio" name="mallStatus" value="D"  lay-filter="mallStatus" title="下架" checked>';
                    vm.$nextTick(function () {
                        $('#mallStatus').html("");
                        $('#mallStatus').html(html);
                        form.render();
                    })
                }
            }else{
                vm.queryParam.skuOrderStatus=data.value;
            }
        });
        //商城上下架
        form.on('radio(mallStatus)', function(data){
            vm.queryParam.skuMallStatus=data.value;
        });
        //品牌修改
        form.on('select(brand)', function(data){
            var str = data.value.split("_");
            vm.queryParam.brandId = str[0];
            vm.queryParam.brandName = str[1];
        });
        //計量單位修改
        form.on('select(skuUnit)', function(data){
            var str = data.value.split("_");
            vm.queryParam.unitId = str[0];
            vm.queryParam.unitName = str[1];
        });
        //商品详情页
        form.on('submit(goodDetail)', function(data){
            var isPass = true;
            var msg = "";
            var errorCount=0;
            //校验图片商品详情页
            if($(".img-list li").length > 5) {
                errorCount++;
                msg += "<"+errorCount+">最多只能上传5张图片";
                if(errorCount%3==0){
                    msg+="</br>";
                }
                isPass = false;
            }

            if($(".img-list li").length > 0) {
                if($('input[name="isMain"]:checked').length == 0) {
                    errorCount++;
                    msg += "<"+errorCount+">请选择一个图片作为主图";
                    if(errorCount%3==0){
                        msg+="</br>";
                    }
                    isPass = false;
                }
            }
            if(!isPass){
                layer.open({
                    title: '数据填写有误',
                    icon: 5,
                    skin: 'youskin',
                    area: ['550px', '300px'],
                    btnAlign: 'c',
                    content: msg,
                    btn: ['我知道了'],
                    yes: function(index1, layero){
                        layer.close(index1);
                    },
                    cancel: function(){
                        //右上角关闭回调
                    }
                });
            }else {
                var param = detailData();
                param.skuId = vm.queryParam.skuId;
                param.saveMode = "DETAIL";
                if(vm.type == 'UPDATE') {
                    postUtil.call("/sku/update", {jsonData: JSON.stringify(param)}, function (res) {
                        layer.load();
                        if (res.STATUS == "SUCCESS") {
                            layer.msg("保存详情页成功", {icon: 6});
                        } else {
                            layer.msg(res.MSG, {icon: 5});
                        }
                        layer.closeAll("loading");
                    });
                }else if(vm.type == 'COPY'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/copy",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("保存详情页成功", {icon:6});
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });

                }else if(vm.type == 'INSERT'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/add",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("保存详情页成功", {icon:6});
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });
                }
            }
        })
        //全部
        form.on('submit(wholeMsg)', function(data){
            var result = vm.validate();
            if($(".img-list li").length > 5) {
                errorCount++;
                result.msg += "<"+errorCount+">最多只能上传5张图片";
                if(errorCount%3==0){
                    result.msg+="</br>";
                }
                isPass = false;
            }

            if($(".img-list li").length > 0) {
                if($('input[name="isMain"]:checked').length == 0) {
                    errorCount++;
                    result.msg += "<"+errorCount+">请选择一个图片作为主图";
                    if(errorCount%3==0){
                        result.msg+="</br>";
                    }
                    isPass = false;
                }
            }
            if(!result.isPass) {
                layer.open({
                    title: '数据填写有误',
                    icon: 5,
                    skin: 'youskin',
                    area: ['550px', '300px'],
                    btnAlign: 'c',
                    content: result.msg,
                    btn: ['我知道了'],
                    yes: function(index1, layero){
                        layer.close(index1);
                    },
                    cancel: function(){
                        //右上角关闭回调
                    }
                });
            }else{
                var  param = detailData();
                param.saveMode = "ALL";
                param.skuType = vm.queryParam.skuType;
                param.skuId = vm.queryParam.skuId;
                param.model = vm.queryParam.model;
                param.skuName = vm.queryParam.skuName;
                param.classifyId = vm.queryParam.classifyId;
                param.brandId = vm.queryParam.brandId;
                param.unitId = vm.queryParam.unitId;
                param.mallClassifyId = vm.queryParam.mallClassifyId;
                param.minNum = vm.queryParam.minNum;
                param.propertyList = vm.queryParam.propertyList;
                param.purchasePriceList = vm.queryParam.purchasePriceList;
                if(vm.queryParam.skuType == 'SPOT'){
                    param.spotPrice = vm.queryParam.spotPrice;
                }
                param.basePrice = vm.queryParam.basePrice;
                param.spotMallPrice = vm.queryParam.spotMallPrice;
                param.skuOrderStatus = vm.queryParam.skuOrderStatus;
                param.skuMallStatus = vm.queryParam.skuMallStatus;
                param.directoryPrice = vm.queryParam.directoryPrice;
                if(vm.type == 'UPDATE') {
                    postUtil.call("/sku/update", {jsonData: JSON.stringify(param)}, function (res) {
                        layer.load();
                        if (res.STATUS == "SUCCESS") {
                            layer.msg("保存全部成功", {icon: 6});
                            cardUtil.refreshCard("商品列表");
                            cardUtil.refreshCard("现货SKU列表");
                            cardUtil.closeCard("修改商品-"+vm.queryParam.skuId);
                        } else {
                            layer.msg(res.MSG, {icon: 5});
                        }
                        layer.closeAll("loading");
                    });
                }else if(vm.type == 'COPY'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/copy",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("保存全部成功", {icon:6});
                            cardUtil.refreshCard("商品列表");
                            cardUtil.refreshCard("现货SKU列表");
                            cardUtil.closeCard("复制商品");
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });

                }else if(vm.type == 'INSERT'){
                    param.isNew = vm.isNew;
                    postUtil.call("/sku/add",{jsonData:JSON.stringify(param)}, function (res) {
                        layer.load();
                        if(res.STATUS == "SUCCESS") {
                            vm.isNew = 'Y';
                            layer.msg("保存全部成功", {icon:6});
                            cardUtil.refreshCard("商品列表");
                            cardUtil.refreshCard("现货SKU列表");
                            cardUtil.closeCard("新增商品");
                        } else {
                            layer.msg(res.MSG, {icon:5});
                        }
                        layer.closeAll("loading");
                    });
                }
            }
        })
        //预览
        form.on('submit(previewMsg)', function(data){
            var  param = detailData();
            param.skuType = vm.queryParam.skuType;
            param.skuId = vm.queryParam.skuId;
            param.model = vm.queryParam.model;
            param.skuName = vm.queryParam.skuName;
            param.classifyId = vm.queryParam.classifyId;
            param.brandId = vm.queryParam.brandId;
            param.brandName = vm.queryParam.brandName;
            param.unitId = vm.queryParam.unitId;
            param.unitName= vm.queryParam.unitName;
            param.mallClassifyId = vm.queryParam.mallClassifyId;
            param.minNum = vm.queryParam.minNum;
            param.propertyList = vm.queryParam.propertyList;
            param.purchasePriceList = vm.queryParam.purchasePriceList;

            param.directoryPrice = vm.queryParam.directoryPrice;
            if(vm.queryParam.skuType == 'SPOT'){
                param.spotPrice = vm.queryParam.spotPrice;
            }
            param.basePrice = vm.queryParam.basePrice;
            param.spotMallPrice = vm.queryParam.spotMallPrice;
            param.skuOrderStatus = vm.queryParam.skuOrderStatus;
            param.skuMallStatus = vm.queryParam.skuMallStatus;
            cardUtil.openCard("预览商品-" + param.skuId,"/sku/preview", {jsonData:JSON.stringify(param)});
            cardUtil.changeCard("预览商品-" + param.skuId);
        })
        renderUnitDisplay();
    })

    //加载获取数据
    // postUtil.call("/sku/detail",{skuId: skuId}, function (res) {
    //     if(res.STATUS == "SUCCESS") {
    //         var data = res.data;
    //         rendPage(data);
    //     } else {
    //         layer.msg(res.MSG, {icon:5});
    //     }
    //     layer.closeAll("loading");
    // });
});
var hasSpu = false;
function rendPage(data) {
    if(data.spuSkuList && data.spuSkuList.length > 0) {
        hasSpu = true;
    }


    //设置基本值
    $("#skuId").text(skuId);
    $("#skuType").val(data.skuType);

    $("#skuName").val(data.skuName);
    $("#model").val(data.model);
    $("#skuClassifyId").val(data.classifyId);
    $("#brandId").val(data.brandId);
    var html = "";
    if(hasSpu && !isCopy) {
        html += '  '+data.classifyName+'';
        $("#classifySelect").removeClass().addClass("mt10");
        $("#classifySelect").empty();
        $("#classifySelect").html(html);
        var brandHtml = '<input type="hidden" id="brandId" value="'+data.brandId+'"><p>'+data.brandName+'</p>';
        $("#brandSelect").removeClass().addClass("mt10");
        $("#brandSelect").attr("style", "width:400px;");
        $("#brandSelect").empty();
        $("#brandSelect").html(brandHtml);
    } else {
        $("#skuClassifyName").val(data.classifyName);
    }



    $("#unitId").val(data.unitId);
    // $("#unitName").val(data.unitName);
    $('span[name="unitName"]').text(data.unitName);
    var unitName = data.unitName;
    $("#minNum").val(parseFloat(data.minnum).toFixed(2));
    $("#minNum").attr("unitName", this.value);
    //渲染单位控制小数位数
    renderUnitDisplay();
    // if(data.status == "Y") {
    //     $("[name='skuStatus']:eq(0)").click();
    //     $("[name='upStatus']:eq(2)").click();
    // } else if(data.status == "N") {
    //     $("[name='skuStatus']:eq(1)").click();
    //     $("[name='upStatus']:eq(2)").click();
    //     $("[name='upStatus']:eq(0)").attr("disabled","disabled");
    //     $("[name='upStatus']:eq(1)").attr("disabled","disabled");
    // }

    if(data.status == "U") {
        $("[name='upStatus']:eq(0)").click();
    } else if(data.status == "D") {
        $("[name='upStatus']:eq(1)").click();
    }

    if(data.basePrice != "") {
        $("#basePrice").val(parseFloat(data.basePrice).toFixed(2));
    }

    if(data.directoryPrice != "") {
        $("#directoryPrice").val(parseFloat(data.directoryPrice).toFixed(2));
    }

    if(data.skuType == "SPOT") {
        $("#spotPriceDisplay").show();
        if(data.spotPrice != "" && !isNaN(data.spotPrice)) {
            $("#spotPrice").val(parseFloat(data.spotPrice).toFixed(2));
        }
    } else {
        $("#spotPriceDisplay").hide();
    }




    //设置属性
    html = "";
    $.each(data.propertyList, function (index, item) {
        rowNum++;
        html+='<li id="property_'+rowNum+'">';
        if(!hasSpu || isCopy) {
            html+='<input class="flt" type="text" name="propertyName" value="'+item.propertyName+'" placeholder="请输入属性名">';
        } else {
            html+='<input class="flt" type="text" name="propertyName" value="'+item.propertyName+'" readonly="readonly">';
        }
        html+='<input class="flt" style="width: 33%;" name="propertyValue" value="'+item.propertyValue+'" type="text" placeholder="请输入属性值">';
        if(!hasSpu || isCopy) {
            html+='<p style="text-align: center;line-height: 45px;"><a href="javascript:removeProperty('+rowNum+');">移除</a></p>';
        }
        html+='</li>';
    });
    $("#propertyList").append(html);
    if(!hasSpu) {
        $("#addPropertyLink").html('<a href="javascript:addProperty();" class="addAttribute fz14">+添加属性</a>');
    }


    //设置SPU

    if(data.spuSkuList && data.spuSkuList.length > 0) {
        var spuSku = data.spuSkuList[0];
        var spuId = spuSku.spuId;
        html = "";
        html +='<dt class="mt10"><span class="c-f">*</span>商品SPU编码：</dt>';
        html +='<dd class="mt10">'+spuId+'</dd>';
        html +='   <dd class="mt10">';
        html +='   <div class="layui-form" style="margin-left: 120px;">';
        html +='   <table class="layui-table pop" >';
        html +='    <colgroup>';
        html +='   <col width="100">';
        html +='   <col width="450">';
        html +='    <col width="350">';
        html +='   <col width="100">';
        html +='   <col>';
        html +='   </colgroup>';
        html +='   <thead>';
        html +='  <tr>';
        html +='  <th>SKU编码</th>';
        html +='  <th>商品名称</th>';
        html +='   <th>聚合属性</th>';
        html +='   <th>操作</th>';
        html +='   </tr>';
        html +='   </thead>';
        html +='   <tbody>';
        $.each(data.spuSkuList, function (index, item) {
            if(item.skuId == skuId) {
                html +='   <tr id="spuSkuList_'+index+'" style="height: 50px;background-color: #fafad2;">';
            } else {
                html +='   <tr id="spuSkuList_'+index+'" style="height: 50px;">';
            }
            html +='   <td>'+item.skuId+'</td>';
            html +='  <td>'+item.skuName+'</td>';
            html +='<td>'+item.skuPolymerizePropertyValues+'</td>';
            if(item.skuId == skuId) {
                html +=' <td><a class="c-h" href="javascript:removeFromSpu();">从该SPU脱离</a></td>';
            } else {
                html +=' <td></td>';
            }
            html +='   </tr>';

        });
        html +='   </tbody>';
        html +='   </table>';
        html +='   </div>';
        html +='  </dd>';
        $("#spuSkuList").html(html);
    }

    //设置采购价
    html = "";
    $.each(data.purchasePriceList, function (index, item) {
        purchaseNum++;
        html += '<tr id="purchase_'+purchaseNum+'">';
        html +=  '<td><input type="text" name="vendorName" value="'+item.vendorName+'" readonly="readonly" lay-verify="title" autocomplete="off" placeholder="点击选择供应商" class="layui-input"></td>';
        html +=  '<input type="hidden" name="vendorId" value="'+item.vendorCode+'">';
        html +=  '   <td><label>';
        if(item.isDefaultVendor == "Y") {
            html +=  '   <span class="pay_list_c3 mt5 ml10 on"><input type="radio" name="default"  class="radioclass" checked="checked"/></span>设为默认供应商</label></td>';
        } else {
            html +=  '   <span class="pay_list_c3 mt5 ml10"><input type="radio" name="default"  class="radioclass" /></span>设为默认供应商</label></td>';
        }
        var price = ""
        if(item.purchasePrice != "") {
            price = parseFloat(item.purchasePrice).toFixed(2);
        }
        html +=  '  <td><input type="text" name="purchasePrice" value="'+price+'" lay-verify="title" autocomplete="off" placeholder="请输入数字" oninput="filterQty(event,0);" class="layui-input wid0 inline"><span class="inline">元/<span name="unitName">'+unitName+'</span></span></td>';
        html +=  '   <td><a class="c-h" href="javascript:removePurchase('+purchaseNum+');">移除</a></td>';
        html +=  '   </tr>';
    });
    $("#purchasePriceList").append(html);

    //设置详情
    if(data.describeEffective == "Y") {
        descEditor.html(data.describe);
    } else {
        $("[name='describeEffective']:eq(1)").click();
    }

    if(data.qaEffective == "Y") {
        qaEditor.html(data.qa);
    } else {
        $("[name='qaEffective']:eq(1)").click();
    }

    if(data.purchaseEffective == "Y") {
        purchaseEditor.html(data.purchase);
    } else {
        $("[name='purchaseEffective']:eq(1)").click();
    }

    if(data.afterSaleEffective == "Y") {
        afterSaleEditor.html(data.afterSale);
    } else {
        $("[name='afterSaleEffective']:eq(1)").click();
    }

    if(data.downloadEffective == "Y") {
        if(data.download) {
            downloadContent = data.download;
            var downloadArr = JSON.parse(data.download);
            html = "";
            if(downloadArr && downloadArr.length > 0) {
                $.each(downloadArr, function (index, item) {
                    html += '  <dd>';
                    html += '  <span style="flex:1;">'+item.MALL_FILE_ATTACHMENT_ID+'</span>';
                    html += ' <span style="flex:2;">'+item.MALL_FILE_NAME+'</span>';
                    html += ' <span style="flex:1;"><a href="javascript:void(0);" onclick="downLoadMallAttachment(\'' + item.MALL_FILE_ATTACHMENT_ID + '\')" class="c-h">下载</a></span>';
                    html += '  </dd>';
                });
                $("#downloadContent dd").remove();
                $("#downloadContent").append(html);
            }
        }
    } else {
        $("[name='downloadEffective']:eq(1)").click();
    }

    //设置图片
    html = "";
    $.each(data.images, function (index,item) {
        html += '<li>';
        html += '<img class="skuImg" src="'+item.origUrl+'" style="width:100px;height: 100px;">';
        html += '<div class="delImg jun-del" style="position:absolute;top:-12px;left:92px;cursor:pointer;display: none;" ><img src="/res/images/del.png" alt=""></div>';
        // html += ' <label class="delImg" style="top:0px;left:90px;cursor: pointer;">X</label>';
        html += '<input type="hidden" name="origUrl" value="'+item.origUrl+'">';
        html += '<input type="hidden" name="thumbUrl" value="'+item.thumbUrl+'">';
        if(item.isMainImage == 1) {
            html += ' <label><span class="pay_list_c2 on"><input type="radio" name="isMain"  class="radioclass" checked="checked"/></span>设为主图</label>';
        } else {
            html += ' <label><span class="pay_list_c2"><input type="radio" name="isMain"  class="radioclass" /></span>设为主图</label>';
        }
        html += ' </li>';
    });
    $(".img-list").append(html);
}

function removeFromSpu() {
    postUtil.call("/sku/removeFromSpu",{skuId:skuId}, function (res) {
        if(res.STATUS == "SUCCESS") {
            layer.msg("从该SPU脱离成功",{icon:6})
            postUtil.submit("/sku/goEdit", {skuId:skuId});
        } else {
            layer.msg("从该SPU脱离失败",{icon:5})
        }
    })
}

function detailData() {
    //商品描述
    var param={};
    param.describeEffective = $('input[name="describeEffective"]:checked').val();
    if(param.describeEffective == "Y") {
        param.describe = descEditor.html();
    }

    //商品问答
    param.qaEffective = $('input[name="qaEffective"]:checked').val();
    if(param.qaEffective == "Y") {
        param.qa = qaEditor.html();
    }

    //采购说明
    param.purchaseEffective = $('input[name="purchaseEffective"]:checked').val();
    if(param.purchaseEffective == "Y") {
        param.purchase = purchaseEditor.html();
    }

    //售后保障
    param.afterSaleEffective = $('input[name="afterSaleEffective"]:checked').val();
    if(param.afterSaleEffective == "Y") {
        param.afterSale = afterSaleEditor.html();
    }

    //相关下载
    param.downloadEffective = $('input[name="downloadEffective"]:checked').val();
    if(param.downloadEffective == "Y") {
        param.download = downloadContent;
    }

    var images = [];
    //图片
    $.each($(".img-list li"), function (index, item) {
        var image = {};
        image.origUrl = $(this).find('input[name="origUrl"]').val();
        image.thumbUrl = $(this).find('input[name="thumbUrl"]').val();
        image.isMain = $(this).find('input[name="isMain"]').is(":checked");
        images.push(image);
    })
    param.images = images;

    return param;
}
$(document).on('click','.goodDetails',function () {
    if($(this).parent().next().css('display')=='none'){
        $(this).parent().next().show();
        $(this).html("收起")
    }else{
        $(this).parent().next().hide();
        $(this).html("展开")
    }
})


function checkRepeat(childrens,list){
	if(list==null||list.length==0){
		return false;
	}else{
		for(var i=0;i<childrens.length;i++){
			var vendorCode = childrens[i].value;
			for(var k=0;k<list.length;k++){
				var vendorCodeTemp = list[k].vendorCode;
				if(vendorCode==vendorCodeTemp){
					return true;
				}
			}

		}
	}
	
	return false;
};