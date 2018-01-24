/**
 * Created by Administrator on 2017/6/1.
 */

//添加自定义商品
$(document).on('click','.diyAddGoods',function () {
    var html="";
    html+='<tr class="diy-input">';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入商品名称" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入商品型号" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入品牌" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入数量" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入计量单位" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入商品描述" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入商品报价" class="layui-input"></td>';
    html+='<td><input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入报价小计" class="layui-input"></td>';
    html+='<td><a href="javascript:;" class="deleteGood">删除</a></td>';
    html+='</tr>';
    $("#diyAddGoods").find("tbody").append(html);
})

//删除当前行
$(document).on('click','.deleteGood',function () {
   $(this).parent().parent().remove();
})