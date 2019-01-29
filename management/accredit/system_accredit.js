//== Class Definition
var SnippetSystemAccredit = function() {
    var serverUrl = Utils.serverAddress;

    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
            var table = layui.table;

            table.render({
                elem: '#system_accredit_grid'
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
                url: serverUrl + "system_accredit/save",
                contentType: "application/json;charset=utf-8",
                data: formData,
                dataType: "json",
                success:function (response) {
                    Utils.modalUnblock("#system_accredit_form_modal");
                    console.log(response);
                    if (response.success) {
                        toastr.success("New order has been placed!");
                        // 关闭 dialog
                        $('#system_accredit_form_modal').modal('hide');
                    } else {
                        toastr.error("Are you the six fingered man?");
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