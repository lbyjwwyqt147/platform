//== Class Definition
var SnippetSystemAccredit = function() {
    var serverUrl = Utils.serverAddress;
    var systemAccreditTable;
    var systemAccreditFormModal = $('#system_accredit_form_modal');
    var form = $("#system_accredit_form");
    var mark = 1;
    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
            systemAccreditTable = layui.table;
            var layuiForm = layui.form;
            systemAccreditTable.render({
                elem: '#system_accredit_grid',
                url: serverUrl + 'system/authorization/grid',
                title: '系统授权列表',
                text: "无数据", //空数据时的异常提示
                cellMinWidth: 50, //全局定义常规单元格的最小宽度
                height: 'full-100', //高度最大化减去差值
                even: true,
                initSort: {
                    field: 'sysCode', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', hide:true },
                    {field:'sysCode', title:'系统代码'},
                    {field:'sysName', title:'系统名称'},
                    {field:'appId', title:'appId', width:150},
                    {field:'appKey', title:'appKey', width:250},
                    {field:'signature', title:'签名', width:250},
                    {field:'expireTime', title:'到期时间', align: 'center',
                        templet : function (row) {
                            return Utils.datatHHmmFormat(row.expireTime);
                        }
                    },
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
                    {fixed: 'right', title:'操作', toolbar: '#system_table_toolbar', align: 'center', width:180}
                ]],
                page: true ,
                limit: 30,
                limits: [30,60,90],
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
            systemAccreditTable.on('tool(system_accredit_grid)', function(obj){
                if(obj.event === 'del'){
                    deleteData(obj);
                } else if(obj.event === 'edit'){
                    var data = obj.data;
                    form.setForm(data);
                    mark = 2;
                    // 显示 dialog
                    systemAccreditFormModal.modal('show');
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
        systemAccreditTable.reload("system_accredit_grid");
    };

    /**
     * 初始化表单提交
     */
    var handlesystemAccreditFormSubmit = function() {
        $('#system_accredit_form_submit').click(function(e) {
            e.preventDefault();
            Utils.inputTrim();
            var btn = $(this);
            form.validate({
                rules: {
                    sysCode: {
                        required: true,
                        maxlength: 10
                    },
                    sysName: {
                        required: true,
                        maxlength: 32
                    },
                    expireTime: {
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
            Utils.modalBlock("#system_accredit_form_modal");
            $("#system_accredit_form input[name='systemCode']").val(Utils.systemCode);
            $("#system_accredit_form input[name='credential']").val(Utils.credential);
            $.ajax({
                type: "POST",
                url: serverUrl + "system/authorization/save",
                data: form.serializeJSON(),
                dataType: "json",
                headers: Utils.headers,
                success:function (response) {
                    Utils.modalUnblock("#system_accredit_form_modal");
                    if (response.success) {
                        // toastr.success(Utils.saveSuccessMsg);
                        refreshGrid();
                        // 关闭 dialog
                        $('#system_accredit_form_modal').modal('hide');
                    } else if (response.status == 202) {
                        toastr.error(Utils.saveFailMsg);
                    } else {
                        toastr.error(Utils.tipsFormat(response.message));
                    }
                },
                error:function (response) {
                    Utils.modalUnblock("#system_accredit_form_modal");
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
        var form = $("#system_accredit_form");
        form.resetForm();
        var input = form.find("input");
        $.each(input,function(i,v){
            $(v).removeAttr("value");
        });
        var formControlFeedback = $(".form-control-feedback");
        formControlFeedback.parent("div").parent("div").removeClass( "has-danger" );
        formControlFeedback.remove();
    };

    /**
     * 删除
     */
    var deleteData = function(obj) {
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.sysCode);
        } else {
            // 获取选中的数据对象
            var checkRows = systemAccreditTable.checkStatus('system_accredit_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.sysCode);
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
                    url: serverUrl + "system/authorization/batchDelete",
                    traditional:true,
                    data: {
                        'codes' : JSON.stringify(idsArray),
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
            var checkRows = systemAccreditTable.checkStatus('system_accredit_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.sysCode);
                });
            }
        }
        if (idsArray.length > 0) {
            Utils.pageMsgBlock();
            $.ajax({
                type: "POST",
                url: serverUrl + "system/authorization/status",
                traditional:true,
                data: {
                    'codes' : JSON.stringify(idsArray),
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
            url: serverUrl + "system/authorization/sync",
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
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#expireTime',
                type: 'datetime',
                min: 1,
                btns: ['clear', 'confirm']
            });
        });

        // 在调用 show 方法后触发。
        systemAccreditFormModal.on('show.bs.modal', function (event) {
         //   var button = $(event.relatedTarget);// 触发事件的按钮
           // var recipient = button.data('whatever'); // 解析出data-whatever内容
            var recipient = "新增系统信息";
            if (mark == 2) {
                recipient = "修改系统信息";
            }
            var modal = $(this);
            modal.find('.modal-title').text(recipient);

            //  modal.find('.modal-body input').val(recipient)
        });

        // 当调用 hide 实例方法时触发。
        systemAccreditFormModal.on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            cleanForm();
            $(".modal-backdrop").remove();
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initDataGrid();
            initModalDialog();
            handlesystemAccreditFormSubmit();
            $('#accredit_delete').click(function(e) {
                e.preventDefault();
                deleteData(null);
                return false;
            });
            $('#accredit_add').click(function(e) {
                e.preventDefault();
                mark = 1;
                // 显示 dialog
                systemAccreditFormModal.modal('show');
                return false;
            });

            $('#accredit_sync').click(function(e) {
                e.preventDefault();
                sync();
                return false;
            });

            window.onresize = function(){
                systemAccreditTable.resize("system_accredit_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetSystemAccredit.init();
});