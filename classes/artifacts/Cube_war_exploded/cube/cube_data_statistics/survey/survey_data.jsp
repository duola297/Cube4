<%@page contentType="text/html; charset=UTF-8" %>
<%@taglib prefix='security' uri='http://www.springframework.org/security/tags' %>
<%@taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>数据概况</title>
  <%@include file="/global/cube_top.jsp" %>
  <%@include file="/global/cube_common.jsp" %>
  <link href="./css/survey_data.css?v=<s:property escape=" false"
  value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />" rel="stylesheet"/>
  <link href="../common.css?v=<s:property escape=" false"
  value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />" rel="stylesheet"/>
</head>
<body>
  <div class="bg-white" style="padding: 0px 15px;min-height: 100%;">
    <div id="gridTitle" class="cube-page-head">
      <span id="mealTitle">概况</span>
    </div>
          <div class="cube-page-body df-col" style="display: flex;flex-direction: column;">
            <div class="searchDiv">
              <div class="time_seletor" id='timeSelector'></div>
              <select class="select-option form-control" id="brandId" onchange="brandChange()">
                <option value=" ">全部品牌</option>
              </select>
              <select class="select-option form-control" id="relationId">
                <option value=" ">全部经销商</option>
              </select>
              <button class="btn btn-sm btn-white greenBg" style="position: relative;" onclick="reloadData()">查询</button>
            </div>

            <div class="panel-content">
              <div class="row">
                <div class="col-xs-4" style=" padding-left: 0;">
                  <div class="panel panel-default">
                    <div class="panel-heading border-bottom-gray font-size-16" style="padding: 15px 15px;">
                      <span>客户统计（售后预约业务统计）</span>
                    </div>
                    <div class="panel-body" style="padding: 10px 15px;">
                      <div class="row" style="padding: 0 10px;">
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">预约客户数</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="member_user_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">自助预约</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="member_user_initiative_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">顾问邀约</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="member_user_invited_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="row" style="padding: 0 10px;">
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">待客服确认</h4>
                              <p class="module-margin-0"><cite class="font-size-30" id="order_unreceived">0</cite>
                              </p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">已安排顾问</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="order_confirmed_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-4 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">预约已确认</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="order_to_be_confirmed_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xs-4" style=" padding-left: 0;">
                  <div class="panel panel-default">
                    <div class="panel-heading border-bottom-gray font-size-16" style="padding: 15px 15px;">
                      <span>点餐统计</span>
                    </div>
                    <div class="panel-body" style="padding: 10px 15px;">
                      <div class="row" style="padding: 0 10px;">
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">自主点餐</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="catalog_item_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">服务员代点</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="catalog_item_off_sale_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">标准正餐</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="catalog_brand_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">饮料、茶水</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="catalog_supplier_user_num">0</cite></p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-xs-4" style=" padding-left: 0;">
                  <div class="panel panel-default">
                    <div class="panel-heading border-bottom-gray font-size-16" style="padding: 15px 15px;">
                      <span>客户行为分析</span>
                    </div>
                    <div class="panel-body" style="padding: 10px 15px;">
                      <div class="row" style="padding: 0 10px;">
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">报价推送次数</h4>
                              <p class="module-margin-0"><cite class="font-size-30" id="shares_count">0</cite>
                              </p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">报价打开人数</h4>
                              <p class="module-margin-0"><cite class="font-size-30" id="visit_user_count">0</cite>
                              </p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">报价打开次数</h4>
                              <p class="module-margin-0"><cite class="font-size-30" id="visit_count">0</cite>
                              </p>
                            </a>
                          </div>
                        </div>
                        <div class="col-xs-6 module-padding-level-5">
                          <div
                            class="background-color-gray  module-margin-vertical-5 module-padding-level-15 module-padding-vertical-10">
                            <a>
                              <h4 class="font-size-12 font-color-gray">查看金额次数</h4>
                              <p class="module-margin-0"><cite class="font-size-30"
                                  id="visit_price_count">0</cite></p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="echarts-box">
              <div class="panel-heading border-bottom-gray font-size-16">
                <span>数据统计</span>
                <select class="select-option form-control" id="bookType">
                  <option value="">预约类型</option>
                  <option value="1">自助预约</option>
                  <option value="2">CRM预约</option>
                  <option value="3">顾问邀约</option>
                </select>
            </div>
              <div class="echartSearchDiv surverSearch" style="top: 52px;left: 160px;">
                <button class="btn btn-sm btn-white greenBg" style="position: relative;display: none;" data-type='HOUR' id="hour">按小时</button>
                <button class="btn btn-sm btn-white greenBg" style="position: relative;display: none;" id="day" data-type='DAY'>按日</button>
                <button class="btn btn-sm btn-white greenBg" style="position: relative;display: none;" id="month" data-type='MONTH'>按月</button>
                <button class="btn btn-sm btn-white greenBg" style="position: relative;display: none;" id="year" data-type='YEAR'>按年</button>
              </div>
              <div id="surey_echarts"  style="flex-grow:1;width: 100%;"></div>
            </div>

          </div>
        </div>

      </body>
      <script type="text/javascript" src="../charts/echarts.js?v=<s:property escape=" false"
      value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />"></script>
      <script type="text/javascript" src="../countUp.min.js?v=<s:property escape=" false"
      value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />"></script>
      <script type="text/javascript" src="../common.js?v=<s:property escape=" false"
      value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />"></script>
<script type="text/javascript" src="./js/survey_data.js?v=<s:property escape=" false"
      value="@cn.com.sandi.common.utils.SystemUtils@getVenusVersion()" />"></script>

      </html>