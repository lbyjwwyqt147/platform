//== Class Definition
var SnippetDict = function() {

    var setting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: false
        }
    };

    var zNodes =[
        {id:1, pId:0, name:"[core] 基本功能 演示", open:true},
        {id:101, pId:1, name:"最简单的树 --  标准 JSON 数据"},
        {id:102, pId:1, name:"最简单的树 --  简单 JSON 数据"},
        {id:103, pId:1, name:"不显示 连接线"},
        {id:104, pId:1, name:"不显示 节点 图标"},
        {id:108, pId:1, name:"异步加载 节点数据"},
        {id:109, pId:1, name:"用 zTree 方法 异步加载 节点数据"},
        {id:110, pId:1, name:"用 zTree 方法 更新 节点数据"},
        {id:111, pId:1, name:"单击 节点 控制"},
        {id:112, pId:1, name:"展开 / 折叠 父节点 控制"},
        {id:113, pId:1, name:"根据 参数 查找 节点"},
        {id:114, pId:1, name:"其他 鼠标 事件监听"},

        {id:2, pId:0, name:"[excheck] 复/单选框功能 演示", open:false},
        {id:201, pId:2, name:"Checkbox 勾选操作"},
        {id:206, pId:2, name:"Checkbox nocheck 演示"},
        {id:207, pId:2, name:"Checkbox chkDisabled 演示"},
        {id:208, pId:2, name:"Checkbox halfCheck 演示"},
        {id:202, pId:2, name:"Checkbox 勾选统计"},
        {id:203, pId:2, name:"用 zTree 方法 勾选 Checkbox"},
        {id:204, pId:2, name:"Radio 勾选操作"},
        {id:209, pId:2, name:"Radio nocheck 演示"},
        {id:210, pId:2, name:"Radio chkDisabled 演示"},
        {id:211, pId:2, name:"Radio halfCheck 演示"},
        {id:205, pId:2, name:"用 zTree 方法 勾选 Radio"},

        {id:3, pId:0, name:"[exedit] 编辑功能 演示", open:false},
        {id:301, pId:3, name:"拖拽 节点 基本控制"},
        {id:302, pId:3, name:"拖拽 节点 高级控制"},
        {id:303, pId:3, name:"用 zTree 方法 移动 / 复制 节点"},
        {id:304, pId:3, name:"基本 增 / 删 / 改 节点"},
        {id:305, pId:3, name:"高级 增 / 删 / 改 节点"},
        {id:306, pId:3, name:"用 zTree 方法 增 / 删 / 改 节点"},
        {id:307, pId:3, name:"异步加载 & 编辑功能 共存"},
        {id:308, pId:3, name:"多棵树之间 的 数据交互"},

        {id:4, pId:0, name:"大数据量 演示", open:false},
        {id:401, pId:4, name:"一次性加载大数据量"},
        {id:402, pId:4, name:"分批异步加载大数据量"},
        {id:403, pId:4, name:"分批异步加载大数据量"},

        {id:5, pId:0, name:"组合功能 演示", open:false},
        {id:501, pId:5, name:"冻结根节点"},
        {id:502, pId:5, name:"单击展开/折叠节点"},
        {id:503, pId:5, name:"保持展开单一路径"},
        {id:504, pId:5, name:"添加 自定义控件"},
        {id:505, pId:5, name:"checkbox / radio 共存"},
        {id:506, pId:5, name:"左侧菜单"},
        {id:507, pId:5, name:"下拉菜单"},
        {id:509, pId:5, name:"带 checkbox 的多选下拉菜单"},
        {id:510, pId:5, name:"带 radio 的单选下拉菜单"},
        {id:508, pId:5, name:"右键菜单 的 实现"},
        {id:511, pId:5, name:"与其他 DOM 拖拽互动"},
        {id:512, pId:5, name:"异步加载模式下全部展开"},

        {id:6, pId:0, name:"其他扩展功能 演示", open:false},
        {id:601, pId:6, name:"隐藏普通节点"},
        {id:602, pId:6, name:"配合 checkbox 的隐藏"},
        {id:603, pId:6, name:"配合 radio 的隐藏"}
    ];

    /**
     * 初始化ztree 组件
     */
    var initTree = function() {
        $.fn.zTree.init($("#dict_tree"), setting, zNodes);
    }

    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
            var table = layui.table;

            table.render({
                elem: '#dict_grid'
                ,url:'https://www.layui.com/test/table/demo3.json'
                ,title: '用户数据表'
                ,totalRow: true
                ,cols: [[
                    {field:'id', title:'ID', width:80, fixed: 'left', unresize: true, sort: true, totalRowText: '合计行'}
                    ,{field:'username', title:'用户名', width:120, edit: 'text'}
                    ,{field:'email', title:'邮箱', width:150, edit: 'text'}
                    ,{field:'experience', title:'积分', width:80, sort: true, totalRow: true}
                    ,{field:'sex', title:'性别', width:80, edit: 'text', sort: true}
                    ,{field:'logins', title:'登入次数', width:100, sort: true, totalRow: true}
                    ,{field:'sign', title:'签名'}
                    ,{field:'city', title:'城市', width:100}
                    ,{field:'ip', title:'IP', width:120}
                    ,{field:'joinTime', title:'加入时间', width:120}
                ]]
                ,page: true
                ,response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                }
                ,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                    return {
                        "code": res.status, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res.rows.item //解析数据列表
                    };
                }
            });

            //监听行工具事件
            table.on('tool(test)', function(obj){
                var data = obj.data;
                //console.log(obj)
                if(obj.event === 'del'){
                    layer.confirm('真的删除行么', function(index){
                        obj.del();
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    layer.prompt({
                        formType: 2
                        ,value: data.email
                    }, function(value, index){
                        obj.update({
                            email: value
                        });
                        layer.close(index);
                    });
                }
            });
        });
    }

    /**
     * 初始化表单提交
     */
    var handleDictFormSubmit = function() {
        $('#dict_form_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $("#dict_form");
            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    url: {
                        required: true
                    }
                },
                errorElement: "div",                  // 验证失败时在元素后增加em标签，用来放错误提示
                errorPlacement: function (error, element) {   // 验证失败调用的函数
                    error.addClass( "form-control-feedback" );   // 提示信息增加样式
                    element.parent("div").parent("div").addClass( "has-danger" );
                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter(element.parent("label"));  // 待验证的元素如果是checkbox，错误提示放到label中
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight: function (element, errorClass, validClass) {
                    $(element).addClass("has-danger");     // 验证失败时给元素增加样式
                },
                unhighlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").removeClass( "has-danger" );
                    $(element).removeClass("has-danger");  // 验证成功时去掉元素的样式

                },

                //display error alert on form submit
                invalidHandler: function(event, validator) {

                },
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                success: function(response, status, xhr, $form) {
                    // similate 2s delay
                    setTimeout(function() {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
                    }, 2000);
                }
            });
        });
    }

    var initModalDialog = function() {
        $('#dict_form_modal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);// 触发事件的按钮
            var recipient = button.data('whatever'); // 解析出data-whatever内容
            var modal = $(this);
            modal.find('.modal-title').text(recipient);
          //  modal.find('.modal-body input').val(recipient)
        })
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initTree();
            initDataGrid();
            initModalDialog();
            handleDictFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetDict.init();
});