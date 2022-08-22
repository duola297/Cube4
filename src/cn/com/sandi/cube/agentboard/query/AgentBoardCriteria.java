package cn.com.sandi.cube.agentboard.query;

import cn.com.sandi.common.query.PageQueryCriteria;

public class AgentBoardCriteria extends PageQueryCriteria {
	
	private Long tenantsId;
	private Long organizerId;
	private Long userId;
	private String agentId;
	private String wechatAgentId;
	private Long appModuleId;
	
	public Long getUserId() {
		return userId;
	}
	
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	public Long getOrganizerId() {
		return organizerId;
	}
	
	public void setOrganizerId(Long organizerId) {
		this.organizerId = organizerId;
	}
	
	public Long getTenantsId() {
		return tenantsId;
	}
	
	public void setTenantsId(Long tenantsId) {
		this.tenantsId = tenantsId;
	}

	public String getAgentId() {
		return agentId;
	}

	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}

	public String getWechatAgentId() {
		return wechatAgentId;
	}

	public void setWechatAgentId(String wechatAgentId) {
		this.wechatAgentId = wechatAgentId;
	}

	public Long getAppModuleId() {
		return appModuleId;
	}

	public void setAppModuleId(Long appModuleId) {
		this.appModuleId = appModuleId;
	}
}
