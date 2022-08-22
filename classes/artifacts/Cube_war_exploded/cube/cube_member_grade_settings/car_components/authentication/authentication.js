let userPhone = "";
let uuid = "";
let valve = true;
let time = 59;

$(function () {
    getUserInfo();
    $("#divVerifyCode").verifycode({
        imgWidth: 73,
        border: false,
        fontSize: 22,
        onVerify: function (result) {
            console.log(result);
            switch ($.trim(result)) {
                case "0":
                    swal("验证码错误", "", "warning");
                    break;
                case "1":
                    break;
                case "2":
                    swal("验证码错误", "", "warning");
                    break;
            }
        },
    });
    $("#div_verycode_img").css({"margin-left": "6px", "margin-top": "-3px"});
    $("#verycode_text").attr("placeholder", "验证码");
    $("#verycode_text").attr("autocomplete", "off");
    $("#verycode_text").attr("name", "FIELD_SECURITY_CODE"); // 为生成的验证码域增加name属性
});

//确认
$(".divLoginBtn").click(() => {
    let userPwd = $.trim($("#j_password").val());
    let validCode = $.trim($("#verycode_text").val());
    if (userPwd == "") {
        swal("短信验证码未填写", "", "warning");
        return;
    }
    if (validCode == "") {
        swal("验证码未填写", "", "warning");
        return;
    }
    checkCubeMemberLevelCode();
});

//发送验证码
$("#j_username_but").click(() => {
    if (userPhone !== "" && userPhone !== null) {
        if (valve) {
            valve = false;
            getCubeMemberLevelCode();
            $("#j_username_but").text(`60s`);
            $("#j_username_but").addClass("j_username_but_no");
            let settime = setInterval(() => {
                if (time > 0) {
                    $("#j_username_but").text(`${time}s`);
                    time--;
                } else {
                    $("#j_username_but").text("发送短信验证码");
                    $("#j_username_but").removeClass("j_username_but_no");
                    clearInterval(settime);
                    valve = true;
                    time = 59
                }
            }, 1000);
        }
    }else {
        swal("您的账户信息没有填写手机，请到用户管理模块补充手机信息。", "", "warning");
    }
});

//获取当前账户手机号
function getUserInfo() {
    $.ajax({
        url: top.Client.CONST_PATH + "/cube/cubebasic/getUserInfo.action",
        type: "POST",
        success: function (res) {
            userPhone = res.userInfo[0].MOBILE_NUMBER;
            $("#j_username").text(userPhone);
        },
    });
}

//获取会员等级设置验证码接口
function getCubeMemberLevelCode() {
    $.ajax({
        url: top.Client.CONST_PATH + "/cube/cubeMemberLevel/getCubeMemberLevelCode.action",
        type: "POST",
        data: {"cubeMemberLevelCriteria.telephone": userPhone},
        success: function (res) {
            if (res.success) {
                uuid = res.data;
            } else {
                swal("获取验证码失败", res.message, "warning");
            }
        },
    });
}

//验证会员等级设置验证码接口
function checkCubeMemberLevelCode() {
    let Password = $.trim($("#j_password").val());
    let validCode = $.trim($("#verycode_text").val());
    let params = {
        "cubeMemberLevelCriteria.verificationCode": Password,
        "cubeMemberLevelCriteria.verificationCodeId": uuid,
        "cubeMemberLevelCriteria.imageCode": validCode,
    };
    layer.load();
    $.ajax({
        url: top.Client.CONST_PATH + "/cube/cubeMemberLevel/checkCubeMemberLevelCode.action",
        type: "POST",
        data: params,
        success: function (res) {
            layer.closeAll();
            if (res.success) {
                setAuthentication(true);
            } else {
                swal("验证失败", res.message, "warning");
            }
        },
    });
}
