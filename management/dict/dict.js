//== Class Definition
var SnippetDict = function() {
    var serverUrl = Utils.serverAddress;
    var dictTable;
    var dictFormModal = $('#dict_form_modal');
    var form = $("#dict_form");
    var mark = 1;
    var dictPid = 0;
    var nodeList = [];
    var setting = {
        view: {
            selectedMulti: false,
            fontCss: getFontCss
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
        },
        async: {
            enable: true,
            url: serverUrl + "dict/ztree?systemCode=" + Utils.systemCode + "&credential=" +  Utils.credential + "&pid=" + dictPid,
            autoParam: ["id", "name"]
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                dictPid = treeNode.id;
                refreshGrid();
            }
        }
    };


    /**
     * 初始化ztree 组件
     */
    var initTree = function() {
        $.fn.zTree.init($("#dict_tree"), setting);
    };

    /**
     * 刷新父节点
     * @param id
     */
    function rereshParentNode(id){
        var treeObj = $.fn.zTree.getZTreeObj("dict_tree");
        var nowNode = treeObj.getNodesByParam("id", id, null);
        var parent = nowNode[0].getParentNode();
        treeObj.reAsyncChildNodes(parent, "refresh");
    };

    /**
     *  刷新当前节点
     * @param id
     */
    function rereshNode(id){
        var treeObj = $.fn.zTree.getZTreeObj("dict_tree");
        var nowNode = treeObj.getNodesByParam("id", id, null);
        treeObj.reAsyncChildNodes(nowNode[0], "refresh");
    };

    /**
     *  刷新当前节点
     * @param id
     */
    function rereshTree(){
        var treeObj = $.fn.zTree.getZTreeObj("dict_tree");
        treeObj.refresh();
    };



    /**
     *  搜索节点
     */
    function searchNode() {
        var value = $.trim($("#nodeName-search").val());
        if (value === "") return;
        updateNodes(nodeList,false);
        var zTree = $.fn.zTree.getZTreeObj("dict_tree");
        var keyType = "name";
        nodeList = zTree.getNodesByParamFuzzy(keyType, value);
        updateNodes(nodeList, true);

    };

    function updateNodes(nodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("dict_tree");
        for( var i=0, l=nodeList.length; i<l; i++) {
            nodeList[i].highlight = highlight;
            zTree.updateNode(nodeList[i]);
        }
    };

    function getFontCss(treeId, treeNode) {
        return (!!treeNode.highlight) ? {color:"#C50000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    };


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
                    'pid' : dictPid,
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
                    {fixed: 'right', title:'操作', toolbar: '#dict_table_toolbar', align: 'center', width:200}
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
                headers: Utils.headers,
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
    };

    /**
     * 刷新grid
     */
    var refreshGrid = function () {
        dictTable.reload('dict_grid',{
            where: {   //传递额外参数
                'pid' : dictPid
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
            $("#dict_form input[name='pid']").val(dictPid);
            $.ajax({
                type: "POST",
                url: serverUrl + "dict/save",
                data: form.serializeJSON(),
                dataType: "json",
                headers: Utils.headers,
                success:function (response) {
                    Utils.modalUnblock("#dict_form_modal");
                    if (response.success) {
                        // toastr.success(Utils.saveSuccessMsg);
                        // 刷新表格
                        refreshGrid();
                        // 刷新tree节点
                        rereshNode(dictPid);
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
    };

    /**
     *  清空表单数据和样式
     */
    var cleanForm = function () {
        Utils.cleanFormData(form);
    };

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
                    headers: Utils.headers,
                    success:function (response) {
                        Utils.htmPageUnblock();
                        if (response.success) {
                            if (obj != null) {
                                obj.del();
                            } else {
                                refreshGrid();
                            }
                            rereshNode(dictPid);
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
                headers: Utils.headers,
                success:function (response) {
                    Utils.htmPageUnblock();
                    if (response.success) {
                        refreshGrid();
                        rereshNode(dictPid);
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

    /**
     *  同步数据
     */
    var sync = function() {
            Utils.pageMsgBlock();
            $.ajax({
                type: "POST",
                url: serverUrl + "dict/sync",
                dataType: "json",
                headers: Utils.headers,
                success:function (response) {
                    Utils.htmPageUnblock();
                    if (response.success) {
                        refreshGrid();
                    }  else {
                        toastr.error(Utils.syncMsg);
                    }
                },
                error:function (response) {
                    Utils.htmPageUnblock();
                    toastr.error(Utils.errorMsg);
                }
            });
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
    };

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
            $('#searchNode').click(function(e) {
                e.preventDefault();
                searchNode();
                return false;
            });

            $('#dict_sync').click(function(e) {
                e.preventDefault();
                sync();
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