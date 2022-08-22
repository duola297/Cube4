package cn.com.sandi.cube.agentboard.service;

import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONObject;
import cn.com.sandi.cube.agentboard.query.AgentBoardCriteria;

public interface AgentBoardRealTimeService {

	public JSONObject getAgentCallInfo(JSONObject jsonObject);

	public JSONObject getAgentWxInfo(JSONObject jsonObject);

	public HashMap<String, Object> getAgentWxInfo(AgentBoardCriteria agentBoardCriteria);

	public HashMap<String, Object> getAgentCus(AgentBoardCriteria agentBoardCriteria);

	public HashMap<String, Object> getAgentModultInfo(AgentBoardCriteria agentBoardCriteria, String moduleName, boolean isMonitor);
	
	public JSONObject getNetSvrData(JSONObject jsonObject);
	
	public JSONObject getNetAcdMaxData(JSONObject jsonObject);

	public List<HashMap<String, Object>> getAgentSvrDataList(JSONObject jsonObject);

}
