package cn.com.sandi.cube.cubeconsult.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import cn.com.sandi.common.generic.GenericDao;
import cn.com.sandi.common.generic.GenericServiceImpl;
import cn.com.sandi.common.query.Query;
import cn.com.sandi.cube.comment.model.Message;
import cn.com.sandi.cube.comment.model.MessageUsers;
import cn.com.sandi.cube.comment.service.MessageService;
import cn.com.sandi.cube.common.CollectionUtil;
import cn.com.sandi.cube.common.JsonUtil;
import cn.com.sandi.cube.common.Result;
import cn.com.sandi.cube.common.SqlConstants;
import cn.com.sandi.cube.commonAction.service.CommonService;
import cn.com.sandi.cube.cubeSite.service.CubeSiteService;
import cn.com.sandi.cube.cubeconsult.model.AssignConsult;
import cn.com.sandi.cube.cubeconsult.model.CubeConsult;
import cn.com.sandi.cube.cubeconsult.model.CubeConsultLog;
import cn.com.sandi.cube.cubeconsult.model.CubeConsultRelation;
import cn.com.sandi.cube.cubeconsult.model.UserModel;
import cn.com.sandi.cube.cubeconsult.query.CubeConsultCriteria;
import cn.com.sandi.cube.cubeconsult.util.Constants;
import cn.com.sandi.cube.cubecustomer.service.CubeCustomerService;
import cn.com.sandi.cube.sysdistribution.service.AllocateService;
import cn.com.sandi.cube.userinterface.service.UserInterfaceService;
import cn.com.sandi.framework.organizer.service.OrganizerInfoService;
import cn.com.sandi.framework.security.model.FunctionInfo;
import cn.com.sandi.framework.security.model.UserInfo;
import cn.com.sandi.framework.security.service.FunctionInfoService;
import cn.com.sandi.framework.security.service.UserInfoService;
import cn.com.sandi.framework.security.web.SecurityUserHolder;

public class CubeConsultServiceImpl extends GenericServiceImpl<CubeConsult, Long> implements CubeConsultService {

	public CubeConsultServiceImpl(GenericDao<CubeConsult, Long> genericDao) {
		super(genericDao);
	}

	@Resource
	private UserInfoService userInfoService;
	@Resource
	private UserInterfaceService userInterfaceService;
	@Resource
	private AllocateService<AssignConsult, UserModel> allocateService;
	@Resource
	private Query query;
	@Resource
	private CubeConsultClassService cubeConsultClassService;
	@Resource
	private FunctionInfoService functionInfoService;
	@Resource
	private MessageService messageService;
	@Resource
	private CubeConsultLogService cubeConsultLogService;
	@Resource
	private CubeCustomerService cubeCustomerService;
	@Resource
	private OrganizerInfoService organizerInfoService;
	@Resource
	private CubeSiteService cubeSiteService;
	@Resource
	private CommonService commonService;
	@Resource
	private CubeConsultRelationService cubeConsultRelationService;

	@Override
	public String deleteConsultByConsultId(long tenantsId, long organizerId, List<String> consultIdList) {
		StringBuffer idList = new StringBuffer("CONSULT_ID IN (");
		for (int i = 0; i < consultIdList.size(); i++) {
			if (i == consultIdList.size() - 1) {
				idList.append(consultIdList.get(i));
			} else if ((i % 999) == 0 && i > 0) {
				idList.append(consultIdList.get(i)).append(") OR CONSULT_ID IN (");
			} else {
				idList.append(consultIdList.get(i)).append(",");
			}
		}
		idList.append(")");
		String idListStr = idList.toString();
		int num = 0;
		num = super.deleteByWhere("TENANTS_ID = " + tenantsId + " AND (" + idListStr + ")", null);
		cubeConsultClassService.deleteByWhere("TENANTS_ID = " + tenantsId + " AND (" + idListStr + ")", null);
		cubeConsultRelationService.deleteByWhere("TENANTS_ID = " + tenantsId + " AND (" + idListStr + ")", null);
		if (num > 0) {
			return "1";
		} else {
			return "0";
		}
	}

	/**
	 * 1.保存自身信息
	 * 2.保存分类信息 
	 * 3.保存关系
	 */
	@Override
	public Result<Object> saveConsult(String sysColumnValue, boolean assignNoticeRight, boolean isCubeCallCenterRight) {
		Date now = new Date();
		UserInfo userInfo = SecurityUserHolder.getCurrentUser();
		JSONObject sysColumnValueJson = JSONObject.fromObject(sysColumnValue);
		CubeConsult cubeConsult = new CubeConsult();
		long tenantsId = userInfo.getTenantsId();
		long organizerId = userInfo.getOrganizerId();
		// 处理分类
		List<String> classIdList = new ArrayList<String>();
		if (sysColumnValueJson.containsKey("consultClass")) {
			String classId = sysColumnValueJson.get("consultClass").toString();
			String[] classes = StringUtils.split(classId, ",");
			classIdList.addAll(new ArrayList<String>(Arrays.asList(classes)));
			sysColumnValueJson.remove("consultClass");
			sysColumnValue = sysColumnValueJson.toString();
		}
		long handerId = 0;
		if (sysColumnValueJson.containsKey("handleId")) {
			if (StringUtils.isNotBlank(sysColumnValueJson.getString("handleId"))
					&& StringUtils.isNumeric(sysColumnValueJson.getString("handleId"))) {
				handerId = sysColumnValueJson.getLong("handleId");
			}
		}

		Long dealerOrganizer = null;
		if (sysColumnValueJson.containsKey("dealerCode") && !"".equals(sysColumnValueJson.getString("dealerCode"))) {
			dealerOrganizer = sysColumnValueJson.getLong("dealerCode");
		}

		// 字段转换
		cubeConsult = (CubeConsult) JsonUtil.jsonToModel(sysColumnValue, cubeConsult);

		if (!isCubeCallCenterRight) {
			cubeConsult.setHandleOrgId(null);
		} else {
			cubeConsult.setHandleOrgId(dealerOrganizer);
		}
		// 如果选择了4s店，则设置分派标识为1
		if (cubeConsult.getHandleOrgId() != null) {
			cubeConsult.setAssignFlag((short) 1);
			cubeConsult.setHandleOrgName(organizerInfoService.get(cubeConsult.getHandleOrgId()).getOrganizerName());
		}
		short consultstate = cubeConsult.getConsultState();
		if (consultstate == 2) {
			cubeConsult.setDealTime(now);
			cubeConsult.setFinishTime(now);
			cubeConsult.setIsClose((short) 1);
		} else if (consultstate == 1) {
			cubeConsult.setDealTime(now);
		}
		// 设置超时时间
		HashMap<String, Object> map = commonService.getCubeOrganizerConfigByFieldKey(tenantsId, organizerId,
				Constants.CUBE_CONSULT_OVER_TIME);
		if (map != null) {
			Long times = Math.round(Double.parseDouble(map.get("FIELD_VALUE").toString()) * 60 * 60 * 1000);
			cubeConsult.setOverTime(new Date(now.getTime() + times));
		}

		cubeConsult = super.save(cubeConsult);
		// 保存处理组织关系
		if (isCubeCallCenterRight) {
			cubeConsultRelationService.saveOrganizerByCenter(tenantsId, organizerId, cubeConsult.getConsultId(),
					handerId, cubeConsult.getHandleOrgId());
		} else {
			// 自己建的都是为一
			cubeConsultRelationService.saveOrganizer(tenantsId, organizerId, cubeConsult.getConsultId(),
					Constants.RELATION_TYPE_CENTER, handerId);
		}
		if (CollectionUtil.isNotEmpty(classIdList)) {
			cubeConsultClassService.saveConsultClassList(classIdList, cubeConsult.getConsultId(),
					Constants.CONSULT_CLASS_TYPE);
		}
		return Result.success(cubeConsult, "保存客户咨询成功！");
	}

	/**
	 * 1.更新自身信息
	 * 2.更新分类信息
	 * 3.更新关系
	 */
	@Override
	public Result<Object> updateConsult(Long autoId, String sysColumnValue, boolean assignNoticeRight,
			boolean isCubeCallCenterRight) {
		Date now = new Date();
		CubeConsult cubeConsult = super.get(autoId);
		if (cubeConsult == null) {
			return Result.error("该客户咨询已经被删除！");
		}
		UserInfo userInfo = SecurityUserHolder.getCurrentUser();
		JSONObject sysColumnValueJson = JSONObject.fromObject(sysColumnValue);
		long tenantsId = userInfo.getTenantsId();
		long organizerId = userInfo.getOrganizerId();
		// 处理分类
		List<String> classIdList = new ArrayList<String>();
		if (sysColumnValueJson.containsKey("CONTACTID")) {
			sysColumnValueJson.remove("CONTACTID");
			sysColumnValue = sysColumnValueJson.toString();
		}
		if (sysColumnValueJson.containsKey("consultClass")) {
			String classId = sysColumnValueJson.get("consultClass").toString();
			String[] classes = StringUtils.split(classId, ",");
			classIdList.addAll(new ArrayList<String>(Arrays.asList(classes)));
			sysColumnValueJson.remove("consultClass");
			sysColumnValue = sysColumnValueJson.toString();
		}
		long handerId = 0;
		if (sysColumnValueJson.containsKey("handleId")) {
			if (StringUtils.isNotBlank(sysColumnValueJson.getString("handleId"))
					&& StringUtils.isNumeric(sysColumnValueJson.getString("handleId"))) {
				handerId = sysColumnValueJson.getLong("handleId");
			}
		}

		Long dealerOrganizer = null;
		if (sysColumnValueJson.containsKey("dealerCode") && !"".equals(sysColumnValueJson.getString("dealerCode"))) {
			dealerOrganizer = sysColumnValueJson.getLong("dealerCode");
		}
		// 处理组织关系
		cubeConsultRelationService.updateOrganizerHandler(tenantsId, organizerId, autoId, handerId);
		if (isCubeCallCenterRight) {

			if (!Objects.equals(dealerOrganizer, cubeConsult.getHandleOrgId()) && dealerOrganizer != null) {
				cubeConsultRelationService.updateHandleOrganizer(tenantsId, dealerOrganizer, autoId);
				cubeConsult.setHandleOrgId(dealerOrganizer);
				cubeConsult.setAssignFlag((short) 1);
				cubeConsult.setHandleOrgName(organizerInfoService.get(dealerOrganizer).getOrganizerName());
			}
			if (dealerOrganizer == null) {
				cubeConsult.setHandleOrgId(null);
				cubeConsult.setHandleOrgName(null);
				cubeConsult.setAssignFlag((short) 0);
			}
		}
		Short oldConsultState = cubeConsult.getConsultState();
		cubeConsult = (CubeConsult) JsonUtil.jsonToModel(sysColumnValue, cubeConsult);
		if (cubeConsult.getHandleOrgId() != null) {
			cubeConsult.setHandleOrgName(organizerInfoService.get(cubeConsult.getHandleOrgId()).getOrganizerName());
		}
		short newConsultstate = cubeConsult.getConsultState();
		if (oldConsultState != 2 && newConsultstate == 2) {
			if (cubeConsult.getDealTime() == null) {
				cubeConsult.setDealTime(now);
			}
			cubeConsult.setIsClose((short) 1);
			cubeConsult.setFinishTime(now);
		} else if (newConsultstate != 2) {
			cubeConsult.setFinishTime(null);
			if (newConsultstate == 1 && cubeConsult.getDealTime() == null) {// 设置处理时间
				cubeConsult.setDealTime(now);
			}
		}

		super.update(cubeConsult);
		// 保存服务工单相关的服务分类
		if (CollectionUtil.isNotEmpty(classIdList)) {
			cubeConsultClassService.saveConsultClassList(classIdList, cubeConsult.getConsultId(),
					Constants.CONSULT_CLASS_TYPE);
		}
		return Result.success(cubeConsult, "修改成功！");
	}

	@Override
	public String acceptConsult(Long tenantsId, Long organizerId, Long userId, String userName,
			List<String> consultIdList) {
		StringBuffer idList = new StringBuffer("CONSULT_ID IN (");
		for (int i = 0; i < consultIdList.size(); i++) {
			if (i == consultIdList.size() - 1) {
				idList.append(consultIdList.get(i));
			} else if ((i % 999) == 0 && i > 0) {
				idList.append(consultIdList.get(i)).append(") OR CONSULT_ID IN (");
			} else {
				idList.append(consultIdList.get(i)).append(",");
			}
		}
		idList.append(")");
		String idListStr = idList.toString();
		int num = 0;
		List<CubeConsultRelation> cubeConsultRelationList = cubeConsultRelationService
				.findByWhere("(" + idListStr + ") AND IS_ACCEPT=0 AND ORGANIZER_ID= " + organizerId, null, -1, -1);
		if (cubeConsultRelationList != null && cubeConsultRelationList.size() > 0) {
			cubeConsultLogService.updateConsultLog(userId, userName, cubeConsultRelationList);
		}
		num = cubeConsultRelationService.updateByWhere(" HANDLE_ID=" + userId + ", HANDLE_NAME='" + userName + "'",
				"ORGANIZER_ID=" + organizerId + " AND (" + idListStr + ") ", null);
		if (num > 0) {
			return "1";
		} else {
			return "0";
		}
	}

	@Override
	public String transferConsult(List<String> consultIdList, String transferUserId) {
		StringBuffer idList = new StringBuffer("CONSULT_ID IN (");
		for (int i = 0; i < consultIdList.size(); i++) {
			if (i == consultIdList.size() - 1) {
				idList.append(consultIdList.get(i));
			} else if ((i % 999) == 0 && i > 0) {
				idList.append(consultIdList.get(i)).append(") OR CONSULT_ID IN (");
			} else {
				idList.append(consultIdList.get(i)).append(",");
			}
		}
		idList.append(")");
		String idListStr = idList.toString();
		Long tenantsId = SecurityUserHolder.getCurrentUser().getTenantsId();
		Long organizerId = SecurityUserHolder.getCurrentUser().getOrganizerId();
		String userName = null;
		int num = 0;
		if (transferUserId == null || transferUserId.equals("")) {
			num = cubeConsultRelationService.updateByWhere("HANDLE_ID=0, HANDLE_NAME=NULL ",
					"(" + idListStr + ")  AND TENANTS_ID=" + tenantsId + " AND ORGANIZER_ID= " + organizerId, null);
		} else {
			userName = userInfoService.findByWhere(
					"USER_ID=" + transferUserId + " AND TENANTS_ID=" + tenantsId + " AND ORGANIZER_ID=" + organizerId,
					null, -1, -1).get(0).getUserName();
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("HANDLE_ID", transferUserId);
			map.put("HANDLE_NAME", userName);
			num = cubeConsultRelationService.updateByWhere("HANDLE_ID=:HANDLE_ID, HANDLE_NAME=:HANDLE_NAME",
					"(" + idListStr + ") AND TENANTS_ID=" + tenantsId + " AND ORGANIZER_ID= " + organizerId, map);
		}
		if (num > 0) {
			return "1";
		} else {
			return "0";
		}
	}

	@Override
	public JSONArray getAllUser() {
		JSONArray jsonarray = new JSONArray();
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("TENANTS_ID", SecurityUserHolder.getCurrentUser().getTenantsId());
		paramMap.put("ORGANIZER_ID", SecurityUserHolder.getCurrentUser().getOrganizerId());
		paramMap.put("isValid", "Y");
		paramMap.put("isAdmin", "N");
		List<UserInfo> userinfoList = userInfoService.findByWhere(
				"TENANTS_ID=:TENANTS_ID AND ORGANIZER_ID =:ORGANIZER_ID and IS_VALID=:isValid and IS_ADMIN=:isAdmin ORDER BY USER_NAME",
				paramMap, -1, -1);
		JSONObject json = null;
		for (UserInfo user : userinfoList) {
			json = new JSONObject();
			json.put("USER_ID", user.getUserId());
			json.put("USER_NAME", user.getUserName());
			jsonarray.add(json);
		}
		return jsonarray;
	}

	@Override
	public List<AssignConsult> allocateConsult(List<String> consultIdList, List<UserModel> allocateUserList,
			String assignType) {
		List<AssignConsult> assignConsultList = new ArrayList<AssignConsult>();
		AssignConsult assignConsult = null;
		for (String consultId : consultIdList) {
			assignConsult = new AssignConsult();
			assignConsult.setConsultId(new Long(consultId));
			assignConsultList.add(assignConsult);
		}
		if (assignType.equals("avg")) {
			assignConsultList = allocateService.avgAllocate(assignConsultList, allocateUserList);
		} else if (assignType.equals("ratio")) {
			assignConsultList = allocateService.ratioAllocate(assignConsultList, allocateUserList);
		} else if (assignType.equals("point")) {
			for (int i = 0; i < assignConsultList.size(); i++) {
				assignConsultList.get(i).setInchargeUserId(allocateUserList.get(0).getUserId());
			}
		}
		return assignConsultList;
	}

	@Override
	public JSONArray backUserList(List<AssignConsult> assignConsultList, List<UserModel> allocateUserList) {
		JSONArray jsonarray = new JSONArray();
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("TENANTS_ID", SecurityUserHolder.getCurrentUser().getTenantsId());
		paramMap.put("ORGANIZER_ID", SecurityUserHolder.getCurrentUser().getOrganizerId());
		paramMap.put("isValid", "Y");
		paramMap.put("isAdmin", "N");
		JSONObject json = null;
		Long allocateNum = 0L;
		for (UserModel user : allocateUserList) {
			allocateNum = 0L;
			for (AssignConsult consult : assignConsultList) {
				if (consult.getInchargeUserId().longValue() == user.getUserId().longValue()) {
					allocateNum = allocateNum + 1L;
				}
			}
			if (allocateNum > 0L) {
				json = new JSONObject();
				json.put("USER_ID", user.getUserId());
				json.put("USER_NAME", user.getUserName());
				json.put("ALLOCATE_NUM", allocateNum);
				jsonarray.add(json);
			}
		}
		return jsonarray;
	}

	@Override
	public String allocateResultUser(List<AssignConsult> assignConsultList, boolean assignNoticeRight,
			String assignChannels) {
		Long selfUserId = SecurityUserHolder.getCurrentUser().getUserId();
		StringBuffer sbWhere = new StringBuffer("FUNC_FLAG='");
		sbWhere.append(Constants.CUBE_CONSULT).append("'");
		List<FunctionInfo> funList = functionInfoService.findByWhere(sbWhere.toString(), null, 0, 1);
		if (CollectionUtil.isEmpty(funList)) {
			return "0";
		}
		Long tenantsId = SecurityUserHolder.getCurrentUser().getTenantsId();
		Long organizerId = SecurityUserHolder.getCurrentUser().getOrganizerId();
		Long funcId = funList.get(0).getFuncId();
		Message message;
		MessageUsers messageUsers;
		Date now = new Date();
		UserInfo userInfo;
		CubeConsultRelation relation;
		CubeConsultLog cubeConsultLog;
		for (AssignConsult assignConsult : assignConsultList) {
			userInfo = userInfoService.get(assignConsult.getInchargeUserId());
			if (assignNoticeRight && !assignConsult.getInchargeUserId().toString().equals(selfUserId.toString())) {
				message = new Message();
				messageUsers = new MessageUsers();
				message.setSenderId(selfUserId);
				message.setSendTime(now);
				message.setContent("你有一条客户咨询分派消息，单号：" + assignConsult.getConsultId());
				message.setType(2L);
				message.setData("appRecordId=" + assignConsult.getConsultId() + "&criteria.appModuleId=" + funcId);
				message.setOrganizerId(userInfo.getOrganizerId());
				message.setTenantsId(userInfo.getTenantsId());
				message.setIsValid(1L);
				message.setLabel("客户咨询");
				messageUsers = new MessageUsers();
				messageUsers.setReceiverId(userInfo.getUserId());
				messageUsers.setIsView(0L);
				messageUsers.setOrganizerId(userInfo.getOrganizerId());
				messageUsers.setTenantsId(userInfo.getTenantsId());
				messageService.saveMessage(message, messageUsers);
			}
			relation = cubeConsultRelationService.getCubeConsultRelation(tenantsId, organizerId,
					assignConsult.getConsultId());
			if (relation != null) {
				cubeConsultLog = cubeConsultLogService.saveCubeConsultLog(relation, userInfo, assignChannels);
				relation.setHandleId(userInfo.getUserId());
				relation.setHandleName(userInfo.getUserName());
				relation.setIsAccept((short) 0);
				relation.setConsultSubId(cubeConsultLog.getConsultSubId());
				cubeConsultRelationService.update(relation);
			}
		}
		return "1";

	}

	@SuppressWarnings("unchecked")
	@Override
	public String getConsultById(CubeConsultCriteria cubeConsultCriteria) {
		List<HashMap<String, Object>> list = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_BY_ID,
				cubeConsultCriteria);
		if (list.size() > 0) {
			cubeConsultCriteria.setConsultId(Long.parseLong(list.get(0).get("CONSULT_ID").toString()));
			List<HashMap<String, Object>> classList = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_CLASS,
					cubeConsultCriteria);
			List<JSONObject> jsonList = new ArrayList<JSONObject>();
			if (classList.size() > 0) {
				JSONObject consultClass = new JSONObject();
				String name = "";
				for (int j = 0; j < classList.size(); j++) {
					if (Constants.CONSULT_CLASS_TYPE.toString()
							.equals(classList.get(j).get("BUSINESS_TYPE_ID").toString())) {
						consultClass = new JSONObject();
						name = classList.get(j).get("NAME").toString();
//						name = name.substring(0, name.length() - 1);
						consultClass.accumulate("classId", classList.get(j).get("CLASS_ID"));
						consultClass.accumulate("className", classList.get(j).get("CLASS_NAME"));
						consultClass.accumulate("classStandardName", name);
						jsonList.add(consultClass);
					}
				}

			}
			list.get(0).put("CONSULT_CLASS", jsonList);

		}
		// 查询该表的所有字段的字段名
		JSONObject json = userInterfaceService.getReadModeConfig(list, Constants.CUBE_CONSULT.toUpperCase());
		json.put("cusDetail", list);
		return json.toString();
	}

	@SuppressWarnings("unchecked")
	public JSONObject getConsultDetailById(CubeConsultCriteria cubeConsultCriteria) {
		JSONObject consultDetail = new JSONObject();
		List<HashMap<String, Object>> list = query.queryForList(SqlConstants.SERVE_GET_SERVE_BYID, cubeConsultCriteria);
		if (list.size() > 0) {
			cubeConsultCriteria.setConsultId(Long.parseLong(list.get(0).get("CONSULT_ID").toString()));
			List<HashMap<String, Object>> classList = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_CLASS,
					cubeConsultCriteria);
			List<JSONObject> jsonList = new ArrayList<JSONObject>();
			if (classList.size() > 0) {
				JSONObject consultClass = new JSONObject();
				for (int j = 0; j < classList.size(); j++) {
					//// 只有一颗树时没必要判断类型
					consultClass = new JSONObject();
					consultClass.accumulate("classId", classList.get(j).get("CLASS_ID"));
					consultClass.accumulate("className", classList.get(j).get("CLASS_NAME"));
					jsonList.add(consultClass);
				}
			}
			list.get(0).put("CONSULT_CLASS", jsonList);
		}
		Long moduleId = userInterfaceService.getModuleIdByName(Constants.CUBE_CONSULT);
		JSONObject tableStruct = userInterfaceService.getTableStruct(moduleId);
		consultDetail.put("cusDetail", list);
		consultDetail.put("tableStruct", tableStruct);
		return consultDetail;
	};

	@SuppressWarnings("unchecked")
	@Override
	public String getConsultByIdRom(CubeConsultCriteria cubeConsultCriteria) {
		List<HashMap<String, Object>> list = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_BY_ID_ROM,
				cubeConsultCriteria);
		list = userInterfaceService.exchangeFieldOptionName(cn.com.sandi.cube.common.Constants.CUBE_CONSULT, list);
		if (list.size() > 0) {
			cubeConsultCriteria.setConsultId(Long.parseLong(list.get(0).get("CONSULT_ID").toString()));
			List<HashMap<String, Object>> classList = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_CLASS,
					cubeConsultCriteria);
			String className = "";
			if (classList.size() > 0) {
				String name = "";
				for (int j = 0; j < classList.size(); j++) {
					// 只有一颗树时没必要判断类型
					name = classList.get(j).get("NAME").toString();
//					name = name.substring(0, name.length() - 1);
					className = className + name + ",";
				}
			}
			if (className.length() > 1) {
				className = className.substring(0, className.length() - 1);
			}
			list.get(0).put("CONSULT_CLASS", className);
		}
		// 查询该表的所有字段的字段名
		JSONObject json = userInterfaceService.getReadModeConfig(list, Constants.CUBE_CONSULT.toUpperCase());
		json.put("cusDetail", list);
		return json.toString();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<HashMap<String, Object>> getClassByConsultId(List<HashMap<String, Object>> listData,
			CubeConsultCriteria cubeConsultCriteria) {
		if (listData != null && listData.size() > 0) {
			StringBuffer consultIdList = new StringBuffer("CONSULT_ID IN (");
			for (int i = 0; i < listData.size(); i++) {
				if (i == listData.size() - 1) {
					consultIdList.append(listData.get(i).get("CONSULT_ID"));
				} else if ((i % 999) == 0 && i > 0) {
					consultIdList.append(listData.get(i).get("CONSULT_ID")).append(") OR CONSULT_ID IN (");
				} else {
					consultIdList.append(listData.get(i).get("CONSULT_ID")).append(",");
				}
			}
			consultIdList.append(")");
			cubeConsultCriteria.setConsultIdList(consultIdList.toString());
			cubeConsultCriteria.setConsultId(null);
			List<HashMap<String, Object>> list = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_CLASS,
					cubeConsultCriteria);
			if (list != null && list.size() > 0) {
				String consultId = "";
				String className = "";
				String name = "";
				List<Object> classList = new ArrayList<Object>();
				for (int i = 0; i < listData.size(); i++) {
					consultId = listData.get(i).get("CONSULT_ID").toString();
					className = "";
					classList = new ArrayList<Object>();
					for (int j = 0; j < list.size(); j++) {
						if (consultId.equals(list.get(j).get("CONSULT_ID").toString())) {
							name = list.get(j).get("NAME").toString();
//							name = name.substring(0, name.length() - 1);
							className = className + name + "，";
							classList.add(list.get(j).get("CLASS_ID"));
						}
					}
					if (className.length() > 1) {
						className = className.substring(0, className.length() - 1);
					}
					listData.get(i).put("CONSULT_CLASS", className);
					listData.get(i).put("CONSULT_CLASS_ID", classList);
				}
			} else {
				for (int i = 0; i < listData.size(); i++) {
					listData.get(i).put("CONSULT_CLASS", "");
					listData.get(i).put("CONSULT_CLASS_ID", "");
				}
			}
		}
		return listData;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<HashMap<String, Object>> getConsultComment(List<HashMap<String, Object>> listData,
			CubeConsultCriteria cubeConsultCriteria) {
		if (cubeConsultCriteria == null) {
			cubeConsultCriteria = new CubeConsultCriteria();
			cubeConsultCriteria.setTenantsId(SecurityUserHolder.getCurrentUser().getTenantsId());
			cubeConsultCriteria.setOrganizerId(SecurityUserHolder.getCurrentUser().getOrganizerId());
		}
		if (listData != null && listData.size() > 0) {
			String funcFlag = cn.com.sandi.cube.common.Constants.CUBE_SERVE;
			Long appModuleId = functionInfoService.findByWhere("FUNC_FLAG='" + funcFlag + "'", null, 0, 1).get(0)
					.getFuncId();
			cubeConsultCriteria.setAppModuleId(appModuleId);
			StringBuffer idList = new StringBuffer("APP_RECORD_ID IN (");
			for (int i = 0; i < listData.size(); i++) {
				if (i == listData.size() - 1) {
					idList.append(listData.get(i).get("CONSULT_ID"));
				} else if ((i % 999) == 0 && i > 0) {
					idList.append(listData.get(i).get("CONSULT_ID")).append(") OR APP_RECORD_ID IN (");
				} else {
					idList.append(listData.get(i).get("CONSULT_ID")).append(",");
				}
			}
			idList.append(")");
			String idListStr = idList.toString();
			cubeConsultCriteria.setRecordIdList(idListStr);
			List<HashMap<String, Object>> commentList = query.queryForList(SqlConstants.SQL_COMMENT_GETLIST,
					cubeConsultCriteria);
			if (commentList != null && commentList.size() > 0) {
				String consultId = "";
				String appRecordId = "";
				StringBuffer content;
				for (int i = 0; i < listData.size(); i++) {
					consultId = listData.get(i).get("CONSULT_ID").toString();
					content = new StringBuffer("");
					for (int j = 0; j < commentList.size(); j++) {
						appRecordId = commentList.get(j).get("APP_RECORD_ID").toString();
						if (consultId.equals(appRecordId)) {
							content.append(commentList.get(j).get("USER_NAME")).append(" ")
									.append(commentList.get(j).get("CREATE_TIME")).append("： ")
									.append(commentList.get(j).get("CONTENT")).append("  \n");
						}
					}
					listData.get(i).put("SERVE_COMMENT", content.toString());
				}
			}
		}
		return listData;
	}

	@Override
	public String closeConsult(List<String> idList) {
		if (idList != null && idList.size() > 0) {
			if (idList.size() == 1) {
				CubeConsult cubeConsult = super.get(Long.parseLong(idList.get(0)));
				if (cubeConsult != null) {
					cubeConsult.setIsClose((short) 1);
					super.update(cubeConsult);
				}
			} else {
				StringBuffer idListStrSB = new StringBuffer("CONSULT_ID IN (");
				for (int i = 0; i < idList.size(); i++) {
					if (i == idList.size() - 1) {
						idListStrSB.append(idList.get(i));
					} else if ((i % 999) == 0 && i > 0) {
						idListStrSB.append(idList.get(i)).append(") OR CONSULT_ID IN (");
					} else {
						idListStrSB.append(idList.get(i)).append(",");
					}
				}
				idListStrSB.append(")");
				String idListStr = idListStrSB.toString();
				super.updateByWhere("IS_CLOSE=1", "(" + idListStr + ") ", null);
			}
			return "1";
		} else {
			return "0";
		}
	}

	@Override
	public String closeOrOpenConsult(long id, String sysColumnValue) {
		JSONObject sysColumnValueJson = JSONObject.fromObject(sysColumnValue);
		if (!sysColumnValueJson.containsKey("isClose")) {
			return "0";
		}
		short isClose = Short.parseShort(sysColumnValueJson.getString("isClose"));
		CubeConsult cubeConsult = super.get(id);
		if (cubeConsult != null) {
			cubeConsult.setIsClose(isClose);
			super.update(cubeConsult);
			return "1";
		}
		return "0";
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<HashMap<String, Object>> getConsultListByContactid(String contactid) {
		CubeConsultCriteria cubeConsultCriteria = new CubeConsultCriteria();
		cubeConsultCriteria.setContactid(contactid);
		List<HashMap<String, Object>> list = query.queryForList(SqlConstants.CONSULT_GET_CONSULT_LIST_BY_CONTACTID,
				cubeConsultCriteria);
		list = userInterfaceService.exchangeFieldOptionName(cn.com.sandi.cube.common.Constants.CUBE_CONSULT, list);
		list = getClassByConsultId(list, cubeConsultCriteria);
		return list;
	}

}
