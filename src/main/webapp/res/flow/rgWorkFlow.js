/**
 * Created by roger on 2017/3/23.
 */
/**
 * 流程跳转
 * */
function openFinishTaskTab(taskId, busniessKey){
	var url = "/task/redirectPage?taskId=" + taskId + "&busniessKey=" + busniessKey;
	cardUtil.refreshCard("审核详情-" + busniessKey, url);
	cardUtil.openCard("审核详情-" + busniessKey, url);
	cardUtil.changeCard("审核详情-" + busniessKey);

    //changeCard   openCard  refreshCard
	//postUtil.submit("/task/redirectPage",{taskId:taskId,busniessKey:busniessKey}, "_blank");
}