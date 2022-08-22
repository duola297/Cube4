package cn.com.sandi.cube.cubevehicle.service;

import cn.com.sandi.common.generic.GenericDao;
import cn.com.sandi.common.generic.GenericServiceImpl;
import cn.com.sandi.cube.cubevehicle.model.CubeVehicleCus;

public class CubeVehicleCusServiceImpl extends GenericServiceImpl<CubeVehicleCus, String> implements CubeVehicleCusService {

	public CubeVehicleCusServiceImpl(GenericDao<CubeVehicleCus, String> genericDao) {
		super(genericDao);
	}

}
