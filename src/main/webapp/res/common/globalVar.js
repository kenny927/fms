//定义ajax请求url地址
window.apiUrl = {
    queryBannerList : "/api/banner/listAll",				//查询首页banner
    queryMallClassifyList : "/api/mallClassify/listAll",	//查询首页分类数据
    queryPromotionHomePage : "/api/promotion/homePage",		//查询首页促销楼层数据
    queryDistributionList : "/api/distributionService/list",//查询首页分销楼层信息
    queryProductHomePage : "/api/product/homePage",			//查询首页产品楼层信息
    submitRequirement : "/api/customer/require",			//提交采购需求
    searchClassify : "/api/product/classify/search",		//二级页面查询分类信息
    searchProperty : "/api/product/property/search",		//二级页面查询属性
    searchProduct : "/api/product/search",					//二级页面查询商品列表
    getProductBaseInfo : "/api/product/detail/baseInfo",	//商品详情页查询商品基本信息
    getProductImageInfo : "/api/product/detail/imageInfo",	//商品详情页查询商品图片信息
    getProductDescInfo : "/api/product/detail/descInfo",	//商品详情页查询商品介绍信息
    switchProperty : "/api/product/detail/switchProperty",	//商品详情页切换属性查询对应商品
    saveRequirement : "/api/customer/require",	            //创建采购需求
    queryMallOrderListOfPlatform : "/mallOrder/api/list",	            //加载订单列表
    queryMallOrderListOfDistributor : "/mallOrder/api/distributor/list",	            //加载订单列表
    queryMallOrderDetail : "/mallOrder/api/detail",	            //加载订单详情
    queryMallOrderContractUploadLog: "mallOrder/api/queryMallOrderContractUploadLog",	            //加载订单合同附件
    countMallOrderContractUploadLog : "/mallOrder/countMallOrderContractUploadLog",	            //订单附件个数
    deleteMallOrderContractUploadLog : "/mallOrder/api/deleteMallOrderContractUploadLog",	            //删除订单附件
    createMallOrderContractUploadLog : "/mallOrder/api/createMallOrderContractUploadLog",	            //上传订单附件
    queryBuyerEnquireDetail : "/mallOrder/buyerEnquireService/getBuyerEnquireDetail", //查询询价单详情
    getVagueDemandDetail : "/mallOrder/vagueDemand/getVagueDemandDetail",              //查询委托单详情
    closeBuyerEnquire : "/mallOrder/buyerEnquireService/closeBuyerEnquire",            //关闭询价单
    queryBuyerEnquireList : "/mallOrder/buyerEnquireService/queryBuyerEnquireList",            //查询询价单列表
    updateBuyerEnquire : "/mallOrder/buyerEnquireService/update", //更新询价单列表
    querySpotMarketList : "/spotMarket/getSpotMarketList", //查询现货商品列表
    getSecondKillList : "/spotMarket/getSecondKillList", //查询现货商品列表
    querySpotDetail : "/spotMarket/querySpotDetail", //查询现货商品列表
    inquiryOrderHistorydetail:"mallOrder/api/inquiryOrderHistory/detail"　//查询询价单历史记录
}

