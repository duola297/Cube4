package cn.com.sandi.cube.cubemember.web;

import java.io.InputStream;
import java.util.*;
import java.util.Map.Entry;

import javax.annotation.Resource;

import cn.com.sandi.cube.cubeintegral.service.CubeIntegralService;
import org.apache.log4j.Logger;

import cn.com.sandi.common.query.PageQueryAction;
import cn.com.sandi.common.query.Query;
import cn.com.sandi.cube.activemq.service.ActiveMQService;
import cn.com.sandi.cube.billwebservice.util.EYHttpUtils;
import cn.com.sandi.cube.common.ResultUtils;
import cn.com.sandi.cube.common.SqlConstants;
import cn.com.sandi.cube.common.StringUtil;
import cn.com.sandi.cube.common.SystemTools;
import cn.com.sandi.cube.cubeamount.constant.RelationSourceEnum;
import cn.com.sandi.cube.cubeamount.service.CubeAmountService;
import cn.com.sandi.cube.cubeconsult.util.RightContstants;
import cn.com.sandi.cube.cubecoupon.service.CubeCouponSubService;
import cn.com.sandi.cube.cubecustomer.model.CubeCustomer;
import cn.com.sandi.cube.cubecustomer.model.CustomerMqLog;
import cn.com.sandi.cube.cubecustomer.service.CubeCustomerService;
import cn.com.sandi.cube.cubecustomer.service.CustomerMqLogService;
import cn.com.sandi.cube.cubemember.model.CubeMember;
import cn.com.sandi.cube.cubemember.model.CubeMemberLog;
import cn.com.sandi.cube.cubemember.query.CubeMemberCriteria;
import cn.com.sandi.cube.cubemember.service.CubeMemberLogService;
import cn.com.sandi.cube.cubemember.service.CubeMemberService;
import cn.com.sandi.cube.marketing.service.CubeMarketingService;
import cn.com.sandi.cube.marketing.util.ResultCode;
import cn.com.sandi.cube.sysexport.model.SysExportTask;
import cn.com.sandi.cube.sysexport.service.SysExportTaskService;
import cn.com.sandi.framework.security.model.RelationOrganizer;
import cn.com.sandi.framework.security.utils.RightsUtils;
import cn.com.sandi.framework.security.web.SecurityUserHolder;
import cn.com.sandi.generic.utils.RestfulUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.opensymphony.xwork2.Preparable;
import com.vdurmont.emoji.EmojiParser;

public class CubeMemberAction extends PageQueryAction implements Preparable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 269984355923542227L;
	
	private static Logger logger = Logger.getLogger(CubeMemberAction.class);
	
	@Resource
	private CubeMemberService cubeMemberService;
	
	@Resource
	private CustomerMqLogService customerMqLogService;
	
	@Resource
	private ActiveMQService activeMQService;
	
	@Resource
	private CubeMarketingService cubeMarketingService;
	
	@Resource
	private CubeAmountService cubeAmountService;
	
	@Resource
	private Query query;

	@Resource
	private CubeMemberLogService cubeMemberLogService;
	
	@Resource
	private CubeCustomerService cubeCustomerService;
	@Resource
	private CubeCouponSubService cubeCouponSubService;
	@Resource
	private SysExportTaskService exportTaskService;
	@Resource
	private CubeIntegralService cubeIntegralService;

	
	private Long memberId;
	private String contactid;
	private String startTime;
	private String endTime;
	private CubeMemberCriteria cubeMemberCriteria;
	private String memberQuery;
	private String vehicleQuery;
	private String lastname;
	private String mobilephone;
	private Long organizerId;
	private String uuid;
	private String code;
	private int memberLevel;
	private String password;
	private String type;
	// 导出excel属性
	private InputStream excelStream;
	private String contentDisposition;
	private String columnFields;
	private String columnFieldsTrans;
	private String exportTaskName;
	private String exportRemark;

	// 用于执行过程中的错误信息返回
	private Map<String, Object> dataMap = new HashMap<String, Object>();
	
	private HashMap<String, Object> resultMap;
	
	private JSONObject resultObj;

	@Override
	public void prepare() throws Exception {
		if (cubeMemberCriteria == null) {
			cubeMemberCriteria = new CubeMemberCriteria();
		}
	}
	
	/**
	 * 查询会员列表
	 * @return
	 */
	public String getCubeMemberList() {
		boolean isCubeCallCenterRight = RightsUtils.hasRights(super.getSession(), RightContstants.IS_CUBE_CALL_CENTER);
		if (isCubeCallCenterRight) {
			cubeMemberCriteria.setOrganizerId(1L);
		} else {
			cubeMemberCriteria.setOrganizerId(SecurityUserHolder.getCurrentUser().getOrganizerId());
		}
		StringBuilder vinLic = new StringBuilder();
		if (cubeMemberCriteria.getVin() != null) {
			vinLic.append(cubeMemberCriteria.getVin());
		}
		if (cubeMemberCriteria.getLic() != null) {
			vinLic.append(cubeMemberCriteria.getLic());
		}
		if (vinLic.length()>0) {
			cubeMemberCriteria.setVinLic(vinLic.toString());
		}
		//归属会员小程序注册日期、归属会员微信关注日期排序
		if ("ATTENTION_DATE".equals(cubeMemberCriteria.getSort()) || "REGISTER_DATE".equals(cubeMemberCriteria.getSort())) {
			cubeMemberCriteria.setSort("CC." + cubeMemberCriteria.getSort());
		} 
		if (cubeMemberCriteria.getOrganizerId().longValue() == 1L){
			super.queryForList(SqlConstants.MEMBER_GET_CUBE_MEMBER_ALL_LIST, SqlConstants.MEMBER_GET_CUBE_MEMBER_ALL_LIST_COUNT, cubeMemberCriteria);
		}
		else {
			super.queryForList(SqlConstants.MEMBER_GET_CUBE_MEMBER_LIST, SqlConstants.MEMBER_GET_CUBE_MEMBER_LIST_COUNT, cubeMemberCriteria);
		}
		Map queryListMap = super.getQueryListMap();
		List<HashMap> rows= (List<HashMap>) queryListMap.get("rows");
		cubeMemberCriteria = new CubeMemberCriteria();
		rows=cubeIntegralService.magrePointField(rows,cubeMemberCriteria);

//		queryListMap.put("rows",rows);
		return SUCCESS;
	}
	
	/**
	 * 导出会员列表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String exportCubeMemberList() {
		try {
			boolean isCubeCallCenterRight = RightsUtils.hasRights(super.getSession(), RightContstants.IS_CUBE_CALL_CENTER);
			if (isCubeCallCenterRight) {
				cubeMemberCriteria.setOrganizerId(1L);
			} else {
				cubeMemberCriteria.setOrganizerId(SecurityUserHolder.getCurrentUser().getOrganizerId());
			}
			StringBuilder vinLic = new StringBuilder();
			if (cubeMemberCriteria.getVin() != null) {
				vinLic.append(cubeMemberCriteria.getVin());
			}
			if (cubeMemberCriteria.getLic() != null) {
				vinLic.append(cubeMemberCriteria.getLic());
			}
			if (vinLic.length()>0) {
				cubeMemberCriteria.setVinLic(vinLic.toString());
			}
			String filename = "会员列表.xls";
			contentDisposition = "attachment;filename=" + new String(filename.getBytes("gb2312"), "ISO8859-1");
			List<HashMap<String, Object>> list;
			cubeMemberCriteria.setIndex(0);
			int rows;
			if (cubeMemberCriteria.getOrganizerId().longValue() == 1L) {
				rows = query.queryForCount(SqlConstants.MEMBER_GET_CUBE_MEMBER_ALL_LIST_COUNT, cubeMemberCriteria);
				if (rows > 60000) {
					cubeMemberCriteria.setRows(60000);
				} else {
					cubeMemberCriteria.setRows(rows);
				}
				list = query.queryForListFull(SqlConstants.MEMBER_GET_CUBE_MEMBER_ALL_LIST, cubeMemberCriteria);
			} else {
				rows = query.queryForCount(SqlConstants.MEMBER_GET_CUBE_MEMBER_LIST_COUNT, cubeMemberCriteria);
				if (rows > 60000) {
					cubeMemberCriteria.setRows(60000);
				} else {
					cubeMemberCriteria.setRows(rows);
				}
				list = query.queryForListFull(SqlConstants.MEMBER_GET_CUBE_MEMBER_LIST, cubeMemberCriteria);
			}
			excelStream = SystemTools.exportExcel("会员列表", "", columnFields, columnFieldsTrans, list, null);
			excelStream.close();
		} catch (Exception e) {
			logger.error("", e);
			dataMap.put("msg", "系统异常！");
			return ERROR;
		}
		return SUCCESS;
	}
	
	/**
	 * 大数据导出
	 * @return
	 */
	public String exportCubeMemberTask() {
		try {
			boolean isCubeCallCenterRight = RightsUtils.hasRights(super.getSession(), RightContstants.IS_CUBE_CALL_CENTER);
			if (isCubeCallCenterRight) {
				cubeMemberCriteria.setOrganizerId(1L);
			} else {
				cubeMemberCriteria.setOrganizerId(SecurityUserHolder.getCurrentUser().getOrganizerId());
			}
			StringBuilder vinLic = new StringBuilder();
			if (cubeMemberCriteria.getVin() != null) {
				vinLic.append(cubeMemberCriteria.getVin());
			}
			if (cubeMemberCriteria.getLic() != null) {
				vinLic.append(cubeMemberCriteria.getLic());
			}
			if (vinLic.length()>0) {
				cubeMemberCriteria.setVinLic(vinLic.toString());
			}
			SysExportTask task = exportTaskService.saveTask(columnFields, columnFieldsTrans, "会员列表", exportTaskName, exportRemark, cubeMemberCriteria);
			
			dataMap.put("taskNo", "EX" + task.getTaskId());
			dataMap.put("code", "1");
			dataMap.put("msg", "生成导出任务成功");
		} catch (Exception e) {
			logger.error("", e);
			dataMap.put("code", "-1");
			dataMap.put("msg", "系统异常！");
			return ERROR;
		}
		
		return SUCCESS;
	}
	
	/**
	 * 查询已关注未注册客户列表
	 * @return
	 */
	public String getWechatCustomerList() {
		super.queryForList(SqlConstants.MEMBER_GET_WECHAT_CUSTOMER_LIST, SqlConstants.MEMBER_GET_WECHAT_CUSTOMER_LIST_COUNT, cubeMemberCriteria);
		return SUCCESS;
	}
	
	/**
	 * 导出已关注未注册客户列表
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String exportWechatCustomerList() {
		try {
			String filename = "微信关注.xls";
			contentDisposition = "attachment;filename=" + new String(filename.getBytes("gb2312"), "ISO8859-1");
			cubeMemberCriteria.setIndex(0);
			int rows;
			rows = query.queryForCount(SqlConstants.MEMBER_GET_WECHAT_CUSTOMER_LIST_COUNT, cubeMemberCriteria);
			if (rows > 60000) {
				cubeMemberCriteria.setRows(60000);
			} else {
				cubeMemberCriteria.setRows(rows);
			}
			List<HashMap<String, Object>> list = query.queryForListFull(SqlConstants.MEMBER_GET_WECHAT_CUSTOMER_LIST, cubeMemberCriteria);
			excelStream = SystemTools.exportExcel("微信关注", "", columnFields, columnFieldsTrans, list, null);
			excelStream.close();
		} catch (Exception e) {
			logger.error("", e);
			dataMap.put("msg", "系统异常！");
			return ERROR;
		}
		return SUCCESS;
	}
	
	/**
	 * 查询会员基础信息
	 * @return
	 */
	public String getMemberInfo() {
		resultMap = cubeMemberService.getMemberInfo(memberId);
		return SUCCESS;
	}
	
	/**
	 * 有效消费对应的 维修工单详情（前两天到367天前）
	 * @return
	 */
	public String getMemberRepairList() {
		resultMap = cubeMemberService.getMemberRepairList(memberId);
		return SUCCESS;
	}
	
	/**
	 * 查询会员等级变动历史记录
	 * @return
	 */
	public String getMemberLevelLog() {
		super.queryForList(SqlConstants.MEMBER_GET_MEMBER_LOG_LIST, SqlConstants.MEMBER_GET_MEMBER_LOG_LIST_COUNT, cubeMemberCriteria);
		return SUCCESS;
	}
	
	/**
	 * 查询该会员管理的所有账户列表
	 * @return
	 */
	public String getMemberManageList() {
		resultMap = cubeMemberService.getMemberManageList(contactid);
		return SUCCESS;
	}
	
	/**
	 * 查询该会员的账户管理人变动日志 
	 * @return
	 */
	public String getAccountManager() {
		resultMap = cubeMemberService.getAccountManagerLog(memberId);
		return SUCCESS;
	}

	
	/**
	 * 更换会员账户管理人
	 * @return
	 */
	public String changeManager() {
		resultMap = cubeMemberService.changeManager(memberId, contactid);
		return SUCCESS;
	}
	
	/**
	 * 更换会员账户归属人
	 * @return
	 */
	public String changeBelonger() {
		resultMap = ResultUtils.createErrResult(ResultCode.SYS_PARAM_MISS.getCode(), ResultCode.SYS_PARAM_MISS.getDesc());
		if (StringUtil.isNotEmpty(contactid) && memberId != null) {
			CubeCustomer cubeCustomer = cubeCustomerService.get(contactid);
			CubeMember cubemeber = cubeMemberService.get(memberId);
			if (cubemeber != null && cubeCustomer != null) {
				String memberContactid = cubemeber.getOriginalContactid();
				if (!memberContactid.equals(contactid)) {
					List<CubeMember> memberList = cubeMemberService.findByWhere("ORIGINAL_CONTACTID='" + contactid + "'", null, 0, 1);
					if (memberList != null && memberList.size()>0) {
						//避免唯一索引报错，先指定一个随机的UUID
						CubeMember member = memberList.get(0);
						member.setContactid(memberContactid);
						member.setOriginalContactid(UUID.randomUUID().toString());
						cubeMemberService.update(member);
						cubemeber.setContactid(contactid);
						cubemeber.setOriginalContactid(contactid);
						cubeMemberService.update(cubemeber);
						member.setOriginalContactid(memberContactid);
						cubeMemberService.update(member);
						CubeMemberLog cubeMemberLog = new CubeMemberLog();
						cubeMemberLog.setMemberId(member.getMemberId());
						cubeMemberLog.setOldContactid(contactid);
						cubeMemberLog.setNewContactid(memberContactid);
						cubeMemberLog.setCreateId(SecurityUserHolder.getCurrentUser().getUserId());
						cubeMemberLog.setCreateName(SecurityUserHolder.getCurrentUser().getUserName());
						cubeMemberLog.setCreateDate(new Date());
						cubeMemberLog.setLogType(2);
						cubeMemberLogService.save(cubeMemberLog);
						// 商城卡券转账户时同步转
						cubeCouponSubService.changeCouponBelong(member.getMemberId(), cubemeber.getMemberId(), "4");
					} else {
						cubemeber.setContactid(contactid);
						cubemeber.setOriginalContactid(contactid);
						cubeMemberService.update(cubemeber);
					}
					CubeMemberLog cubeMemberLog = new CubeMemberLog();
					cubeMemberLog.setMemberId(memberId);
					cubeMemberLog.setOldContactid(memberContactid);
					cubeMemberLog.setNewContactid(contactid);
					cubeMemberLog.setCreateId(SecurityUserHolder.getCurrentUser().getUserId());
					cubeMemberLog.setCreateName(SecurityUserHolder.getCurrentUser().getUserName());
					cubeMemberLog.setCreateDate(new Date());
					cubeMemberLog.setLogType(2);
					cubeMemberLogService.save(cubeMemberLog);
					JSONObject json = new JSONObject();
					json.put("memberId", cubemeber.getMemberId());
					json.put("originalContactid", cubemeber.getOriginalContactid());
					json.put("lastname", cubeCustomer.getLastname());
					resultMap = ResultUtils.createOkResult(json);
				}
			}
		} 
		return SUCCESS;
	}
	
	/**
	 * 获取会员推荐的好友列表
	 * @return
	 */
	public String getBeRecommendedList() {
		resultMap = cubeMemberService.getBeRecommendedList(cubeMemberCriteria);
		return SUCCESS;
	}
	
	/**
	 * 会员工作台全局查找会员资料
	 * @return
	 */
	public String getSelectMemberList() {
		RelationOrganizer relationOrganizer = EYHttpUtils.getDealerCode(super.getSession());
		resultMap = cubeMemberService.getSelectMemberList(memberQuery, vehicleQuery, relationOrganizer);
		return SUCCESS;
	}
	
	/**
	 * 检测该会员是否是该经销商关联（包括子经销商）
	 * @return
	 */
	public String checkWhetherRelation() {
		boolean isCubeCallCenterRight = RightsUtils.hasRights(super.getSession(), RightContstants.IS_CUBE_CALL_CENTER);
		Long organizerId = SecurityUserHolder.getCurrentUser().getOrganizerId();
		if (isCubeCallCenterRight) {
			organizerId = 1L;
		}
		resultMap = cubeMemberService.checkWhetherRelation(memberId, organizerId);
		return SUCCESS;
	}
	
	/**
	 * 用户注册会员
	 * @return
	 */
	public String registerMember() {
		JSONObject json = new JSONObject();
		boolean skipSmsValid = RightsUtils.hasRights(super.getSession(), "skip_sms_valid");
		if (organizerId == null || !StringUtil.isNotEmpty(lastname) || !StringUtil.isNotEmpty(mobilephone)) {
			resultMap = ResultUtils.createErrResult(ResultCode.SYS_PARAM_MISS.getCode(), ResultCode.SYS_PARAM_MISS.getDesc()); 
		} else {
			json = cubeMemberService.registerMember(organizerId, lastname, mobilephone, uuid, code, skipSmsValid);
		}
		if (json.containsKey("cubeMember")) {
			resultMap = ResultUtils.createOkResult(json.get("cubeMember"));
		} else {
			for (Entry<String, Object> entry : json.entrySet()) {
				resultMap = ResultUtils.createErrResult(entry.getKey(), entry.getValue());
			}
		}
		if (json.containsKey("mq")) {
			net.sf.json.JSONObject mqObject = net.sf.json.JSONObject.fromObject(json.get("mq"));
			net.sf.json.JSONObject customerData = mqObject.getJSONObject("data");
			CustomerMqLog customerMqLog = new CustomerMqLog();
			customerMqLog.setDistinctioncode(customerData.getString("DistinctionCode"));
			customerMqLog.setContactid(customerData.getString("ContactId"));
			customerMqLog.setSendTime(new Date());
			customerMqLog.setState("prepare");
			customerMqLog.setSendContent(mqObject.toString());
			customerMqLogService.save(customerMqLog);
			try {
				activeMQService.pushMessageToMq(mqObject, true, true);
			} catch (Exception e) {
				logger.error("", e);
				resultMap = ResultUtils.createErrResult(ResultCode.SYS_EMPTY.getCode(), ResultCode.SYS_EMPTY.getDesc());
			}
		}
		if (json.containsKey("cubeMember")) {
			CubeMember cubeMember = (CubeMember) json.get("cubeMember");
			cubeAmountService.saveCubeAmount(cubeMember.getMemberId(), cubeMember.getTenantsId(), organizerId, true, RelationSourceEnum.CRM_CREATE);
		}
		return SUCCESS;
	}
	
	public String resetMemberLevel() {
		if (memberId != null) {
			cubeMemberService.calculateMember(memberId);
			this.resultMap = ResultUtils.createOkResult();
		} else {
			this.resultMap = ResultUtils.createErrResult(ResultCode.SYS_PARAM_MISS.getCode(), ResultCode.SYS_PARAM_MISS.getDesc());
		}
		return SUCCESS;
	}
	
	public String changeMemberLevel() {
		if (memberId != null) {
			CubeMember cubeMember = cubeMemberService.get(memberId);
			cubeMember.setMemberLevel(memberLevel);
			cubeMember.setUpgradeDate(new Date());
			if (memberLevel<2) {
				cubeMember.setEffectDate(null);
			} else {
				Calendar calendar = Calendar.getInstance();
				calendar.add(Calendar.YEAR, 1);
		        calendar.set(Calendar.HOUR_OF_DAY, 23);
		        calendar.set(Calendar.MINUTE, 59);
		        calendar.set(Calendar.SECOND, 59);
		        cubeMember.setEffectDate(calendar.getTime());
			}
			cubeMemberService.update(cubeMember);
			this.resultMap = ResultUtils.createOkResult();
		} else {
			this.resultMap = ResultUtils.createErrResult(ResultCode.SYS_PARAM_MISS.getCode(), ResultCode.SYS_PARAM_MISS.getDesc());
		}
		return SUCCESS;
	}
	
	public String verifySmsCodeAndPassword() {
		resultMap = cubeMemberService.verifySmsCodeAndPassword(memberId, uuid, code, password);
		return SUCCESS;
	}
	
	public String sendVerificationCode() {
		if (!StringUtil.isNotEmpty(mobilephone) || !StringUtil.isNotEmpty(lastname)) {
			resultObj = RestfulUtils.createErrResult(ResultCode.SYS_PARAM_MISS.getCode(), ResultCode.SYS_PARAM_MISS.getDesc());
		}
		lastname = EmojiParser.parseToAliases(lastname);
		resultObj = cubeMarketingService.sendVerificationCode(mobilephone, lastname, type);
		return SUCCESS;
	}
	
	public String getMemberByContactid() {
		List<CubeMember> memberList = cubeMemberService.findByWhere("ORIGINAL_CONTACTID='" + contactid + "'", null, 0, 0);
		CubeCustomer cubeCustomer = cubeCustomerService.get(contactid);
		if (memberList != null && memberList.size()>0 && cubeCustomer != null) {
			JSONObject jsonObject = JSONObject.parseObject(JSON.toJSONString(memberList.get(0)));
			jsonObject.put("lastname", cubeCustomer.getLastname());
			this.resultMap = ResultUtils.createOkResult(jsonObject);
		} else {
			this.resultMap = ResultUtils.createErrResult();
		}
		return SUCCESS;
	}

	
	
	
	
	public Long getMemberId() {
		return memberId;
	}

	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}

	public String getContactid() {
		return contactid;
	}

	public void setContactid(String contactid) {
		this.contactid = contactid;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public CubeMemberCriteria getCubeMemberCriteria() {
		return cubeMemberCriteria;
	}

	public void setCubeMemberCriteria(CubeMemberCriteria cubeMemberCriteria) {
		this.cubeMemberCriteria = cubeMemberCriteria;
	}

	public String getMemberQuery() {
		return memberQuery;
	}

	public void setMemberQuery(String memberQuery) {
		this.memberQuery = memberQuery;
	}

	public String getVehicleQuery() {
		return vehicleQuery;
	}

	public void setVehicleQuery(String vehicleQuery) {
		this.vehicleQuery = vehicleQuery;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getMobilephone() {
		return mobilephone;
	}

	public void setMobilephone(String mobilephone) {
		this.mobilephone = mobilephone;
	}

	public Long getOrganizerId() {
		return organizerId;
	}

	public void setOrganizerId(Long organizerId) {
		this.organizerId = organizerId;
	}

	public HashMap<String, Object> getResultMap() {
		return resultMap;
	}

	public void setResultMap(HashMap<String, Object> resultMap) {
		this.resultMap = resultMap;
	}

	public InputStream getExcelStream() {
		return excelStream;
	}

	public void setExcelStream(InputStream excelStream) {
		this.excelStream = excelStream;
	}

	public String getContentDisposition() {
		return contentDisposition;
	}

	public void setContentDisposition(String contentDisposition) {
		this.contentDisposition = contentDisposition;
	}

	public String getColumnFields() {
		return columnFields;
	}

	public void setColumnFields(String columnFields) {
		this.columnFields = columnFields;
	}

	public String getColumnFieldsTrans() {
		return columnFieldsTrans;
	}

	public void setColumnFieldsTrans(String columnFieldsTrans) {
		this.columnFieldsTrans = columnFieldsTrans;
	}

	public Map<String, Object> getDataMap() {
		return dataMap;
	}

	public void setDataMap(Map<String, Object> dataMap) {
		this.dataMap = dataMap;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getMemberLevel() {
		return memberLevel;
	}

	public void setMemberLevel(int memberLevel) {
		this.memberLevel = memberLevel;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public JSONObject getResultObj() {
		return resultObj;
	}

	public void setResultObj(JSONObject resultObj) {
		this.resultObj = resultObj;
	}

	public String getExportTaskName() {
		return exportTaskName;
	}

	public void setExportTaskName(String exportTaskName) {
		this.exportTaskName = exportTaskName;
	}

	public String getExportRemark() {
		return exportRemark;
	}

	public void setExportRemark(String exportRemark) {
		this.exportRemark = exportRemark;
	}

}
