package cn.com.sandi.cube.mpfoodmanage.vo;

import java.util.List;

import cn.com.sandi.common.query.PageQueryCriteria;

public class FoodAndSpecVo extends PageQueryCriteria{
	private String foodId;
	private String foodInfo;
	private String foodType;
	private String foodName;
	private String isLimit;
	private String limitNum;
	private String supplyWeekDay;
	private String supplyTimeSection;
	private String isPutaway;
	private String isNeedMake;
	private String foodUnits;
	private List<SpecVo> specVoList;
	private String classifyId;
	private String classifyName;
	private String isShow;
	private String showStr;
	private String imagePath;
	private String resetNum;
	private String saleNum;
	private int isOutSale;
	private Integer dailyNum;
	
	
	
	
	public int getIsOutSale() {
		return isOutSale;
	}

	public void setIsOutSale(int isOutSale) {
		this.isOutSale = isOutSale;
	}

	public Integer getDailyNum() {
		return dailyNum;
	}

	public void setDailyNum(Integer dailyNum) {
		this.dailyNum = dailyNum;
	}

	public String getSaleNum() {
		return saleNum;
	}

	public void setSaleNum(String saleNum) {
		this.saleNum = saleNum;
	}

	public String getResetNum() {
		return resetNum;
	}

	public void setResetNum(String resetNum) {
		this.resetNum = resetNum;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getIsShow() {
		return isShow;
	}

	public void setIsShow(String isShow) {
		this.isShow = isShow;
	}

	public String getShowStr() {
		return showStr;
	}

	public void setShowStr(String showStr) {
		this.showStr = showStr;
	}

	public String getClassifyId() {
		return classifyId;
	}

	public void setClassifyId(String classifyId) {
		this.classifyId = classifyId;
	}

	public String getClassifyName() {
		return classifyName;
	}

	public void setClassifyName(String classifyName) {
		this.classifyName = classifyName;
	}

	public String getFoodId() {
		return foodId;
	}

	public void setFoodId(String foodId) {
		this.foodId = foodId;
	}

	public String getFoodInfo() {
		return foodInfo;
	}

	public void setFoodInfo(String foodInfo) {
		this.foodInfo = foodInfo;
	}

	public String getFoodType() {
		return foodType;
	}

	public void setFoodType(String foodType) {
		this.foodType = foodType;
	}

	public String getFoodName() {
		return foodName;
	}

	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}

	public String getIsLimit() {
		return isLimit;
	}

	public void setIsLimit(String isLimit) {
		this.isLimit = isLimit;
	}

	public String getLimitNum() {
		return limitNum;
	}

	public void setLimitNum(String limitNum) {
		this.limitNum = limitNum;
	}

	public String getSupplyWeekDay() {
		return supplyWeekDay;
	}

	public void setSupplyWeekDay(String supplyWeekDay) {
		this.supplyWeekDay = supplyWeekDay;
	}

	public String getSupplyTimeSection() {
		return supplyTimeSection;
	}

	public void setSupplyTimeSection(String supplyTimeSection) {
		this.supplyTimeSection = supplyTimeSection;
	}

	public String getIsPutaway() {
		return isPutaway;
	}

	public void setIsPutaway(String isPutaway) {
		this.isPutaway = isPutaway;
	}

	public String getIsNeedMake() {
		return isNeedMake;
	}

	public void setIsNeedMake(String isNeedMake) {
		this.isNeedMake = isNeedMake;
	}

	public String getFoodUnits() {
		return foodUnits;
	}

	public void setFoodUnits(String foodUnits) {
		this.foodUnits = foodUnits;
	}

	public List<SpecVo> getSpecVoList() {
		return specVoList;
	}

	public void setSpecVoList(List<SpecVo> specVoList) {
		this.specVoList = specVoList;
	}

	public FoodAndSpecVo() {
		// TODO Auto-generated constructor stub
	}

}
