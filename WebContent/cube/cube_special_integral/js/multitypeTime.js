/**
 @FileDescription:     关联型时间控件（用于特殊积分设置页面）
 @Author: ouyw
 @Date: 2022-04-02
 @API:
 ev                  需渲染的元素（必填，类似"#xxx"、".xxx"）
 type                时间控件类型（'eventMonth','data','section','1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m', '11m', '12m'）
 time                时间控件时间（'2022-01-02'或'2022-04-01 - 2022-04-08'）
 @Event:
 xxx.getTimes()      通过getTimes方法获取时间对象{type:类型,time:时间}
 */
var integralTime = /** @class */ (function () {
    function integralTime(ev, type, time) {
        this.ev = ev;
        this.laydDateTime = time;
        this.newType = type === null || type === '' || type === undefined ? null : type;
        this.newTime = time === null || time === '' || time === undefined ? null : time;
    }
    integralTime.prototype.showtime = function () {
        var _this_1 = this;
        var day_29 = new Array(29);
        var day_30 = new Array(30);
        var day_31 = new Array(31);
        var am29 = '';
        var am30 = '';
        var am31 = '';
        var am31_31 = '';
        var am30_30 = '';
        var am29_29 = '';
        am29 += "<option value=\"section\">\u65E5\u671F\u533A\u95F4</option>";
        am30 += "<option value=\"section\">\u65E5\u671F\u533A\u95F4</option>";
        am31 += "<option value=\"section\">\u65E5\u671F\u533A\u95F4</option>";
        // @ts-ignore
        Array.from(day_29).forEach(function (item, i) {
            am29 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
            am29_29 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
        });
        // @ts-ignore
        Array.from(day_30).forEach(function (item, i) {
            am30 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
            am30_30 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
        });
        // @ts-ignore
        Array.from(day_31).forEach(function (item, i) {
            am31 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
            am31_31 += "<option value=\"" + (i + 1) + "\">" + (i + 1) + "\u65E5</option>";
        });
        var html = "\n        <div style=\"display: flex\">\n            <select class=\"select-input form-control myNewTime\"\n                    style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px;margin:0 6px;\">\n                <option value=\"eventMonth\">\u6BCF\u6708</option>\n                <option value=\"data\">\u81EA\u5B9A\u4E49\u65E5\u671F</option>\n                <option value=\"section\">\u81EA\u5B9A\u4E49\u533A\u95F4</option>\n                <option value=\"1m\">1\u6708</option>\n                <option value=\"2m\">2\u6708</option>\n                <option value=\"3m\">3\u6708</option>\n                <option value=\"4m\">4\u6708</option>\n                <option value=\"5m\">5\u6708</option>\n                <option value=\"6m\">6\u6708</option>\n                <option value=\"7m\">7\u6708</option>\n                <option value=\"8m\">8\u6708</option>\n                <option value=\"9m\">9\u6708</option>\n                <option value=\"10m\">10\u6708</option>\n                <option value=\"11m\">11\u6708</option>\n                <option value=\"12m\">12\u6708</option>\n            </select>\n            <select class=\"select-input form-control aMonth_29\" style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px;\">\n                " + am29 + "\n            </select>\n            <select class=\"select-input form-control aMonth_30\" style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px;\">\n                " + am30 + "\n            </select>\n            <select class=\"select-input form-control aMonth_31\" style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px\">\n                " + am31 + "\n            </select>\n            <input type=\"text\" class=\"layui-input form-control test1\" style=\"height: 35px;border-radius: 3px;font-size: 15px;width: 250px;padding-left: 10px\" placeholder=\"\u8BF7\u9009\u62E9\u65E5\u671F\">\n            <input type=\"text\" class=\"layui-input form-control test2\" style=\"height: 35px;border-radius: 3px;font-size: 15px;width: 250px;padding-left: 10px\" placeholder=\"\u5F00\u59CB\u65E5\u671F - \u7ED3\u675F\u65E5\u671F\">\n            <div class=\"test3\" style=\"height: 35px;font-size: 15px;width: 260px;margin-left: 6px;display: flex;justify-content: space-between;align-items: center\">\n                <select class=\"select-input form-control\" style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px\">\n                    " + am31_31 + "\n                </select>\n                -\n                <select class=\"select-input form-control\" style=\"width: 120px;display: inline-block;padding: 3px;height: 35px;font-size: 15px;border-radius: 3px\">\n                    " + am31_31 + "\n                </select>\n            </div>\n        </div>\n        ";
        //渲染html
        $(this.ev).html(html);
        var _this = this;
        // 时间控件
        laydate5.render({
            elem: this.ev + " .test1",
            OnOff: true,
            done: function (value) {
                _this.laydDateTime = value;
            }
        });
        laydate5.render({
            elem: this.ev + " .test2",
            range: true,
            type: 'date',
            format: 'yyyy-MM-dd',
            OnOff: true,
            done: function (value) {
                _this.laydDateTime = value;
            }
        });
        var aMonth_31_JQ = $(this.ev + " .aMonth_31");
        var aMonth_29_JQ = $(this.ev + " .aMonth_29");
        var aMonth_30_JQ = $(this.ev + " .aMonth_30");
        var test1_JQ = $(this.ev + " .test1");
        var test2_JQ = $(this.ev + " .test2");
        var test3_JQ = $(this.ev + " .test3");
        var test3_input_JQ = $(this.ev + " .test3 .select-input");
        var myNewTime_JQ = $(this.ev + " .myNewTime");
        aMonth_31_JQ.hide();
        aMonth_29_JQ.hide();
        aMonth_30_JQ.hide();
        test1_JQ.hide();
        test2_JQ.hide();
        test3_JQ.hide();
        if (this.newType !== null && this.newType !== '' && this.newType !== undefined) {
            myNewTime_JQ.val(this.newType);
            switch (this.newType) {
                case 'eventMonth':
                case '1m':
                case '3m':
                case '5m':
                case '7m':
                case '8m':
                case '10m':
                case '12m':
                    aMonth_31_JQ.show();
                    test3_input_JQ.html(am31_31);
                    if (this.newTime.split(' - ').length > 1) {
                        aMonth_31_JQ.val('section');
                        test3_JQ.show();
                        test3_input_JQ.eq(0).val("" + Number(this.newTime.split(' - ')[0].slice(-2)));
                        test3_input_JQ.eq(1).val("" + Number(this.newTime.split(' - ')[1].slice(-2)));
                        this.newTime = 'section';
                    }
                    else {
                        this.newTime = String(Number(this.newTime.slice(-2)));
                        aMonth_31_JQ.val(this.newTime);
                    }
                    break;
                case 'data':
                    test1_JQ.show().val(this.newTime);
                    break;
                case 'section':
                    test2_JQ.show().val(this.newTime);
                    break;
                case '2m':
                    aMonth_29_JQ.show();
                    test3_input_JQ.html(am29_29);
                    if (this.newTime.split(' - ').length > 1) {
                        aMonth_29_JQ.val('section');
                        test3_JQ.show();
                        test3_input_JQ.eq(0).val("" + Number(this.newTime.split(' - ')[0].slice(-2)));
                        test3_input_JQ.eq(1).val("" + Number(this.newTime.split(' - ')[1].slice(-2)));
                        this.newTime = 'section';
                    }
                    else {
                        this.newTime = String(Number(this.newTime.slice(-2)));
                        aMonth_29_JQ.val(this.newTime);
                    }
                    break;
                case '4m':
                case '6m':
                case '9m':
                case '11m':
                    aMonth_30_JQ.show();
                    test3_input_JQ.html(am30_30);
                    if (this.newTime.split(' - ').length > 1) {
                        aMonth_30_JQ.val('section');
                        test3_JQ.show();
                        test3_input_JQ.eq(0).val("" + Number(this.newTime.split(' - ')[0].slice(-2)));
                        test3_input_JQ.eq(1).val("" + Number(this.newTime.split(' - ')[1].slice(-2)));
                        this.newTime = 'section';
                    }
                    else {
                        this.newTime = String(Number(this.newTime.slice(-2)));
                        aMonth_30_JQ.val(this.newTime);
                    }
                    break;
            }
        }
        else {
            aMonth_31_JQ.show();
            test3_JQ.show();
            this.newType = "eventMonth";
            this.newTime = 'section';
        }
        myNewTime_JQ.change(function () {
            _this_1.newType = myNewTime_JQ.val();
            aMonth_31_JQ.hide();
            aMonth_29_JQ.hide();
            aMonth_30_JQ.hide();
            test1_JQ.hide();
            test2_JQ.hide();
            test3_JQ.hide();
            switch (myNewTime_JQ.val()) {
                case 'eventMonth':
                case '1m':
                case '3m':
                case '5m':
                case '7m':
                case '8m':
                case '10m':
                case '12m':
                    aMonth_31_JQ.show().val('section');
                    test3_JQ.show();
                    test3_input_JQ.html(am31_31).val('1');
                    _this_1.newTime = aMonth_31_JQ.val();
                    break;
                case 'data':
                    test1_JQ.show().val(undefined);
                    _this_1.laydDateTime = '';
                    _this_1.newTime = test1_JQ.val();
                    break;
                case 'section':
                    test2_JQ.show().val(undefined);
                    _this_1.laydDateTime = '';
                    _this_1.newTime = test2_JQ.val();
                    break;
                case '2m':
                    aMonth_29_JQ.show().val('section');
                    test3_JQ.show();
                    test3_input_JQ.html(am29_29).val('1');
                    _this_1.newTime = aMonth_29_JQ.val();
                    break;
                case '4m':
                case '6m':
                case '9m':
                case '11m':
                    aMonth_30_JQ.show().val('section');
                    test3_JQ.show();
                    test3_input_JQ.html(am30_30).val('1');
                    _this_1.newTime = aMonth_30_JQ.val();
                    break;
            }
        });
        aMonth_29_JQ.change(function () {
            if (aMonth_29_JQ.val() === 'section') {
                test3_JQ.show();
                test3_input_JQ.html(am29_29).val('1');
            }
            else {
                test3_JQ.hide().val(undefined);
            }
            _this_1.newTime = aMonth_29_JQ.val();
        });
        aMonth_30_JQ.change(function () {
            if (aMonth_30_JQ.val() === 'section') {
                test3_JQ.show();
                test3_input_JQ.html(am30_30).val('1');
            }
            else {
                test3_JQ.hide().val(undefined);
            }
            _this_1.newTime = aMonth_30_JQ.val();
        });
        aMonth_31_JQ.change(function () {
            if (aMonth_31_JQ.val() === 'section') {
                test3_JQ.show();
                test3_input_JQ.html(am31_31).val('1');
            }
            else {
                test3_JQ.hide().val(undefined);
            }
            _this_1.newTime = aMonth_31_JQ.val();
        });
    };
    integralTime.prototype.getTimes = function () {
        var params = {
            type: this.newType,
            time: ''
        };
        var year = new Date().getFullYear();
        // @ts-ignore
        var month = String(new Date().getMonth() + 1).padStart(2, '0');
        // @ts-ignore
        if (['data', 'section'].includes(this.newType)) {
            // @ts-ignore
            params.time = this.laydDateTime;
        }
        // @ts-ignore
        if (['eventMonth'].includes(this.newType) && this.newTime !== 'section') {
            // @ts-ignore
            params.time = year + "-" + month + "-" + this.newTime.padStart(2, '0');
            // @ts-ignore
        }
        else if (['eventMonth'].includes(this.newType) && this.newTime === 'section') {
            var test3_selectJQ = $(this.ev + " .test3 .select-input");
            var max = Math.max(+test3_selectJQ.eq(0).val(), +test3_selectJQ.eq(1).val());
            var min = Math.min(+test3_selectJQ.eq(0).val(), +test3_selectJQ.eq(1).val());
            // @ts-ignore
            params.time = year + "-" + month + "-" + String(min).padStart(2, '0') + " - " + year + "-" + month + "-" + String(max).padStart(2, '0');
        }
        // @ts-ignore
        if (['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m', '11m', '12m'].includes(this.newType) && this.newTime !== 'section') {
            // @ts-ignore
            params.time = year + "-" + this.newType.slice(0, -1).padStart(2, '0') + "-" + this.newTime.padStart(2, '0');
            // @ts-ignore
        }
        else if (['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m', '11m', '12m'].includes(this.newType) && this.newTime === 'section') {
            var test3_selectJQ = $(this.ev + " .test3 .select-input");
            var max = Math.max(+test3_selectJQ.eq(0).val(), +test3_selectJQ.eq(1).val());
            var min = Math.min(+test3_selectJQ.eq(0).val(), +test3_selectJQ.eq(1).val());
            // @ts-ignore
            params.time = year + "-" + this.newType.slice(0, -1).padStart(2, '0') + "-" + String(min).padStart(2, '0') + " - " + year + "-" + this.newType.slice(0, -1).padStart(2, '0') + "-" + String(max).padStart(2, '0');
        }
        return params;
    };
    return integralTime;
}());
