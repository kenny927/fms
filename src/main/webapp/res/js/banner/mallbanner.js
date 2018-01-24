/**
 * Created by roger on 2017/1/13.
 */
layui.use('upload', function() {
    //设置图片
    layui.upload({
        elem: '#attam_file',
        title: '添加图片',
        skin: 'upload',
        url: '/file_server/images/uploadForAjax', //上传接口
        before: function (input) {
            // //返回的参数item，即为当前的input DOM对象
            // console.log('文件上传中');
        },
        success: function (res) { //上传成功后的回调
            if (res.STATUS == "SUCCESS") {
                addNewImages(res.data);
            } else {
                layer.msg(jsonData.MSG);
            }
        }
    });
});
$(function () {
    // $("#attam_file").fileinput({
    //     language: 'zh', //设置语言
    //     //uploadUrl: url, //上传的地址
    //     showPreview: false,
    //     showUpload: false, //是否显示上传按钮
    //     showRemove: false,
    //     browseClass: "btn btn-primary" //按钮样式
    // });
    //showImageBox();
    function Pointer(x, y) {
        this.x = x;
        this.y = y;
    }

    function Position(left, top) {
        this.left = left;
        this.top = top;
    }

    $(".item_content_sku .banner_item").each(function (i) {
        this.init = function () { // 初始化
            this.box = $(this).parent();
            $(this).attr("index", i).css({
                position: "absolute",
                left: this.box.offset().left,
                top: this.box.offset().top
            }).appendTo(".item_content_sku");
            this.drag();
        },
            this.move = function (callback) {  // 移动
                $(this).stop(true).animate({
                    left: this.box.offset().left,
                    top: this.box.offset().top
                }, 500, function () {
                    if (callback) {
                        callback.call(this);
                    }
                });
            },
            this.collisionCheck = function () {
                var currentItem = this;
                var direction = null;
                $(this).siblings(".banner_item").each(function () {
                    if (
                        currentItem.pointer.x > this.box.offset().left &&
                        currentItem.pointer.y > this.box.offset().top &&
                        (currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
                        (currentItem.pointer.y < this.box.offset().top + this.box.height())
                    ) {
                        // 返回对象和方向
                        if (currentItem.box.offset().top < this.box.offset().top) {
                            direction = "down";
                        } else if (currentItem.box.offset().top > this.box.offset().top) {
                            direction = "up";
                        } else {
                            direction = "normal";
                        }
                        this.swap(currentItem, direction);
                    }
                });
            },
            this.swap = function (currentItem, direction) { // 交换位置
                if (this.moveing) return false;
                var directions = {
                    normal: function () {
                        var saveBox = this.box;
                        this.box = currentItem.box;
                        currentItem.box = saveBox;
                        this.move();
                        $(this).attr("index", this.box.index());
                        $(currentItem).attr("index", currentItem.box.index());
                    },
                    down: function () {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = currentItem.box.index();
                        var endIndex = node.box.index();
                        ;
                        for (var i = endIndex; i > startIndex; i--) {
                            var prevNode = $(".item_content_sku .banner_item[index=" + (i - 1) + "]")[0];
                            node.box = prevNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = prevNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    },
                    up: function () {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = node.box.index();
                        var endIndex = currentItem.box.index();
                        ;
                        for (var i = startIndex; i < endIndex; i++) {
                            var nextNode = $(".item_content_sku .banner_item[index=" + (i + 1) + "]")[0];
                            node.box = nextNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = nextNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    }
                }
                directions[direction].call(this);
            },
            this.drag = function () { // 拖拽
                var oldPosition = new Position();
                var oldPointer = new Pointer();
                var isDrag = false;
                var currentItem = null;
                $(this).mousedown(function (e) {
                    e.preventDefault();
                    oldPosition.left = $(this).position().left;
                    oldPosition.top = $(this).position().top;
                    oldPointer.x = e.clientX;
                    oldPointer.y = e.clientY;
                    isDrag = true;

                    currentItem = this;

                });
                $(document).mousemove(function (e) {
                    var currentPointer = new Pointer(e.clientX, e.clientY);
                    if (!isDrag) return false;
                    $(currentItem).css({
                        "opacity": "0.8",
                        "z-index": 999
                    });
                    var left = currentPointer.x - oldPointer.x + oldPosition.left;
                    var top = currentPointer.y - oldPointer.y + oldPosition.top;
                    $(currentItem).css({
                        left: left,
                        top: top
                    });
                    currentItem.pointer = currentPointer;
                    // 开始交换位置


                    currentItem.collisionCheck();


                });
                $(document).mouseup(function () {
                    if (!isDrag) return false;
                    isDrag = false;
                    currentItem.move(function () {
                        $(this).css({
                            "opacity": "1",
                            "z-index": 0
                        });
                    });
                });
            }
        this.init();
    });
});


function doUploadBannerIamge(isMain) {
    var jsonpara = {};
    var url = '';
    var uploadObj = $(document.getElementById("attam_file"));
    if (uploadObj) {
        var file = uploadObj[0];
        if (file.value == null || file.value == "") {
            layer.msg("提示：请先选择文件再上传");
            return;
        }
    }
    url = '/file_server/images/uploadForAjax';
    $.ajaxFileUpload({
        url: url,
        secureuri: false,
        fileElementId: "attam_file",
        data: jsonpara,
        dataType: 'text',
        success: function (data) {
            var jsonData = JSON.parse(data);
            if (jsonData.STATUS == "SUCCESS") {
                addNewImages(data);
            } else {
                layer.msg(jsonData.MSG);
            }
        },
        error: function (data, status, e) {
            layer.msg(data);
        }
    })
}

function doSortBannerIamge() {
    var jsonData = {};
    var sortData = [];
    $(".item_content_sku .banner_item").each(function (i) {
        var oneData = {};
        oneData.bannerId = $(this).attr("bannerid");
        oneData.bannerSort = $(this).attr("index");
        sortData[i] = oneData;
    });
    jsonData.data = JSON.stringify(sortData);
    postUtil.call("/mall/banner/sortBanners", jsonData, function (result) {
        if (result.STATUS == "SUCCESS") {
            layer.msg("排序成功");
            window.location.href = "/mall/banner/list";
        } else {
            layer.msg(result.MSG);
        }
    });
}

function addNewImages(data) {
    var jsonData = {};
    jsonData.data = data;
    postUtil.call("/mall/banner/addBanners", {data:JSON.stringify(data)}, function (result) {
        if (result.STATUS == "SUCCESS") {
            layer.msg("添加成功");
            window.location.href = "/mall/banner/list";
        } else {
            layer.msg(result.MSG);
        }
    });
}

function deleteBanner(bannerId) {
    var jsonData = {};
    jsonData.bannerId = bannerId;
    layer.confirm('确定保删除该图片?', {
        btn: ['确定', '取消']
    }, function(index, layero){
        postUtil.call("/mall/banner/deleteBanners", jsonData, function (result) {
            if (result.STATUS == "SUCCESS") {
                layer.msg("删除成功");
                window.location.href = "/mall/banner/list";
            } else {
                layer.msg(result.MSG);
            }
        });
    }, function(index){
        layer.close(index);
    });
}

function openMarkBanner(bannerId){
    postUtil.call("/mall/banner/queryById", {bannerId:bannerId}, function (result) {
        if (result.STATUS == "SUCCESS") {
            if(result.data) {
                layer.open({
                    title:"备注信息",
                    type: 2,
                    area: ['600px', '250px'],
                    fixed: false, //不固定
                    maxmin: true,
                    content: '/mall/banner/remarkPopup',
                    success: function(layero, index){
                        var body = layer.getChildFrame('body', index);
                        // var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        // console.log(body.html()) //得到iframe页的body内容
                        // body.find('input').val('Hi，我是从父页来的');
                        body.find('input[name="bannerId"]').val(bannerId);
                        body.find('input[name="bannerDescribe"]').val(result.data.bannerDescribe);
                        body.find('input[name="bannerPicDestination"]').val(result.data.bannerPicDestination);
                    }
                });
            }
        } else {
            layer.msg(result.MSG);
        }
    });
}

