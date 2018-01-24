/*
 @copyright:rwang
 @email:172247097@qq.com
 @date:2014-08-02
 */

(function ($) {

    $.fn.extend({
        MSDL: function (options) {/*MultiSelectDropList*/
            //各种属性参数

            var defaults = {
                width: '150',//下拉列表宽
                maxheight: '180',//下拉列表最大高度
                // data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'],//下拉列表中的数据
                selectallTxt: '全部',//全选文本
                selectokTxt: 'ok',//确认文本
                id: "allTheValue"
            };
            var options = $.extend(defaults, options);

            return this.each(function () {

                //插件实现代码
                //创建 input输入框
                //readonly:锁住键盘，不能向文本框输入内容
                var $ipt = $('<input type="text" readonly id=\"' + options.id + '\" class="select_rel" />');//id="allTheValue"通过这个id取值
                var $ipt_hidden = $('<input type="hidden"  id=\"' + options.id + "_" + "hidden" + '\" class="select_rel" />');
                $ipt.width(options.width - 8);//设定文本框宽度

                var $this = $(this);
                $this.width(options.width);
                $ipt.appendTo($this);
                $ipt_hidden.appendTo($this);

                //创建 下拉选项

                //1.下拉选项包裹
                var $container = $('<div class="container" id="container"></div>');


                //2.创建 全选和确认按钮  top层
                var $top = $('<div class="top"></div>');//外层div包裹
                var $all = $('<input type="checkbox" class="select_all"/><label class="labelChoose">' + options.selectallTxt + '</label>');//全选
                var $btn = $('<button class="ok">' + options.selectokTxt + '</button>');
                $all.appendTo($top);
                // $btn.appendTo($top);

                //3.下拉中的内容 content层
                var $content = $('<div class="content"></div>');//外层div包裹
                var count = options.data.length;
                var h = ( (count * 22) > parseInt(options.maxheight) ) ? options.maxheight : "'" + count * 22 + "'";
                $content.height(h);
                for (var i = count - 1; i >= 0; i--) {
                    var $list = $('<div class="divChoose"><input type="checkbox" value=' + options.data[i].value + ' /><label class="labelChoose">' + options.data[i].text + '</label><br></div>');
                    $list.appendTo($content);
                }
                //4把top层和content层加到$container下
                $top.appendTo($container);
                $content.appendTo($container);

                //把$container加到$(this)下
                $container.appendTo($this);

                $("body").click(function (e) {
                    if ($(e.target).attr('id') != "container" && $(e.target).attr('id') != options.id) {
                        if (((e.target).type != null) && ((e.target).type == "checkbox")) {
                            return;
                        }

                        if ((e.target).className != null && ((e.target).className == "labelChoose" || (e.target).className == "divChoose" || (e.target).className == "top")) {
                            return;
                        }
                        $container.addClass('hidden');
                        $ipt.removeClass("select_rel_visited");
                    }
                });


                //js Effect
                var $dropList = $content.children().children('input');

                var $divList = $('.divChoose');

//			$divList.click(function (e){//
//				 var opt_arr = [];
//				 if (e.target.childNodes[0].checked==null||e.target.childNodes[0].checked==false){
//					 e.target.childNodes[0].checked=true;
//					 }else{
//						 e.target.childNodes[0].checked=false;
//					 }
//				 $divList.each(function (){
//				   if ($(this).children('input').is(':checked'))  {
//					   opt_arr.push($(this).children('input').val());
//						if($ipt.val().indexOf($(this).children('input').val())!=-1){
//							 return;
//						 }
//						$ipt.val(opt_arr.join(';'));
//				   }else{
//					   if(opt_arr.indexOf($(this).children('input').val())!=-1){
//						   opt_arr.splice(opt_arr.indexOf($(this).children('input').val()),1);
//						   $ipt.val(opt_arr.join(';'));
//					   }
//					   }
//				   
//				 });
//				 var $dropList_selected = $content.children().children('input:checked');
//
//				 
//				 var o = $all[0];
//				 var n1 = $dropList_selected.length;
//				 var n2 = $divList.length;
//				 o.checked = (n1 === n2) ? 'checked' : '';
//			});

                $all.change(function () {//点击all

                    var opt_arr = [];
                    var optText_arr = [];
                    $dropList.each(function () {
                        if ($all.is(':checked')) {
                            $(this)[0].checked = 'checked';
                            opt_arr.push($(this).val());
                            optText_arr.push($(this).parent().find("label").text());
                        } else {
                            $(this)[0].checked = '';
                            opt_arr = [];
                            optText_arr = [];
                        }
                    });

                    $ipt.val(optText_arr.join(';'));
                    $ipt_hidden.val(opt_arr.join(';'));
                });

                $container.addClass('hidden');//开始隐藏
                $ipt.removeClass("select_rel_visited");
                $ipt.focus(function () {//文本框处于编辑
                    $container.removeClass('hidden');
                    $ipt.addClass("select_rel_visited");
//				$this.addClass('multi_select_focus');
                });

                $btn.click(function () {//点击 ok按钮
                    $container.addClass('hidden');
                    $ipt.removeClass("select_rel_visited");
//				$this.removeClass('multi_select_focus');
                    return false;
                });


                $dropList.change(function () {//勾选选项
                    var opt_arr = [];
                    var optText_arr = [];
                    $dropList.each(function () {
                        if ($(this).is(':checked')) {
                            opt_arr.push($(this).val());
                            optText_arr.push($(this).parent().find("label").text());
                        } else {
                            if (opt_arr.indexOf($(this).val()) != -1) {
                                opt_arr.splice(opt_arr.indexOf($(this).val()), 1);
                                optText_arr.splice(optText_arr.indexOf($(this).parent().find("label").text()), 1);
                            }
                        }

                    });
                    var $dropList_selected = $content.children().children('input:checked');
                    if ($ipt.val().indexOf($(this).val()) != -1 && $(this).is(':checked')) {
                        return;
                    }
                    $ipt.val(optText_arr.join(';'));
                    $ipt_hidden.val(opt_arr.join(';'));
                    var o = $all[0];
                    var n1 = $dropList_selected.length;
                    var n2 = $dropList.length;
                    o.checked = (n1 === n2) ? 'checked' : '';
                });
            });
        },
    });
})(jQuery);