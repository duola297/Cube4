package cn.com.sandi.cube.cubegroup.query;

import cn.com.sandi.common.query.PageQueryCriteria;
/**
 * 	客群查询单元
 * @author Hogan
 *
 */
public class CubeGroupQueryCriteria  extends PageQueryCriteria{
	private String inSql;//完整的sql语句.

	public String getInSql() {
		return inSql;
	}

	public void setInSql(String inSql) {
		this.inSql = inSql;
	}
	
}
