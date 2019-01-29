//== Class Definition
var SnippetSystemAccredit = function() {
    var serverUrl = Utils.serverAddress;
    var systemAccreditTable;
    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
            systemAccreditTable = layui.table;

            systemAccreditTable.render({
                elem: '#system_accredit_grid',
                url: serverUrl + 'system/authorization/grid',
                title: '系统授权列表',
                text: "无数据", //空数据时的异常提示
                cellMinWidth: 80, //全局定义常规单元格的最小宽度
                height: 'full-60', //高度最大化减去差值
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
                    {field:'signature', title:'签名'},
                    {field:'expireTime', title:'到期时间'},
                    ,{field:'status', title:'状态',width: 80, align: 'center'}
                ]],
                page: true ,
                limit: 20,
                limits: [20,40,60],
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
            systemAccreditTable.on('tool(test)', function(obj){
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
     * 刷新grid
     */
    var refreshGrid = function () {
        systemAccreditTable.reload("system_accredit_grid");
    }

    /**
     * 初始化表单提交
     */
    var handlesystem_accreditFormSubmit = function() {
        $('#system_accredit_form_submit').click(function(e) {
            e.preventDefault();
            Utils.inputTrim();
            var btn = $(this);
            var form = $("#system_accredit_form");
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
            console.log(form.serializeJSON());
            console.log(JSON.stringify(form.serializeJSON()));
            var formData = JSON.stringify(form.serializeJSON());
            $.ajax({
                type: "POST",
                url: serverUrl + "system/authorization/save",
                contentType: "application/json;charset=utf-8",
                data: formData,
                dataType: "json",
                success:function (response) {
                    Utils.modalUnblock("#system_accredit_form_modal");
                    console.log(response);
                    if (response.success) {
                        toastr.success(Utils.saveSuccessMsg);
                        refreshGrid();
                        // 关闭 dialog
                        $('#system_accredit_form_modal').modal('hide');
                    } else if (response.status == 202) {
                        toastr.error(Utils.saveFailMsg);
                    } else {
                        toastr.error(response.message);
                    }
                },
                error:function (response) {
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
        var form = $("#system_accredit_form");
        form.resetForm();
        $(".form-control-feedback").parent("div").parent("div").removeClass( "has-danger" );
        $(".form-control-feedback").remove();
    }

    var initModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#system_accredit_form_modal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);// 触发事件的按钮
            var recipient = button.data('whatever'); // 解析出data-whatever内容
            var modal = $(this);
            modal.find('.modal-title').text(recipient);
            // 清空form 表单数据
            cleanForm();
            //  modal.find('.modal-body input').val(recipient)
        });

        // 当调用 hide 实例方法时触发。
        $('#system_accredit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            cleanForm();
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initDataGrid();
            initModalDialog();
            handlesystem_accreditFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetSystemAccredit.init();
});