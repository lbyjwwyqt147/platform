//== Class Definition
var SnippetDict = function() {
    var serverUrl = Utils.serverAddress;
    var dictTable;
    var dictFormModal = $('#dict_form_modal');
    var form = $("#dict_form");
    var mark = 1;
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
             dictTable = layui.table;
            var layuiForm = layui.form;
            dictTable.render({
                elem: '#dict_grid',
                url: serverUrl + 'dict/grid',
                where: {   //传递额外参数
                    'pid' : 0,
                    'credential': Utils.credential,
                    'systemCode': Utils.systemCode
                },
                title: '数据字典列表',
                text: "无数据", //空数据时的异常提示
                cellMinWidth: 50, //全局定义常规单元格的最小宽度
                height: 'full-100', //高度最大化减去差值
                even: true,
                initSort: {
                    field: 'priority', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', hide:true },
                    {field:'dictCode', title:'字典代码'},
                    {field:'dictName', title:'字典名称'},
                    {field:'priority', title:'优先级'},
                    {field:'description', title:'描述'},
                    {field:'status', title:'状态', align: 'center',
                        templet : function (row) {
                            var value = row.status;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + Utils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', toolbar: '#dict_table_toolbar', align: 'center', width:180}
                ]],
                page: true ,
                limit: 20,
                limits: [20,30,40,50],
                request: {
                    pageName: 'pageNumber', //页码的参数名称，默认：page
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
                },
                parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                    return {
                        "code": res.status, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res.data //解析数据列表
                    };
                }
            });

            //监听行工具事件
            dictTable.on('tool(dict_grid)', function(obj){
                if(obj.event === 'del'){
                    deleteData(obj);
                } else if(obj.event === 'edit'){
                    var data = obj.data;
                    form.setForm(data);
                    mark = 2;
                    // 显示 dialog
                    dictFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                if (obj.elem.checked) {
                    statusValue = 1;
                }
                updateDataStatus(obj, statusValue);
            });
        });
    }

    /**
     * 刷新grid
     */
    var refreshGrid = function () {
        dictTable.reload('dict_grid',{
            where: {   //传递额外参数
                'pid' : 0
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }

        });
    };

    /**
     * 初始化表单提交
     */
    var handleDictFormSubmit = function() {
        $('#dict_form_submit').click(function(e) {
            e.preventDefault();
            Utils.inputTrim();
            var btn = $(this);
            form.validate({
                rules: {
                    dictCode: {
                        required: true,
                        maxlength: 32
                    },
                    dictName: {
                        required: true,
                        maxlength: 32
                    },
                    priority: {
                        range: [1,999]
                    },
                    description: {
                        maxlength: 45
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
            Utils.modalBlock("#dict_form_modal");
            $("#dict_form input[name='systemCode']").val(Utils.systemCode);
            $("#dict_form input[name='credential']").val(Utils.credential);
            $("#dict_form input[name='pid']").val(0);
            $.ajax({
                type: "POST",
                url: serverUrl + "dict/save",
                data: form.serializeJSON(),
                dataType: "json",
                success:function (response) {
                    Utils.modalUnblock("#dict_form_modal");
                    if (response.success) {
                        // toastr.success(Utils.saveSuccessMsg);
                        refreshGrid();
                        // 关闭 dialog
                        dictFormModal.modal('hide');
                    }  else if (response.status == 202) {
                        toastr.error(Utils.saveFailMsg);
                    } else {
                        toastr.error(Utils.tipsFormat(response.message));
                    }

                },
                error:function (response) {
                    Utils.modalUnblock("#dict_form_modal");
                    toastr.error(Utils.errorMsg);
                }
            });
            return false;
        });
    }

    /**
     *  清空表单数据和样式
     */
    var cleanForm = function () {
        Utils.cleanFormData(form);
    }

    /**
     * 删除
     */
    var deleteData = function(obj) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = dictTable.checkStatus('dict_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        if (idsArray.length > 0) {
            //询问框
            layer.confirm('你确定要删除?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                Utils.pageMsgBlock();
                $.ajax({
                    type: "POST",
                    url: serverUrl + "dict/batchDelete",
                    traditional:true,
                    data: {
                        'ids' : JSON.stringify(idsArray),
                        'systemCode' : Utils.systemCode,
                        'credential' : Utils.credential,
                        _method: 'DELETE'
                    },
                    dataType: "json",
                    success:function (response) {
                        Utils.htmPageUnblock();
                        if (response.success) {
                            if (obj != null) {
                                obj.del();
                            } else {
                                refreshGrid();
                            }
                        } else if (response.status == 202) {
                            toastr.error(Utils.saveFailMsg);
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error:function (response) {
                        Utils.htmPageUnblock();
                        toastr.error(Utils.errorMsg);
                    }
                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  修改状态
     */
    var updateDataStatus = function(obj,status) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = dictTable.checkStatus('dict_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        if (idsArray.length > 0) {
            Utils.pageMsgBlock();
            $.ajax({
                type: "POST",
                url: serverUrl + "dict/status",
                traditional:true,
                data: {
                    'ids' : JSON.stringify(idsArray),
                    'systemCode' : Utils.systemCode,
                    'credential' : Utils.credential,
                    'status' : status,
                    _method: 'PUT'
                },
                dataType: "json",
                success:function (response) {
                    Utils.htmPageUnblock();
                    if (response.success) {
                        refreshGrid();
                    }  else {
                        if (obj != null) {
                            layer.tips(Utils.updateMsg, obj.othis,  {
                                tips: [4, '#f4516c']
                            });
                        } else {
                            toastr.error(Utils.updateMsg);
                        }
                    }
                },
                error:function (response) {
                    Utils.htmPageUnblock();
                    toastr.error(Utils.errorMsg);
                }
            });
        }
    };


    var initModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#dict_form_modal').on('show.bs.modal', function (event) {
            var recipient = "新增数据字典";
            if (mark == 2) {
                recipient = "修改数据字典";
            }
            var modal = $(this);
            modal.find('.modal-title').text(recipient);
          //  modal.find('.modal-body input').val(recipient)
        });

        // 当调用 hide 实例方法时触发。
        $('#dict_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            cleanForm();
            $(".modal-backdrop").remove();
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initTree();
            initDataGrid();
            initModalDialog();
            handleDictFormSubmit();
            $('#dict_delete').click(function(e) {
                e.preventDefault();
                deleteData(null);
                return false;
            });
            $('#dict_add').click(function(e) {
                e.preventDefault();
                mark = 1;
                // 显示 dialog
                dictFormModal.modal('show');
                return false;
            });

            window.onresize = function(){
                dictTable.resize("dict_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetDict.init();
});