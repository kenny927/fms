/**
 * Created by roger on 2017/9/13.
 */
/** Example
 var opt = {
            layerTitle:"选择客户经理",
            layerArea:['1000px', '650px'],
            dialogDef:{
                searchCondition:[
                    {
                        title:'真实姓名',
                        placeholder:'',
                        type:'input',
                        name:'userRealName'
                    },{
                        title:'岗位名称',
                        placeholder:'',
                        type:'select',
                        name:'departmentName',
                        options:[
                            {code:'客户运营',name:'客户运营'},
                            {code:'2',name:'2'},
                            {code:'3',name:'3'}
                        ]
                    }
                ],
                dataHeaders:[
                    {
                        itemTitle:'姓名',
                        width:200
                    },{
                        itemTitle:'手机号',
                        width:200
                    },{
                        itemTitle:'邮箱',
                        width:250
                    },{
                        itemTitle:'岗位',
                        width:200
                    }
                ],
                dataRowsDef:[
                    {name:'userRealName'},
                    {name:'mobile'},
                    {name:'email'},
                    {name:'departmentName'}
                ]
            }
        };
 var chooseAccountManagerDialog = new ChooseUserComponent(opt);
 chooseAccountManagerDialog.openDialog();

 说明：动态列可选范围参见　
      自定义查询需设置searchUrl
 * */
var ChooseUserDefalutConfig = {
    layerTitle:'请选择员工',
    layerArea:['1000px', '650px'],
    layerUrl:'/reusable/user/chooseUserPage/v1',
    searchUrl:'/reusable/user/userJsonData',
    searchParam:{'mainObjectId':'10002'},
    searchConditionStyle:'width:160px'
}

var currentChooseUserComponent;

var ChooseUserComponent = function(opt){
    this.options = $.extend(true,{}, ChooseUserDefalutConfig, opt);
    if(opt.dialogDef.searchCondition){
        for(var i=0; i<opt.dialogDef.searchCondition.length; i++){
            var item = opt.dialogDef.searchCondition[i];
            if(!item.style){
                this.options.dialogDef.searchCondition[i].style=ChooseUserDefalutConfig.searchConditionStyle;
            }
        }
    }

    var _options = this.options;
    _init();

    function _init(){
        if(!opt){
            console.warn("控件由于传入初始化参数！");
        }
    }

    this.openDialog = function(){
        currentChooseUserComponent = this;
        parent.currentChooseUserComponent = this;
        this.openLayerMsg();
    }

    this.openLayerMsg =function () {
        if(!layer){
            console.error("layer未初始化！");
            return;
        }
        _options.layer.open({
            title: _options.layerTitle,
            type: 2,
            zIndex: layer.zIndex,
            area: _options.layerArea,
            fixed: false, //不固定
            maxmin: true,
            content: [_options.layerUrl,'no'],
            success: function(layero){
                _options.layer.setTop(layero); //重点2
            },
            success: function(layero, index){
                console.log(layero, index);
            }
        });
    }
}

ChooseUserComponent.getExitsVariable = function (variableName, variableName1) {
    try {
        if (typeof (variableName) == "undefined") {
            return variableName1;
        } else if (variableName == null){
            return variableName1;
        }else {
            return variableName;
        }
    } catch (e) {
    }
    return variableName;
}