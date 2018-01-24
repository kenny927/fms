/**
 * Created by sirius on 2017/4/26.
 */
var StringUtils = {
    isEmpty: function (target) {
        if (null == target) {
            return true;
        }
        if (StringUtils.trim(target) == "") {
            return true;
        } else {
            return false;
        }
    },
    trim: function (target) {
        return target.replace(/(^\s*)|(\s*$)/g, "");
    },
    ltrim: function (target) {
        return target.replace(/(^\s*)/g, "");
    },
    rtrim: function (target) {
        return target.replace(/(\s*$)/g, "");
    }
}