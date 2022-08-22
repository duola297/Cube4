/**
 @FileDescription:     Tabs 标签页
 @Author: ouyw
 @Date: 2022-04-02
 @API:
 option:{
            event:'#xxx'         被渲染的标签('#xxx'或'.xxx')
            nav:[
            title:tab名,
            key:,
            target:tag(唯一标识)
            ]                   tab面板的数据
            clickNav:()=>{}     切换面板的回调
         }
 @Event:
 */
var showDIYNav = /** @class */ (function () {
    function showDIYNav(option) {
        this.op = option;
        this.navs = option.nav;
        this.ev = option.event;
        this.navliCss = 'min-width:80px;height: 32px;text-align: center;cursor: pointer;margin-top: 5px;padding:0 20px;';
        this.navligreenCss = 'min-width:80px;height: 32px;text-align: center;cursor: pointer;margin-top: 5px;color: #1AB394;border-bottom: 2px solid #1AB394;padding:0 20px;';
    }
    /**
     * 渲染Nav
     */
    showDIYNav.prototype.initNav = function () {
        var _this_1 = this;
        var navul = '';
        this.navs.forEach(function (item) {
            navul += "<div class=\"navli navli-" + item.key + "\" data-id=" + JSON.stringify(item) + " style='" + _this_1.navliCss + "'>" + item.title + "</div>";
        });
        var html = "\n            <div class=\"navul\" style=\"width: 100%;height: 40px;display: flex;align-items: center;\n                margin-bottom: 4px;border-bottom: 1px solid #e5e6e7;\n                overflow: auto;font-size: 16px;line-height: 32px;\">\n                " + navul + "\n            </div>\n        ";
        $("" + this.ev).html(html);
        var navliJQ = $(this.ev + " .navli");
        navliJQ.eq(0).attr('style', this.navligreenCss);
        var _this = this;
        navliJQ.on('click', function () {
            $(_this.ev + " .navli").removeAttr('style').attr('style', _this.navliCss);
            $(this).attr('style', _this.navligreenCss);
            _this.clickNav($(this).attr('data-id'));
        });
    };
    /**
     * Nav点击事件回调
     * @param data
     */
    showDIYNav.prototype.clickNav = function (data) {
        var params = {
            tag: JSON.parse(data).target,
            key: JSON.parse(data).key
        };
        this.op.clickNav(params);
    };
    /**
     * 重置Nav
     */
    showDIYNav.prototype.resetNav = function () {
        var $navJQ = $(this.ev + " .navli");
        $navJQ.removeAttr('style').attr('style', this.navliCss);
        $navJQ.eq(0).attr('style', this.navligreenCss);
    };
    return showDIYNav;
}());
