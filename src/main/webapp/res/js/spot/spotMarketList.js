/**
 * Created by junior on 2017/9/18.
 */

var vm = null;
var PAGE_SIZE = 10;
//分页
$(function() {
    var queryParam = {};
    queryParam.currentPageIndex = '1';
    layui.use(['form', 'element','tree'], function () {
        var form = layui.form();
        var element = layui.element();
        var $ = layui.jquery;
        loadSpotMarketData(queryParam);
        function querySpotMarketList(value) {
            Vue.filter("formatQuantity", function (value, length) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
                if (value != undefined) {
                    return value.toFixed(length);
                } else {
                    return "--";
                }
            });
            Vue.filter('nullValue', function (input) {
                if (input == "" || input == undefined) {
                    input = "--";
                }
                return input
            });
            Vue.filter('time', function (value, format) {
                value = value || '';
                if (value == '') {
                    return '--';
                }
                format = format || 'YYYY/MM/DD HH:mm:ss';
                return moment(value).format(format);
            });
            Vue.filter('default', function (value, defaultValue) {
                value = value || '';
                if (value == '') {
                    return defaultValue;
                }
                return value
            });
            vm = new Vue({
                el: '#querySpotMarketList',
                data: {
                    queryParam: {
                        currentPageIndex:1,
                        pageSize:10,
                        skuClassifyId: '',
                        classifyDisplayName: '',
                        skuMallClassifyId: '',
                        mallClassifyDisplayName: '',
                        skuName:''
                    },
                    treeShow: false,
                    mallTreeShow: false,
                    skuList: value.list,
                    activityList: [],
                    checkList: [],
                    skuIdList: [],
                    msg1: true,
                    spotSkuPage: true,
                    secondKillSkuPage: false

                },
                created: function () {
                    this.showData()
                    this.treeList('#fxTree', '/reusable/skuClassificatory/getAllSkuClassificatoryJsonForLayuiTree', 'skuClassifyId', 'classifyDisplayName', 'treeShow', false);
                    this.treeList('#mallTree', '/reusable/mallClassificatory/getAllMallClassificatoryJsonForLayuiTree', 'skuMallClassifyId', 'mallClassifyDisplayName', 'mallTreeShow', false);
                },
                methods: {
                    showData: function () {

                    },
                    setStatus: function (status, n, id) {
                        if (id) {
                            console.log(this.checkList)
                            for (var i = 0; i < this.activityList.length; i++) {
                                if (this.activityList[i].activityId == id) {
                                    if (status == "U") {
                                        this.activityList[i].secondKillList[n].status = "D";
                                    } else {
                                        this.activityList[i].secondKillList[n].status = "U";
                                    }
                                    if (this.checkList) {
                                        for (var m = 0; m < this.checkList.length; m++) {
                                            if (this.checkList[m].skuid == this.activityList[i].secondKillList[n].skuId) {
                                                if (status == "D") {
                                                    this.checkList[m].status = "U"
                                                }
                                                if (status == "U") {
                                                    this.checkList[m].status = "D";
                                                }
                                            }
                                        }
                                    }
                                    this.changeUpStatus(this.activityList[i].secondKillList[n].skuId, status)
                                }

                            }
                            console.log(this.checkList)

                        } else {
                            if (status == "U") {
                                this.skuList[n].status = "D";
                            } else {
                                this.skuList[n].status = "U";
                            }
                            if (this.checkList) {
                                console.log(this.checkList)
                                for (var i = 0; i < this.checkList.length; i++) {
                                    if (this.checkList[i].skuid == this.skuList[n].skuId) {
                                        if (status == "D") {
                                            this.checkList[i].status = "U"
                                            console.log(this.checkList);
                                        }
                                        if (status == "U") {
                                            this.checkList[i].status = "D"
                                        }
                                    }
                                }
                                console.log(this.checkList);
                            }
                            this.changeUpStatus(this.skuList[n].skuId, status)
                        }
                    },
                    dropDown: function (treeShow) {
                        this[treeShow] = !this[treeShow];
                    },
                    bodyClick:function () {
                        this.treeShow = false;
                    },
                    treeClick:function (treeShow) {
                        this[treeShow] = true;
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
                    },//导出
                    exportData:function () {
                        var queryParam = {};
                        queryParam.skuType = "SPOT";
                        if(this.checkList==0){
                            var skuName = vm.queryParam.skuName;
                            var skuStatus = $('#skuStatus').val();
                            var skuStore = $('#skuStore').val();
                            var mallSkuStatus = $('#mallSkuStatus').val();

                            queryParam.skuName = skuName;
                            queryParam.skuClassifyId = vm.queryParam.skuClassifyId;
                            queryParam.skuStatus = skuStatus;
                            queryParam.skuStore = skuStore;
                            queryParam.mallSkuStatus = mallSkuStatus;
                            queryParam.skuMallClassifyId = vm.queryParam.skuMallClassifyId;
                            var skuIdTemp = $("#skuId").html();
                            var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                            var skuId = '';
                            for (var i = 0; i < skuIdArray.length; i++) {
                                skuId += skuIdArray[i] + ';';
                            }
                            queryParam.skuId = skuId;
                        }else {
                            var list=[];
                            for (var i = 0; i < this.checkList.length; i++) {
                                list.push(this.checkList[i].skuid);
                            }
                            queryParam.skuId =list.join(";")
                        }
                        postUtil.submit("/sku/exportSkuExcel",queryParam, function (res) {
                            layer.msg("导出成功");
                        })
                    },//上下架
                    treeList: function (obj, url, id, name, treeShow, flg) {
                        var treeOption = {};
                        treeOption.skin = "shihuang";
                        treeOption.elem = obj;
                        var classifyId, allParentName;
                        treeOption.click = function (node) {
                            var classifyIsLeaf = node.classifyIsLeaf;
                            var isLeaf = node.isLeaf;
                            if (flg) {
                                if (classifyIsLeaf == "1" || isLeaf == "0") {
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
                            } else {
                                classifyId = node.classifyId;
                                allParentName = node.allParentName;
                                if (classifyId == "0") {
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
                    enterBtn:function (skuName) {
                        var tempParam = {};
                        tempParam.currentPageIndex = this.queryParam.currentPageIndex;
                        tempParam.pageSize = this.queryParam.pageSize;
                        tempParam.skuName = skuName;
                            $('.allChoose')[0].checked = false;
                            if (this.msg1) {
                                postUtil.call(apiUrl.querySpotMarketList, tempParam, function (pageResult) {
                                    var pageNumber = pageResult.DATA.pageNumber;
                                    var totalPage = pageResult.DATA.totalPage;
                                    var totalRow = pageResult.DATA.totalRow;
                                    laypage({
                                        cont: 'paginationDiv',
                                        pages: totalPage,
                                        curr: pageNumber,
                                        total: totalRow,
                                        skip: true,
                                        jump: function (obj, first) {
                                            if (!first) {
                                                var tempParam = {};
                                                tempParam.currentPageIndex = obj.curr;
                                                tempParam.pageSize = vm.queryParam.pageSize;
                                                tempParam.skuName = skuName;
                                                loadSpotMarketData(tempParam);
                                            }
                                        }
                                    });
                                    $('.allChoose')[0].checked = false;
                                    if (vm == null) {
                                        querySpotMarketList(pageResult.DATA);
                                    } else {
                                        vm.skuList = pageResult.DATA.list;
                                    }
                                });
                            } else {
                                postUtil.call(apiUrl.getSecondKillList, tempParam, function (pageResult) {
                                    var pageNumber = pageResult.DATA.pageNumber;
                                    var totalPage = pageResult.DATA.totalPage;
                                    var totalRow = pageResult.DATA.totalRow;
                                    laypage({
                                        cont: 'paginationDivKill',
                                        pages: totalPage,
                                        curr: pageNumber,
                                        total: totalRow,
                                        skip: true,
                                        jump: function (obj, first) {
                                            if (!first) {
                                                var tempParam = {};
                                                tempParam.currentPageIndex = obj.curr;
                                                tempParam.pageSize = vm.queryParam.pageSize;
                                                tempParam.skuName = skuName;
                                                loadSecondKillList(tempParam);
                                            }
                                        }
                                    });
                                    $('.allChoose')[0].checked = false;
                                    if (vm == null) {
                                        querySpotMarketList(pageResult.DATA);
                                    } else {
                                        vm.activityList = pageResult.DATA.list;
                                    }

                                });
                            }
                    },
                    deleteMsg2: function (n, id) {
                        var _this = this;
                        for (var i = 0; i < _this.activityList.length; i++) {
                            if (_this.activityList[i].activityId == id) {
                                var a = i;
                                if (_this.activityList[a].secondKillList.length > 1) {
                                    layer.confirm('是否从该促销活动中移除该sku？', {
                                        title: '操作提示',
                                        skin: "msgskin",
                                        area: ['480px', '260px'],
                                        btnAlign: 'c',
                                        btn: ['确定', '取消']
                                    }, function (index) {
                                        layer.close(index);
                                        for (var m = 0; m < _this.checkList.length; m++) {
                                            if (_this.checkList[m].skuid == _this.activityList[a].secondKillList[n].skuId) {
                                                _this.checkList.splice(n, 1);
                                            }
                                        }
                                        _this.render(id, _this.activityList[a].secondKillList[n].skuId);
                                        _this.activityList[a].secondKillList.splice(n, 1);
                                    }, function (index) {
                                        layer.close(index);
                                    });
                                } else {
                                    layer.confirm('是否取消该促销活动？', {
                                        title: '操作提示',
                                        skin: "msgskin",
                                        area: ['480px', '260px'],
                                        btnAlign: 'c',
                                        btn: ['确定', '取消']
                                    }, function (index) {
                                        layer.close(index);
                                        for (var m = 0; m < _this.checkList.length; m++) {
                                            if (_this.checkList[m].skuid == _this.activityList[a].secondKillList[n].skuId) {
                                                _this.checkList.splice(n, 1);
                                            }
                                        }
                                        postUtil.call('/spotMarket/cancelSecondKillActivity', {activityId: id}, function (res) {
                                            layer.msg("本活动取消成功");
                                        })
                                        _this.activityList.splice(a, 1);
//
                                    }, function (index) {
                                        layer.close(index);
                                    });
                                }
                            }
                        }
                    },
                    cancelPromotions: function (activityId, n) {
                        layer.confirm('是否取消该促销活动？', {
                            title: '操作提示',
                            skin: "msgskin",
                            area: ['480px', '260px'],
                            btnAlign: 'c',
                            btn: ['确定', '取消']
                        }, function (index) {
                            layer.close(index);
                            vm.activityList.splice(n, 1);
                            postUtil.call('/spotMarket/cancelSecondKillActivity', {activityId: activityId}, function (res) {
                                layer.msg("本活动取消成功");
                            })
                        }, function (index) {
                            layer.close(index);
                        });

                    },
                    render: function (id, skuId) {
                        console.log(skuId);
                        postUtil.call("/spotMarket/deleteSecondKillSku", {
                            activityId: id,
                            skuId: skuId
                        }, function (res) {
                            if (res.STATUS == "SUCCESS") {

                            } else {
                                alert("提交有误")
                            }
                        })
                    },
                    setPromotions:function (activityId) {
                        var param = {};
                        var skuIdList = "";
                        $.each($('input[name="selectSku"]:checked'), function (index, item) {
                            if (this.value != undefined && this.value != "") {
                                skuIdList += this.value.split("_")[0] + ",";
                            }
                        });
                        param.skuIdList = skuIdList;
                        if (activityId != null && activityId != '') {
                            param.activityId = activityId;
                        }
                        cardUtil.openCard("设置促销", "/spotMarket/skuPromotions", param);
                        cardUtil.changeCard("设置促销");
                    },
                    setAllStatus: function (status) {
                        if ($('input[name="selectSku"]:checked').length == 0) {
                            layer.msg("请选择商品", {icon: 5});
                            return false;
                        }
                        this.skuIdList = [];
                        if (this.msg1) {
                            for (var i = 0; i < this.checkList.length; i++) {
                                if (this.checkList[i].status != status) {
                                    this.checkList[i].status = status;
                                    this.skuList[this.checkList[i].num].status = status;
                                    this.skuIdList.push(this.skuList[this.checkList[i].num].skuId);
                                }
                            }
                        } else {
                            for (var i = 0; i < this.checkList.length; i++) {
                                for (var m = 0; m < this.activityList.length; m++) {
                                    for (var j = 0; j < this.activityList[m].secondKillList.length; j++) {
                                        if (this.checkList[i].skuid == this.activityList[m].secondKillList[j].skuId) {
                                            if (this.activityList[m].secondKillList[j].status != status) {
                                                this.activityList[m].secondKillList[j].status = status;
                                                this.checkList[i].status = status;
                                                this.skuIdList.push(this.checkList[i].skuid);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        console.log(this.checkList)
                        this.batchSetUpStatus(this.skuIdList, status);
                    },
                    batchSetUpStatus: function (skuIdList, status) {
                        var param = {};
                        param.skuIdList = skuIdList;
                        param.statusType = "skuOrderStatus";
                        param.statusValue = status;
                        postUtil.call("/spotMarket/batchSetUpStatus", {jsonData: JSON.stringify(param)}, function (res) {
                            if (res.STATUS == "SUCCESS") {
                                this.skuIdList = [];
                                if (status == 'U') {
                                    layer.msg("上架成功");
                                } else {
                                    layer.msg("下架成功");
                                }
                            }
                        })
                    },
                    setAllMallSkuStatus: function (status) {
                        if ($('input[name="selectSku"]:checked').length == 0) {
                            layer.msg("请选择商品", {icon: 5});
                            return false;
                        }
                        this.skuIdList = [];
                        if (this.msg1) {
                            for (var i = 0; i < this.checkList.length; i++) {
                                if (status == 'U') {//如果是商城商品上架
                                    if (this.checkList[i].status == 'U' && this.checkList[i].mallClassifyName != null && this.checkList[i].mallClassifyName != undefined &&
                                        this.checkList[i].mallClassifyName != '' && this.checkList[i].mallClassifyName != 'undefined') {//则判断订货商品是上架状态，并且商城分类不为空
                                        if (this.checkList[i].skuMallStatus != status) {
                                            this.checkList[i].skuMallStatus = status;
                                            this.skuList[this.checkList[i].num].skuMallStatus = status;
                                            this.skuIdList.push(this.skuList[this.checkList[i].num].skuId);
                                        }
                                    }
                                } else {
                                    if (this.checkList[i].skuMallStatus != status) {
                                        this.checkList[i].skuMallStatus = status;
                                        this.skuList[this.checkList[i].num].skuMallStatus = status;
                                        this.skuIdList.push(this.skuList[this.checkList[i].num].skuId);
                                    }
                                }
                            }
                        }
                        console.log(this.checkList)
                        this.batchSetUpMallStatus(this.skuIdList, status);
                    },
                    batchSetUpMallStatus: function (skuIdList, status) {
                        var param = {};
                        param.skuIdList = skuIdList;
                        param.statusType = "skuMallStatus";
                        param.statusValue = status;
                        postUtil.call("/spotMarket/batchSetUpStatus", {jsonData: JSON.stringify(param)}, function (res) {
                            if (res.STATUS == "SUCCESS") {
                                this.skuIdList = [];
                                if (status == 'U') {
                                    layer.msg("上架成功");
                                } else {
                                    layer.msg("下架成功");
                                }
                            }else {
                                layer.msg("批量更新时发生异常["+res.MSG+"]", {icon: 5});
                            }
                        })
                    }
                }
            })
        }

        function loadSpotMarketData(queryParam) {
            postUtil.call(apiUrl.querySpotMarketList, queryParam, function (pageResult) {
                var pageNumber = pageResult.DATA.pageNumber;
                var totalPage = pageResult.DATA.totalPage;
                var totalRow = pageResult.DATA.totalRow;
                laypage({
                    cont: 'paginationDiv',
                    pages: totalPage,
                    curr: pageNumber,
                    total: totalRow,
                    skip: true,
                    jump: function (obj, first) {
                        if (!first) {
                            var skuName = vm.queryParam.skuName;
                            var skuStatus = $('#skuStatus').val();
                            var skuStore = $('#skuStore').val();
                            var mallSkuStatus = $('#mallSkuStatus').val();

                            var queryParam = {};
                            queryParam.currentPageIndex = obj.curr;
                            queryParam.pageSize = PAGE_SIZE;
                            queryParam.skuName = skuName;
                            queryParam.skuClassifyId = vm.queryParam.skuClassifyId;
                            queryParam.skuStatus = skuStatus;
                            queryParam.skuStore = skuStore;
                            queryParam.mallSkuStatus = mallSkuStatus;
                            queryParam.skuMallClassifyId = vm.queryParam.skuMallClassifyId;
                            var skuIdTemp = $("#skuId").html();
                            var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                            var skuId = '';
                            for (var i = 0; i < skuIdArray.length; i++) {
                                skuId += skuIdArray[i] + ';';
                            }
                            queryParam.skuId = skuId;

                            loadSpotMarketData(queryParam);
                        }
                    }
                });
                $('.allChoose')[0].checked = false;
                if (vm == null) {
                    querySpotMarketList(pageResult.DATA);
                    vm.checkList = [];
                } else {
                    vm.skuList = pageResult.DATA.list;
                    vm.checkList = [];
                }
            });
        }

        //单选checkbox
        $(document).on('click', '.choose', function () {
            var checked = this.checked;
            //单选取消时，取消全选
            var choose = [];
            if (vm.msg1) {
                choose = $('.spotGoods .choose')
            } else {
                choose = $('.secKillGoods .choose')
            }
            var allChoose = $('.allChoose');
            var checked_num = 0;
            vm.checkList = [];
            for (var i = 0; i < choose.length; i++) {
                var skuid = choose[i].value.split("_")[0];
                var status = choose[i].value.split("_")[1];
                var mallClassifyName = choose[i].value.split("_")[2];
                if (choose[i].checked) {
                    checked_num = checked_num + 1;
                    vm.checkList.push({
                        num: i,
                        skuid: skuid,
                        status: status,
                        mallClassifyName:mallClassifyName
                    })
                }
            }
                if(vm.checkList.length==choose.length){
                    $('.allChoose')[0].checked = true;
                }else {
                    $('.allChoose')[0].checked = false;
                }
        })
        //全选checkbox
        $('.allChoose').click(function(){
            vm.checkList=[];
            var checked
                = this.checked;
            var inputs = [];
            if (vm.msg1) {
                inputs = $('.spotGoods .choose')
            } else {
                inputs = $('.secKillGoods .choose')
            }
            if (checked) {
                if (vm.msg1) {
                    $('.spotGoods tbody').css('background-color', '#FFFDF1');
                    for (var i = 0; i < inputs.length; i++) {
                        var skuid = inputs[i].value.split("_")[0];
                        var status = inputs[i].value.split("_")[1];
                        var mallClassifyName = inputs[i].value.split("_")[2];
                        inputs[i].checked = true;
                        vm.checkList.push({
                            num: i,
                            skuid: skuid,
                            status: status,
                            mallClassifyName:mallClassifyName
                        })
                    }

                } else {
                    $('.secKillGoods tbody').css('background-color', '#FFFDF1');
                    for (var i = 0; i < inputs.length; i++) {
                        var skuid = inputs[i].value.split("_")[0];
                        var status = inputs[i].value.split("_")[1];
                        var mallClassifyName = inputs[i].value.split("_")[2];
                        inputs[i].checked = true;
                        vm.checkList.push({
                            num: i,
                            skuid: skuid,
                            status: status,
                            mallClassifyName:mallClassifyName
                        })
                    }
                }
            } else {
                if (vm.msg1) {
                    $('.spotGoods tbody').css('background-color', 'transparent');
                } else {
                    $('.secKillGoods tbody').css('background-color', 'transparent');
                }
                for (var input in inputs) {
                    inputs[input].checked = false;
                    vm.checkList = [];
                }
            }
        })
        $(document).on('click', '.tab-nav li', function () {
            $(this).addClass("tab-this").siblings().removeClass("tab-this");
            var val = $(this).val();
            $('.allChoose')[0].checked = false;
            var inputs = $('.choose');
            $('.spotGoods tbody').css('background-color', 'transparent');
            $('.secKillGoods tbody').css('background-color', 'transparent');
            $('.choose').parent().parent().css('background-color', 'transparent');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
            }
            vm.queryParam.skuName="";
            $("#skuId").val("");

            var options = '<option value="0" selected="">全部</option>' +
                '<option value="U">上架</option>' +
                '<option value="D">下架</option>';
            $('#skuStatus').html(options);

            var options1 = '<option value="0" selected="">全部</option>' +
                '<option value="Y">有货</option>' +
                '<option value="N">无货</option>';

            $('#skuStore').html(options1);


            layui.form().render();

            /* vm.checkList=[];*/
            if (val == 0) {
                $('.secKillGoods').hide();
                $('.spotGoods').show();
                vm.msg1 = true;
                vm.spotSkuPage = true;
                vm.secondKillSkuPage = false;
                loadSpotMarketData();
            } else if (val == 1) {
                vm.spotSkuPage = false;
                vm.secondKillSkuPage = true;
                $('.spotGoods').hide();
                $('.secKillGoods').show();
                console.log(vm.activityList.length);
                secondKillList();
                vm.msg1 = false;
                return false;
            }
        })

        function setPromotions(activityId) {
            var param = {};
            var skuIdList = "";
            $.each($('input[name="selectSku"]:checked'), function (index, item) {
                if (this.value != undefined && this.value != "") {
                    skuIdList += this.value.split("_")[0] + ",";
                }
            });
            param.skuIdList = skuIdList;
            if (activityId != null && activityId != '') {
                param.activityId = activityId;
            }
            cardUtil.openCard("设置促销", "/spotMarket/skuPromotions", param);
            cardUtil.changeCard("设置促销");
        }

        $("#searchBtn").bind("click", function () {
            var skuName = vm.queryParam.skuName;
            var skuStatus = $('#skuStatus').val();
            var skuStore = $('#skuStore').val();
            var mallSkuStatus = $('#mallSkuStatus').val();

            var queryParam = {};
            queryParam.currentPageIndex = 1;
            queryParam.pageSize = PAGE_SIZE;
            queryParam.skuName = skuName;
            queryParam.skuClassifyId = vm.queryParam.skuClassifyId;
            queryParam.skuStatus = skuStatus;
            queryParam.skuStore = skuStore;
            queryParam.mallSkuStatus = mallSkuStatus;
            queryParam.skuMallClassifyId = vm.queryParam.skuMallClassifyId;
            var skuIdTemp = $("#skuId").html();
            var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
            var skuId = '';
            for (var i = 0; i < skuIdArray.length; i++) {
                skuId += skuIdArray[i] + ';';
            }
            queryParam.skuId = skuId;
            $('.allChoose')[0].checked = false;
            if (vm.msg1) {
                postUtil.call(apiUrl.querySpotMarketList, queryParam, function (pageResult) {
                    var pageNumber = pageResult.DATA.pageNumber;
                    var totalPage = pageResult.DATA.totalPage;
                    var totalRow = pageResult.DATA.totalRow;
                    console.log(pageResult);
                    //layer.closeAll("loading");
                    laypage({
                        cont: 'paginationDiv',
                        pages: totalPage,
                        curr: pageNumber,
                        total: totalRow,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {
                                var skuName = vm.queryParam.skuName;
                                var skuStatus = $('#skuStatus').val();
                                var skuStore = $('#skuStore').val();
                                var mallSkuStatus = $('#mallSkuStatus').val();

                                var tempParam = {};
                                tempParam.currentPageIndex = obj.curr;
                                tempParam.pageSize = PAGE_SIZE;
                                tempParam.skuName = skuName;
                                tempParam.skuClassifyId = vm.queryParam.skuClassifyId;
                                tempParam.skuStatus = skuStatus;
                                tempParam.skuStore = skuStore;
                                tempParam.mallSkuStatus = mallSkuStatus;
                                tempParam.skuMallClassifyId = vm.queryParam.skuMallClassifyId;
                                var skuIdTemp = $("#skuId").html();
                                var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                                var skuId = '';
                                for (var i = 0; i < skuIdArray.length; i++) {
                                    skuId += skuIdArray[i] + ';';
                                }
                                queryParam.skuId = skuId;
                                loadSpotMarketData(tempParam);
                            }
                        }
                    });
                    $('.allChoose')[0].checked = false;
                    if (vm == null) {
                        querySpotMarketList(pageResult.DATA);
                    } else {
//                    vm.todos=pageResult.DATA;
                        vm.skuList = pageResult.DATA.list;
                    }
                });
            } else {
                postUtil.call(apiUrl.getSecondKillList, queryParam, function (pageResult) {
                    var pageNumber = pageResult.DATA.pageNumber;
                    var totalPage = pageResult.DATA.totalPage;
                    var totalRow = pageResult.DATA.totalRow;
                    laypage({
                        cont: 'paginationDivKill',
                        pages: totalPage,
                        curr: pageNumber,
                        total: totalRow,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {
                                var tempParam = {};
                                tempParam.currentPageIndex = obj.curr;
                                tempParam.pageSize = PAGE_SIZE;
                                tempParam.skuName = skuName;
                                tempParam.skuStatus = skuStatus;
                                tempParam.skuStore = skuStore;
                                tempParam.skuClassifyId = vm.queryParam.skuClassifyId;
                                var skuIdTemp = $("#skuId").html();
                                var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                                var skuId = '';
                                for (var i = 0; i < skuIdArray.length; i++) {
                                    skuId += skuIdArray[i] + ';';
                                }
                                tempParam.skuId = skuId;
                                loadSecondKillList(tempParam);
                            }
                        }
                    });
                    $('.allChoose')[0].checked = false;
                    if (vm == null) {
                        querySpotMarketList(pageResult.DATA);
                    } else {
//                    vm.todos=pageResult.DATA;
                        vm.activityList = pageResult.DATA.list;
                    }

                });
            }
        });


        function secondKillList() {
            var skuName = vm.queryParam.skuName;
            var skuStatus = $('#skuStatus').val();
            var skuStore = $('#skuStore').val();
            var queryParam = {};
            queryParam.currentPageIndex = '1';
            postUtil.call(apiUrl.getSecondKillList, queryParam, function (pageResult) {
                var pageNumber = pageResult.DATA.pageNumber;
                var totalPage = pageResult.DATA.totalPage;
                var totalRow = pageResult.DATA.totalRow;
                laypage({
                    cont: 'paginationDivKill',
                    pages: totalPage,
                    curr: pageNumber,
                    total: totalRow,
                    skip: true,
                    jump: function (obj, first) {
                        if (!first) {
                            var tempParam = {};
                            tempParam.currentPageIndex = obj.curr;
                            tempParam.pageSize = 5;
                            tempParam.skuName = skuName;
                            tempParam.skuStatus = skuStatus;
                            tempParam.skuStore = skuStore;
                            tempParam.skuClassifyId = vm.queryParam.skuClassifyId;
                            var skuIdTemp = $("#skuId").html();
                            var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                            var skuId = '';
                            for (var i = 0; i < skuIdArray.length; i++) {
                                skuId += skuIdArray[i] + ';';
                            }
                            tempParam.skuId = skuId;
                            loadSecondKillList(tempParam);
                        }
                    }
                });
                $('.allChoose')[0].checked = false;
                if (vm == null) {
                    loadSecondKillList(pageResult.DATA);
                } else {
                    vm.activityList = pageResult.DATA.list;
                }
            });

        }

        function loadSecondKillList(queryParam) {
            postUtil.call(apiUrl.getSecondKillList, queryParam, function (pageResult) {
                var pageNumber = pageResult.DATA.pageNumber;
                var totalPage = pageResult.DATA.totalPage;
                var totalRow = pageResult.DATA.totalRow;
                //layer.closeAll("loading");
                laypage({
                    cont: 'paginationDivKill',
                    pages: totalPage,
                    curr: pageNumber,
                    total: totalRow,
                    skip: true,
                    jump: function (obj, first) {
                        if (!first) {
                            $('.allChoose')[0].checked = false;
                            var skuName = vm.queryParam.skuName;
                            var skuStatus = $('#skuStatus').val();
                            var skuStore = $('#skuStore').val();
                            var tempParam = {};
                            tempParam.currentPageIndex = obj.curr;
                            tempParam.pageSize = PAGE_SIZE;
                            tempParam.skuName = skuName;
                            tempParam.skuStatus = skuStatus;
                            tempParam.skuStore = skuStore;
                            tempParam.skuClassifyId = vm.queryParam.skuClassifyId;
                            var skuIdTemp = $("#skuId").html();
                            var skuIdArray = skuIdTemp.split(/[;；,，\n <br>&nbsp]/);
                            var skuId = '';
                            for (var i = 0; i < skuIdArray.length; i++) {
                                skuId += skuIdArray[i] + ';';
                            }
                            tempParam.skuId = skuId;
                            loadSecondKillList(tempParam);
                        }
                    }
                });
                $('.allChoose')[0].checked = false;
                if (vm == null) {
                    loadSecondKillList(pageResult.DATA);
                    vm.checkList = [];
                } else {
//                vm.todos = pageResult.DATA;
                    vm.activityList = pageResult.DATA.list;
                    vm.checkList = [];
                }
            });
        }


        function goEdit(skuId) {
            cardUtil.openCard("修改商品-" + skuId, "/sku/goEdit?skuId=" + skuId);
            cardUtil.changeCard("修改商品-" + skuId);
        }

        function goCopy(skuId) {
            cardUtil.openCard("复制商品", "/sku/goCopy?skuId=" + skuId);
            cardUtil.changeCard("复制商品");
        }
    })
})