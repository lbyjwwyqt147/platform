var Utils = {
    "serverAddress" : "http://127.0.0.1:18080/api/v1/",
    "credential" : "",
    "systemCode" : "10",
    "saveSuccessMsg" : "保存数据成功!",
    "saveFailMsg" : "保存数据失败!",
    "delFailMsg" : "删除数据失败!",
    "errorMsg" : "网络连接失败!",

    /**
     * 清空文本框前后空格
     */
    inputTrim : function(){
        $("input").each(function(){
            $(this).val($.trim($(this).val()))
        });
        $("textarea").each(function(){
            $(this).val($.trim($(this).val()))
        });
    },

    /**
     * modal 中显示加载提示
     * @param modalId
     */
    modalBlock : function (modalId, message) {
        var msg =  message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.block($.trim(modalId) + ' .modal-content', {
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * modal 中关闭加载提示
     * @param modalId
     */
    modalUnblock: function (modalId) {
        mApp.unblock($.trim(modalId)  + ' .modal-content');
    },

    /**
     * 整个页面 中显示加载提示信息
     * @param modalId
     */
    pageMsgBlock : function (message) {
        var msg =  message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * 整个页面 中显示加载提示
     * @param modalId
     */
    htmPageBlock : function () {
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg'
        });
    },

    /**
     * 整个页面中 中关闭加载提示
     * @param modalId
     */
    htmPageUnblock: function () {
        mApp.unblockPage();
    }


}