//== Class Definition
var SnippetIndex = function() {

    /**
     * 菜单点击事件
     */
    var initMenuEvent = function () {

    }

    /**
     * 初始化 Tab
     */
    var initTab = function () {
        layui.use('element', function(){
            var $ = layui.jquery
                ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

            //触发事件
            var active = {
                tabAdd: function(othis){
                    var index = othis.data('index'), title = othis.data('title'), content = othis.data('url');
                    var flag = true;
                    $(".layui-tab-title li").each(function () {
                        var layId = $(this).attr("lay-id");
                        if (index == layId) {
                            //切换到指定Tab项
                            element.tabChange('menu_tab', layId);
                            flag = false;
                        }
                    })
                    //新增一个Tab项
                    if (flag) {
                        element.tabAdd('menu_tab', {
                            title:  title
                            ,content:  '<object type="text/html" data="'+content+'" width="100%" height="100%"></object>'
                            ,id:  index
                        });
                        element.tabChange('menu_tab', index);
                    }

                }
                ,tabDelete: function(othis){
                    //删除指定Tab项
                    element.tabDelete('menu_tab', '44');
                }
                ,tabChange: function(){
                    //切换到指定Tab项
                    element.tabChange('menu_tab', '22');
                }
            };

            $('.m-menu__link').on('click', function(){
                var othis = $(this), type = othis.data('type') ;
                active[type] ? active[type].call(this, othis) : '';
            });

           /* $(".layui-icon,layui-unselect,layui-tab-close").on('click', function () {
                var layId = $(this).parent("li").attr("lay-id");
                console.log(layId);
                return false;
            });*/
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initMenuEvent();
           initTab();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetIndex.init();
});