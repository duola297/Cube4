CREATE OR REPLACE function YOUKECUBE.count_layer_with_appModuleId(c_node_Id int , moduleId Long,publicId nvarchar2)
return int
as 
result int := 0;
lft int;
rgt int;
c_count int;
businessTypeId int;
tenantsId Long;
organizerId Long;
begin
    select count(0) into c_count from business_class where node_id=c_node_id;
    if(c_count=1)
    then
        SELECT  node_lft into lft FROM business_class WHERE   node_id = c_node_Id;
        SELECT  node_rgt into rgt FROM business_class WHERE   node_id = c_node_Id;
        SELECT  business_TypeId into businessTypeId FROM business_class WHERE   node_id = c_node_Id;
        SELECT  tenants_Id into tenantsId FROM business_class WHERE   node_id = c_node_Id;
        SELECT  organizer_Id into organizerId FROM business_class WHERE   node_id = c_node_Id;
        if(publicId is not null) then
            SELECT  count(0) into result FROM business_class WHERE   node_lft <= lft  AND node_rgt >= rgt AND is_delete=0 AND business_TypeId = businessTypeId
            AND tenants_Id = tenantsId AND organizer_Id=organizerId AND APP_MODULE_ID=moduleId AND PUBLIC_ID=publicId;
        else
             SELECT  count(0) into result FROM business_class WHERE   node_lft <= lft  AND node_rgt >= rgt AND is_delete=0 AND business_TypeId = businessTypeId
             AND tenants_Id = tenantsId AND organizer_Id=organizerId AND APP_MODULE_ID=moduleId AND PUBLIC_ID IS NULL;
        end if;       
    end if;
    return result;
end;
/
