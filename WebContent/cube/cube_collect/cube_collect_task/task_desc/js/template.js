

define(function (require, exports) {

  const {
    getSmsTemplateTree,
    getSmsTemplateContent,
    getModuleVariable,
    previewSendMsg,
  } = require('template_api')


  // 消息内容里的变量转文字
  store.smsVariable = null;
  async function replaceTemplateVariable(content) {
    let fieldList = null
    if (store.smsVariable) {
      fieldList = store.smsVariable
    } else {
      fieldList = await getModuleVariable();
    }
    store.smsVariable = fieldList;
    fieldList.map(field => {
      let reg = new RegExp(field.colVar, 'g')
      content = content.replace(reg, field.labelVar)
    })
    return Promise.resolve(content)
  }
   // 消息内容里面的文字替换成变量
   exports.replaceTextToVariable =  async function (content) {
    let fieldList = null
    if (store.smsVariable) {
      fieldList = store.smsVariable
    } else {
      fieldList = await getModuleVariable();
    }
    store.smsVariable = fieldList;
    fieldList.map(item => {
      let reg = new RegExp('【' + item.labelName + '?】', 'g')
      content = content.replace(reg, item.colVar)
    })
    return content
  }

  // 选择短信模板消息
  // 短信模板消息编辑
  function confirmSmsTemplate(template) {
    console.log('确认选择了短信Template', template)
    $('.smsTemplateEditContent').attr('disabled',false)
    $('.smsTemplateEditContent').removeAttr('disabled')
    $('.smsTemplateEditContent').attr('data-templateid', template.id)
    $('.smsTemplateEditContent').val(template.replaceContent)
    countMsgLength();
  }
  // 计算字数
  function countMsgLength() {
    let value = $('.smsTemplateEditContent').val().trim().replace(/【.*】/g,'')
    $('.step2_sms_msg_tips_conLen').html(value.length)
    $('.step2_sms_msg_tips_msgLen').html(Math.ceil(value.length / 67))
  }
  $('.smsTemplateEditContent').on('keyup', function () {
    countMsgLength();
  })
  exports.countMsgLength = countMsgLength
  // 模板选择
  exports.showTemplate = function(){
    let templateParam = {
      id: '',
      title: '',
      content: '',
      replaceContent: ''
    }
    let html = (() => {
      return `
        <div class="template_modal" style="display:flex" >
          <div class="template_tree">
            <div class="template_tree_title">
              <div class="template-tree-tab active" >文字模版</div>
            </div>
            <div class="template_tree_content">

            </div>
          </div>
          <div class="template_show" style="margin-left:15px;flex:1">
            <div class="template_text">
              模板内容：
              <textarea class="form-control" readonly></textarea>
            </div>
            
          </div>
        </div>
      `
    })()

    // 显示模板内容
    async function showTemplateContent(templateId) {
      console.log('选中短信template', templateId)
      let templateList = await getSmsTemplateContent(templateId);
      let templateContent = templateList[0].TEMPLATE_CONTENT;
      let templateReplaceContent = await replaceTemplateVariable(templateContent)
      
      $('.template_text textarea').val(templateReplaceContent)
      templateParam = {
        id: templateId,
        title: '',
        content: templateContent,
        replaceContent: templateReplaceContent
      }
    }

    // 清空模板内容
    function clearTemplateContent() {
      $('.template_text textarea').val('')
    }

    // 显示消息模板树
    async function showMsgTemplateTree(treeDom) {
      let {
        data
      } = await getSmsTemplateTree();
      let treeData = JSON.parse(data)
      // 如果有选中的，给选中的节点加上配置
      // state: { selected: item['TEMPLATE_ID'] == store.smsTemplateId }
      $('.template_tree_content').jstree({
          core: {
            check_callback: true,
            multiple: false,
            data: treeData
          },
          checkbox: {
            keep_selected_style: false
          },
          plugins: ["checkbox"]
        })
        // 加载回调
        .bind("loaded.jstree", function (e, data) {
          // 展开全部
          $('.template_tree_content').jstree().open_all();
          // 去掉前面两层的 选择框
          $('.template_tree_content').find('li').each(function (index, item) {
            let hasChildren = $(item).attr('aria-level') == 1 || $(item).attr('aria-level') == 2
            if (!!hasChildren) { // 1级，2级目录无需添加选择按钮
              $('.template_tree_content').jstree("disable_checkbox", $(this));
              $('.template_tree_content').jstree("disable_node", $(this));
            } else { // 3级目录无需添加文件icon
              $('.template_tree_content').jstree("hide_icon", $(this));
              // 选中对应的模板id
              if ($(this).attr('id') === $('.smsTemplateEditContent').attr('data-templateid')) {
                $('.template_tree_content').jstree("select_node", $(this));
              }
            }
          })

        })
        // 选择回调
        .bind("select_node.jstree", function (e, nodeData) {
          var templateId = nodeData.node.id;
          showTemplateContent(templateId)
        })
        // 取消勾选回调
        .bind("deselect_node.jstree", function (e, nodeData) {
          clearTemplateContent();
        })
    }

    // 显示弹框
    simpModal({
      head: "请选择您要使用的短信模板",
      body: html,
      show_foot: true,
      size: "lg", //sm,lg,lgx，md
      show_callback: function () {
        showMsgTemplateTree();
        // init_sendMsg();
      },
      sure_function() {
        confirmSmsTemplate(templateParam)
      },
    });
  }
})