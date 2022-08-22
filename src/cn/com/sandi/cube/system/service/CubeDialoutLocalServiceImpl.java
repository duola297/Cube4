package cn.com.sandi.cube.system.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.com.sandi.common.generic.GenericDao;
import cn.com.sandi.common.generic.GenericServiceImpl;
import cn.com.sandi.cube.system.model.CubeDialoutLocal;
import cn.com.sandi.framework.security.web.SecurityUserHolder;

public class CubeDialoutLocalServiceImpl extends GenericServiceImpl<CubeDialoutLocal, Long> implements CubeDialoutLocalService {

	public CubeDialoutLocalServiceImpl(
			GenericDao<CubeDialoutLocal, Long> genericDao) {
		super(genericDao);
		// TODO Auto-generated constructor stub
	}

	//通过号码的前七位查询是否是本地，查询不到默认返回本地（1）
	@Override
	public String queryIsLocalByPhoneNumber(String phoneNumber) {
		Map<String,Object> paramMap=new HashMap<String,Object>();
		paramMap.put("PHONENUM",phoneNumber);
		paramMap.put("TENANTS_ID", SecurityUserHolder.getCurrentUser().getTenantsId());
		paramMap.put("ORGANIZER_ID", SecurityUserHolder.getCurrentUser().getOrganizerId());
		List<CubeDialoutLocal> list=super.findByWhere("PHONENUM=:PHONENUM AND TENANTS_ID=:TENANTS_ID AND ORGANIZER_ID=:ORGANIZER_ID", paramMap, 0, 20);
		if(list.size()>0){
			return list.get(0).getIsLocal();
		}else{
			return "1";
		}
	}

	@Override
	public void updateDialoutLocal(String phoneNumber, String isLocal) {
		Long tenId=SecurityUserHolder.getCurrentUser().getTenantsId();
		Long orgId=SecurityUserHolder.getCurrentUser().getOrganizerId();
		Map<String,Object> paramMap=new HashMap<String,Object>();
		paramMap.put("TENANTS_ID", tenId);
		paramMap.put("ORGANIZER_ID", orgId);
		paramMap.put("PHONENUM", phoneNumber);
		List<CubeDialoutLocal> list=super.findByWhere("TENANTS_ID=:TENANTS_ID AND ORGANIZER_ID=:ORGANIZER_ID AND PHONENUM=:PHONENUM", paramMap, 0, 20);
		if(list.size()>0){
			if(!list.get(0).getIsLocal().equals(isLocal)){
				 CubeDialoutLocal local=list.get(0);
				 local.setIsLocal(isLocal);
				 super.update(local);
			}
		}else{
			     super.save(new CubeDialoutLocal(phoneNumber, tenId, orgId, isLocal));
		}
	}

}
