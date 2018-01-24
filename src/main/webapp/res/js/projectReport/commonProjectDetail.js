/**
 * Created by roger on 2017/4/25.
 */
$(function(){
    layui.use(['form','laydate'], function() {
        form = layui.form();
        $form = $('form');

        form.on('radio(secrecyOpt)', function(data){
            if(data.value=="OPEN_TO_SOMEAREA"){
                $('.ms-choice').attr("disabled",false);
            }else{
                $('.ms-choice').attr("disabled",true);
                $('#secrecyArea').multipleSelect("uncheckAll");
            }
            $('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").hide();
            $('.ms-choice').removeClass("bor-ff");
        });

        setTimeout('form.render()',1000);
    });
});

var areaData = Area;
$(function(){

    var proHtml = '';
    var secrecyArea = '';
    for(var i = 0; i < areaData.length; i++) {
        proHtml += '<option value="' + areaData[i].provinceName;
        if(secrecyArea.indexOf(areaData[i].provinceName)>-1){
            proHtml+='" selected >';
        }else{
            proHtml+= '">' ;
        }
        proHtml+=areaData[i].provinceName + '</option>';
    }
    $('#secrecyArea').html(proHtml);
    $('#secrecyArea').change(function() {
        if($('input[name=secrecyOpt]:checked').val()=='OPEN_TO_SOMEAREA'){
            if($(this).val().length!=0){
                $('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").hide();
                $('.ms-choice').removeClass("bor-ff");
            }else{
                $('input[name=secrecyOpt]:checked').parent().parent().find(".jun-wrong-msg.c-f").show();
                $('.ms-choice').addClass("bor-ff");
            }
        }
    }).multipleSelect({
        width: '200px',
        selectAllText:'全部',
        allSelected:'全部',
        countSelected:''
    });

    // if(secrecyOpt!='OPEN_TO_SOMEAREA'){
        $('.ms-choice').attr("disabled",true);
    // }
});