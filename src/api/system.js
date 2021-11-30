import  { jwtServerInstance }  from './index'
import {getTokenUser} from "@/lib/util"
import qs from  'qs'

//JWT登录认证接口
export const login = (username,password) => {
    return jwtServerInstance.request({
        url:'/authenticate',
        method:'post',
        data:{
            username: username,
            password: password
        }
    })
}

//JWT令牌刷新接口
export const refreshToken = () => {
    return jwtServerInstance.request({
        url:'/refreshToken',
        method:'get'
    })
}

//获取用户信息接口(个人中心)
export const getUserInfo = () => {
    return jwtServerInstance.request({
        url:'/sysUser/info',
        method:'get',
        params:{
            username: getTokenUser()
        }
    })
}

//=====================组织管理接口开始========================
//组织树形列表接口
export const getOrgTree = (orgQueryForm) => {
    return jwtServerInstance.request({
        url:'/sysOrg/tree',
        method:'post',
        data:qs.stringify({
            username: getTokenUser(),
            orgNameLike:orgQueryForm.name,
            orgStatus: orgQueryForm.status
        })
    })
}

//更新组织的一条数据记录
export const updateOrg = (orgForm) => {
    return jwtServerInstance.request({
        url:'/sysOrg/update',
        method:'post',
        data:orgForm
    })
}

//新增一条组织数据记录
export const addOrg = (orgForm) => {
    return jwtServerInstance.request({
        url:'/sysOrg/add',
        method:'post',
        data:orgForm
    })
}

//删除一条组织数据记录
export const deleteOrg = (orgForm) => {
    return jwtServerInstance.request({
        url:'/sysOrg/delete',
        method:'post',
        data:orgForm
    })
}

//更新组织机构的禁用状态
export const changeOrgStatus = (orgId,status) => {
    return jwtServerInstance.request({
        url:'/sysOrg/status/change',
        method:'post',
        data:qs.stringify({
            orgId,
            status
        })
    })
}

//=====================菜单管理接口开始========================
//菜单树形列表接口
export const getMenuTree = (menuQueryForm) => {
    return jwtServerInstance.request({
        url:'/sysMenu/tree',
        method:'post',
        data:qs.stringify({
            menuNameLike:menuQueryForm.name,
            menuStatus: menuQueryForm.status
        })
    })
}

//更新菜单的一条数据记录
export const updateMenu = (menuForm) => {
    return jwtServerInstance.request({
        url:'/sysMenu/update',
        method:'post',
        data:menuForm
    })
}

//新增一条菜单数据记录
export const addMenu = (menuForm) => {
    return jwtServerInstance.request({
        url:'/sysMenu/add',
        method:'post',
        data:menuForm
    })
}

//删除一条菜单数据记录
export const deleteMenu = (menuForm) => {
    return jwtServerInstance.request({
        url:'/sysMenu/delete',
        method:'post',
        data:menuForm
    })
}

//更新菜单的禁用状态
export const changeMenuStatus = (menuId,status) => {
    return jwtServerInstance.request({
        url:'/sysMenu/status/change',
        method:'post',
        data:qs.stringify({
            menuId,
            status
        })
    })
}

//角色管理->分配菜单权限：获取菜单树形结构数据（带勾选节点和默认展开节点）
export const getMenuCheckedTree = (roleId) => {
    return jwtServerInstance.request({
        url:'/sysMenu/checkedTree',
        method:'post',
        data:qs.stringify({
            roleId:roleId
        })
    })
}

//保存菜单树勾选节点(checkedIds是一个数字型数组)
export const saveMenuCheckedKeys = (roleId,checkedIds) => {
    return jwtServerInstance.request({
        url:'/sysMenu/saveKeys',
        method:'post',
        data:{  //RequestBody
            roleId:roleId,
            checkedIds:checkedIds
        }
    })
}

//根据登录用户名加载该用户可以访问的菜单
export const getMenuTreeByUsername = () => {
    return jwtServerInstance.request({
        url:'/sysMenu/tree/user',
        method:'post',
        data:qs.stringify({
            username:getTokenUser()  //从JWT中获取用户名
        })
    })
}

//=====================接口管理开始========================
//接口树形列表接口
export const getApiTree = (apiQueryForm) => {
    return jwtServerInstance.request({
        url:'/sysApi/tree',
        method:'post',
        data:qs.stringify({
            apiNameLike:apiQueryForm.name,
            apiStatus: apiQueryForm.status
        })
    })
}

//更新一条接口数据记录
export const updateApi = (apiForm) => {
    return jwtServerInstance.request({
        url:'/sysApi/update',
        method:'post',
        data:apiForm
    })
}

//新增一条接口数据记录
export const addApi = (apiForm) => {
    return jwtServerInstance.request({
        url:'/sysApi/add',
        method:'post',
        data:apiForm
    })
}

//删除一条接口数据记录
export const deleteApi = (apiForm) => {
    return jwtServerInstance.request({
        url:'/sysApi/delete',
        method:'post',
        data:apiForm
    })
}

//更新api接口的禁用状态
export const changeApiStatus = (apiId,status) => {
    return jwtServerInstance.request({
        url:'/sysApi/status/change',
        method:'post',
        data:qs.stringify({
            apiId,
            status
        })
    })
}

//获取api树形结构数据（带勾选节点和默认展开节点）
export const getApiCheckedTree = (roleId) => {
    return jwtServerInstance.request({
        url:'/sysApi/checkedTree',
        method:'post',
        data:qs.stringify({
            roleId:roleId
        })
    })
}

//保存api树勾选节点(checkedId是一个数字型数组)
export const saveApiCheckedKeys = (roleCode,roleId,checkedIds) => {
    return jwtServerInstance.request({
        url:'/sysApi/saveKeys',
        method:'post',
        data:{
            roleCode:roleCode,
            roleId:roleId,
            checkedIds:checkedIds
        }
    })
}

//=====================角色管理接口开始========================
//角色列表查询接口
export const getRoles = (roleLike) => {
    return jwtServerInstance.request({
        url:'/sysRole/query',
        method:'post',
        data:qs.stringify({
            roleLike:roleLike
        })
    })
}

//更新sys_role的一条数据记录
export const updateRole = (roleForm) => {
    return jwtServerInstance.request({
        url:'/sysRole/update',
        method:'post',
        data:roleForm
    })
}

//新增一条sys_api数据记录
export const addRole = (roleForm) => {
    return jwtServerInstance.request({
        url:'/sysRole/add',
        method:'post',
        data:roleForm
    })
}

//删除一条sys_role数据记录
export const deleteRole = (roleId) => {
    return jwtServerInstance.request({
        url:'/sysRole/delete',
        method:'post',
        data:qs.stringify({
            roleId:roleId
        })
    })
}

//更新角色的禁用状态
export const changeRoleStatus = (roleId,status) => {
    return jwtServerInstance.request({
        url:'/sysRole/status/change',
        method:'post',
        data:qs.stringify({
            roleId,
            status
        })
    })
}

//获取被勾选的角色和所有角色列表
export const getCheckedRoles = (userId) => {
    return jwtServerInstance.request({
        url:'/sysRole/checkedRoles',
        method:'post',
        data:qs.stringify({
            userId:userId
        })
    })
}

//保存用户角色(实际是用户管理的功能)
export const saveCheckedUserRoles = (username,userId,checkedIds) => {
    return jwtServerInstance.request({
        url:'/sysRole/saveKeys',
        method:'post',
        data:{
            username:username,
            userId:userId,
            checkedIds:checkedIds
        }
    })
}

//=====================用户管理接口开始========================
//用户列表查询接口
export const getUsers = (queryForm,pagination) => {
    return jwtServerInstance.request({
        url:'/sysUser/query',
        method:'post',
        data:qs.stringify({
            orgId: queryForm.orgId,
            username: queryForm.username,
            phone: queryForm.phone,
            email: queryForm.email,
            enabled: queryForm.enabled,
            createStartTime: queryForm.timeRange[0],
            createEndTime: queryForm.timeRange[1],
            pageNum: pagination.pageNum,
            pageSize: pagination.pageSize
        })
    })
}

//更新sys_user的一条数据记录
export const updateUser = (userForm) => {
    return jwtServerInstance.request({
        url:'/sysUser/update',
        method:'post',
        data:userForm
    })
}

//新增一条sys_user数据记录
export const addUser = (userForm) => {
    return jwtServerInstance.request({
        url:'/sysUser/add',
        method:'post',
        data:userForm
    })
}

//删除一条sys_user数据记录
export const deleteUser = (username) => {
    return jwtServerInstance.request({
        url:'/sysUser/delete',
        method:'post',
        data:qs.stringify({
            username:username
        })
    })
}

//sys_user数据记录的enabled字段
export const changeEnabled = (username,enabled) => {
    return jwtServerInstance.request({
        url:'/sysUser/enabled/change',
        method:'post',
        data:qs.stringify({
            username,
            enabled
        })
    })
}

//重置用户密码
export const resetUserPwd = (username) => {
    return jwtServerInstance.request({
        url:'/sysUser/pwd/reset',
        method:'post',
        data:qs.stringify({
            username
        })
    })
}

//判断当前用户是否仍在使用默认密码，没做修改
export const pwdIsDefault = () => {
    return jwtServerInstance.request({
        url:'/sysUser/pwd/isDefault',
        method:'post',
        data:qs.stringify({
            username:getTokenUser()
        })
    })
}

//修改密码
export const changeUserPwd = (oldPass,newPass) => {
    return jwtServerInstance.request({
        url:'/sysUser/pwd/change',
        method:'post',
        data:qs.stringify({
            username:getTokenUser(),
            oldPass:oldPass,
            newPass:newPass
        })
    })
}

//=====================配置参数管理接口开始========================
//全局配置参数管理
export const getAllSysConfig = () => {
    return jwtServerInstance.request({
        url:'/sysConfig/all',
        method:'post'
    })
}

//刷新数据库全局配置到服务端内存
//并再次加载全局配置参数到前端
export const refreshSysConfig = () => {
    return jwtServerInstance.request({
        url:'/sysConfig/refresh',
        method:'post'
    })
}

//参数配置列表查询接口
export const getConfig = (configLike) => {
    return jwtServerInstance.request({
        url:'/sysConfig/query',
        method:'post',
        data:qs.stringify({
            configLike:configLike
        })
    })
}

//更新sys_config的一条数据记录
export const updateConfig = (configForm) => {
    return jwtServerInstance.request({
        url:'/sysConfig/update',
        method:'post',
        data:configForm
    })
}

//新增一条sys_config数据记录
export const addConfig = (configForm) => {
    return jwtServerInstance.request({
        url:'/sysConfig/add',
        method:'post',
        data:configForm
    })
}

//删除一条sys_config数据记录
export const deleteConfig = (configId) => {
    return jwtServerInstance.request({
        url:'/sysConfig/delete',
        method:'post',
        data:qs.stringify({
            configId:configId
        })
    })
}

//=====================字典管理接口开始========================
//查询所有数据字典项
export const getAllSysDict = () => {
    return jwtServerInstance.request({
        url:'/sysDict/all',
        method:'post'
    })
}

//参数配置列表查询接口
export const getSysDict =
    ( groupName,
      groupCode ) => {
        return jwtServerInstance.request({
            url:'/sysDict/query',
            method:'post',
            data:qs.stringify({
                groupName,
                groupCode
            })
        })
    }

//更新sys_dict的一条数据记录
export const updateSysDict = (dialogForm) => {
    return jwtServerInstance.request({
        url:'/sysDict/update',
        method:'post',
        data:dialogForm
    })
}

//新增一条sys_dict数据记录
export const addSysDict = (dialogForm) => {
    return jwtServerInstance.request({
        url:'/sysDict/add',
        method:'post',
        data:dialogForm
    })
}

//删除一条sys_dict数据记录
export const deleteSysDict = (deleteId) => {
    return jwtServerInstance.request({
        url:'/sysDict/delete',
        method:'post',
        data:qs.stringify({
            id:deleteId
        })
    })
}