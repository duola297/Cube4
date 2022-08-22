package cn.com.sandi.cube.cubemember.model;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
* '预警记录表'
**/
@Entity
@Table(name = "cube_warning_log")
public class CubeWarningLog{
	/**
	 *
	**/
	@Id
	@Column(name = "id")
	private String id;
	/**
	 *
	**/
	@Column(name = "tenants_id")
	private Long tenantsId;
	/**
	 *
	**/
	@Column(name = "organizer_id")
	private Long organizerId;
	/**
	 *
	**/
	@Column(name = "member_id")
	private Long memberId;
	/**
	 *
	**/
	@Column(name = "contactid")
	private String contactid;
	/**
	 *
	**/
	@Column(name = "member_no")
	private String memberNo;
	/**
	 * '预警日期'
	**/
	@Column(name = "create_date")
	private Date createDate;
	/**
	 * '生成记录的id，-1：系统'
	**/
	@Column(name = "create_id")
	private Long createId;
	/**
	 *
	**/
	@Column(name = "create_name")
	private String createName;
	/**
	 * '预警原因，1：超过推荐注册频率'
	**/
	@Column(name = "reason")
	private Integer reason;
	/**
	 * '将具体的预警原因存起来，比如今天60分钟推荐50人，明天60分钟推荐80个人。。。'
	**/
	@Column(name = "reason_text")
	private String reasonText;
	
	
	public CubeWarningLog() {
		super();
	}
	public CubeWarningLog(String id, Long tenantsId, Long organizerId, Long memberId, String contactid, String memberNo,
			Date createDate, Long createId, String createName, Integer reason, String reasonText) {
		super();
		this.id = id;
		this.tenantsId = tenantsId;
		this.organizerId = organizerId;
		this.memberId = memberId;
		this.contactid = contactid;
		this.memberNo = memberNo;
		this.createDate = createDate;
		this.createId = createId;
		this.createName = createName;
		this.reason = reason;
		this.reasonText = reasonText;
	}
	public String getId() {
		return this.id;
	}
	public void setId (String id){
		this.id = id;
	}
	public Long getTenantsId() {
		return this.tenantsId;
	}
	public void setTenantsId (Long tenantsId){
		this.tenantsId = tenantsId;
	}
	public Long getOrganizerId() {
		return this.organizerId;
	}
	public void setOrganizerId (Long organizerId){
		this.organizerId = organizerId;
	}
	public Long getMemberId() {
		return this.memberId;
	}
	public void setMemberId (Long memberId){
		this.memberId = memberId;
	}
	public String getContactid() {
		return this.contactid;
	}
	public void setContactid (String contactid){
		this.contactid = contactid;
	}
	public String getMemberNo() {
		return this.memberNo;
	}
	public void setMemberNo (String memberNo){
		this.memberNo = memberNo;
	}
	public Date getCreateDate() {
		return this.createDate;
	}
	public void setCreateDate (Date createDate){
		this.createDate = createDate;
	}
	public Long getCreateId() {
		return this.createId;
	}
	public void setCreateId (Long createId){
		this.createId = createId;
	}
	public String getCreateName() {
		return this.createName;
	}
	public void setCreateName (String createName){
		this.createName = createName;
	}
	public Integer getReason() {
		return this.reason;
	}
	public void setReason (Integer reason){
		this.reason = reason;
	}
	public String getReasonText() {
		return this.reasonText;
	}
	public void setReasonText (String reasonText){
		this.reasonText = reasonText;
	}
}