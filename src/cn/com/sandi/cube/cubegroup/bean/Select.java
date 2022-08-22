package cn.com.sandi.cube.cubegroup.bean;
/**
 * 
 * @author Hogan
 *
 */
public class Select extends Param{
//	//cube_condition表的主键,可以找到对应的一条数据, 可得大于,小于,等于,介于
//	private String conditionId;
	
	//具体值,用于 大于, 小于, 等于
	private String value;
	
	//多个具体值,中间用逗号隔开
	private String valueList;

//	public String getConditionId() {
//		return conditionId;
//	}
//
//	public void setConditionId(String conditionId) {
//		this.conditionId = conditionId;
//	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getValueList() {
		return valueList;
	}

	public void setValueList(String valueList) {
		this.valueList = valueList;
	}
	
	
}
