//== Class Definition
var SnippetAccredit = function() {


    /**
     *  初始化 dataGrid 组件
     */
    var initDataGrid = function () {
        layui.use('table', function(){
            var table = layui.table;

            table.render({
                elem: '#accredit_grid'
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
    var handleAccreditFormSubmit = function() {
        $('#accredit_form_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $("#accredit_form");
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
        $('#accredit_form_modal').on('show.bs.modal', function (event) {
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
            initDataGrid();
            initModalDialog();
            handleAccreditFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetAccredit.init();
});