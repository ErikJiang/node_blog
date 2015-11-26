/**
 * Created by jiangink on 15/11/20.
 */
$(document).ready(function () {
    //侧边栏导航显示
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });

    //Register: 失去焦点事件查询名称是否已被注册
    $("input#inputUsrName").blur(function () {
        var name = $("input#inputUsrName").val();
        //console.log("name:>> ", name);
        $.get("/findByName.do?name="+name, function (result) {
            //console.log("result:>> ", result.constructor);
            if(result.constructor==Object || name==""){
                $("span.errinfo").removeClass("corinfo");
                if(name==""){
                    $("span.errinfo").text("用户名称不能为空!");
                }else{
                    $("span.errinfo").text("此用户名称已被注册!");
                }
                $("input#inputPassword").attr({"disabled": "diabled"});
                $("input#inputRePasswd").attr({"disabled": "diabled"});
                $("button#submit").attr({"disabled": "diabled"});
            }
            else{
                $("span.errinfo").addClass("corinfo");
                $("span.errinfo").text("名称未被使用,请继续输入 ^_^");
                $("input#inputPassword").removeAttr("disabled");
                $("input#inputRePasswd").removeAttr("disabled");

            }
        });
    });

    //Register: 判断密码是否一致
    $("input#inputRePasswd").blur(function () {
        var pwd = $("input#inputPassword").val();
        var repwd = $("input#inputRePasswd").val();
        if(pwd != repwd){
            $("span.errinfo").removeClass("corinfo");
            $("span.errinfo").text("输入的用户密码不一致!");
            $("button#submit").attr({"disabled": "diabled"});
        }
        else{
            $("span.errinfo").addClass("corinfo");
            $("span.errinfo").text("信息已通过验证,请点击注册 ^_^");
            $("button#submit").removeAttr("disabled");
        }
    });
});

