/**
 * Created by sirius on 2017/3/28.
 */
var cardUtil = {
    openCard: function (title, url, param) {
        var id = null;
        var flag = parent.getTitleId("card", title);
        if (flag != -1) {
            id = flag;
        } else {
            id = new Date().getTime();
            var content = '<iframe id="iframe_'+id+'" src="' + url + '" frameborder="0"></iframe>';
            if(param) {
                content = '<iframe id="iframe_'+id+'" src="" frameborder="0"></iframe>';
            }
            parent.element.tabAdd('card', {
                title: '<span>' + title + '</span>',
                content: content,
                id: id
            });
        }
        if(param) {
            parent.postData(title, url, param);
        }
        //parent.element.tabChange("card", id);
    },
    refreshCard: function (title, url) {
        parent.refreshCard(title, url);
    },
    changeCard: function (title) {
        var id = parent.getTitleId("card", title);
        if(id == -1) {
            return;
        }
        parent.element.tabChange("card", id);
    },
    closeCard: function (title) {
        var id = parent.getTitleId("card", title);
        if(id == -1) {
            return;
        }
        parent.element.tabDelete("card", id);
    }
};