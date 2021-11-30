<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row>
            <el-col :span="4">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>
                <el-tree
                    class="filter-tree"
                    :data="orgData"
                    :props="orgProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterOrg"
                    @node-click="orgNodeClick"
                    ref="orgQueryTree">
                </el-tree>
            </el-col>
            <el-col :span="20">
                <el-card>
                    <el-form ref="userQueryForm" :model="userQueryForm" label-width="80px">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="用户名称" prop="username">
                                    <el-input v-model="userQueryForm.username" placeholder="请输入用户名称"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联系电话" prop="phone">
                                    <el-input v-model="userQueryForm.phone" placeholder="请输入联系电话"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="用户邮箱" prop="email">
                                    <el-input v-model="userQueryForm.email" placeholder="请输入用户邮箱"/>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="用户状态" prop="enabled">
                                    <el-select v-model="userQueryForm.enabled" placeholder="请选择用户状态">
                                        <el-option label="已禁用" value="false"></el-option>
                                        <el-option label="已激活" value="true"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="创建时间" prop="timeRange">
                                    <el-date-picker
                                        v-model="userQueryForm.timeRange"
                                        type="datetimerange"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" :offset="6">
                                <el-form-item>
                                    <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">
                                        查询
                                    </el-button>
                                    <el-button type="primary" plain @click="resetQueryForm('userQueryForm')"
                                               icon="el-icon-refresh">
                                        重置
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                    <el-button type="primary" icon="el-icon-plus" @click="addUserHandler() ">新增</el-button>

                    <el-table :data="tableData" border default-expand-all>
                        <el-table-column prop="username" label="用户名称" align="center"/>
                        <el-table-column prop="orgName" label="所在组织" align="center"/>
                        <el-table-column prop="enabled" label="用户状态" width="200" align="center">
                            <template v-slot="scope">
                                <el-switch
                                    active-text ="已激活"
                                    inactive-text = "已禁用"
                                    v-model="scope.row.enabled"
                                    @change="userStatusChange(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="联系电话" align="center"/>
                        <el-table-column prop="email" label="用户邮箱" width="200" align="center"/>
                        <el-table-column prop="createTime" label="创建时间" width="200" align="center"/>
                        <el-table-column label="操作" width="400" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="small" type="primary" icon="el-icon-edit" @click="editUser(scope.row)">修改
                                </el-button>
                                <el-button size="small" type="danger" icon="el-icon-delete" @click="removeUser(scope.row)">删除
                                </el-button>
                                <el-button size="small" type="success" @click="resetPwd(scope.row)">重置密码</el-button>
                                <el-button size="small" type="success" @click="rolePermission(scope.row)">分配角色</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        :page-sizes="[20, 50, 100]"
                        layout="sizes, prev, pager, next, total, jumper"
                        :current-page="pagination.pageNum"
                        :page-size="pagination.pageSize"
                        :total="pagination.total"
                        @size-change="handlePageSizeChange"
                        @current-change="handlePageNumChange"
                        background>
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClosed">
            <el-alert
                :title= "alertInfo"
                type="error"
                :closable="false" style="margin-bottom: 20px">
            </el-alert>
            <el-form :model="publicForm" ref="publicFormRef"
                     :rules="publicFormRules" label-width="80px">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户名称" prop="username">
                            <el-input v-model="publicForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="用户组织" prop="orgId">
                            <el-cascader
                                v-model="selectedKeys"
                                :options="orgData"
                                :props="dialogProps"
                                :disabled="cascaderDisabled"
                                @change="handleChange()"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户邮箱" prop="email">
                            <el-input v-model="publicForm.email" label="角色描述"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="publicForm.phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm()" type="primary">确 定</el-button>
                <el-button @click="dialogClosed">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="roleDialogTitle" :visible.sync="roleDialogVisible">
            <el-button type="primary"
                       size="small"
                       style="float: right"
                       @click="saveUserRoles">
                保存角色
            </el-button>
            <el-transfer
                v-model="checkedRoleIds"
                :props="roleProps"
                :data="roleData"
                :titles="['备选角色', '已选角色']">
            </el-transfer>
        </el-dialog>
    </div>
</template>

<script>
import {
    getUsers, updateUser, addUser, deleteUser, resetUserPwd, changeEnabled,
    getCheckedRoles, saveCheckedUserRoles, getOrgTree} from '@/api/system'
import axios from 'axios'


export default {
    name: "SysUser",
    data() {
        return {
            cascaderDisabled: false,
            dialogVisible: false,
            dialogTitle: "",
            filterText: "",

            selectedKeys: [],

            orgData: [],
            orgProps: {
                children: 'children',
                label: 'orgName'
            },
            dialogProps: {  // el-tree-select配置项（必选）
                value: 'id',
                label: 'orgName',
                children: 'children',
                checkStrictly: true
            },

            handlingUserId: null,
            handlingUsername: null,
            roleDialogTitle: "",
            roleDialogVisible: false,
            roleData: [],
            roleProps: {
                key: "id",
                label: "roleName"
            },
            checkedRoleIds: [],

            tableData: [],  //表格数据，需要从后台加载
            userQueryForm: {
                username: "",  //查询条件：用户名称
                phone: "",  //查询条件：联系电话
                enabled: null,  //查询条件：用户状态
                email: "",  //查询条件：用户邮箱
                orgId: null,  //查询条件：根据组织查询，这个暂时我们还没有用到，后续章节介绍
                timeRange: ["", ""]   //查询条件：createTime时间段
            },
            pagination: {
                pageNum: 1,  //分页初始值，页号1
                pageSize: 10, //分页初始值，每页10条
                total: null    //总共记录条数，初始值null，需要从后端加载
            },

            publicForm: {
                id: null,
                username: "",
                phone: "",
                email: "",
                orgId: null,
            },
            publicFormRules: {}
        }
    },
    computed: {
        alertInfo() {
            return "新用户初始密码为:"
                + this.$store.getters.getSysConfigItem("user.init.password")
                + "请尽快修改"
        }
    },
    methods: {
        async userStatusChange(row){
            const res = await changeEnabled(row.username,row.enabled)
            if(res.flag){ //如果请求成功，给出成功信息提示
                this.$message({message: res.data, type: 'success'});
            }
        },
        submitQueryForm() { //点击“查询”去后端加载用户数据
            getUsers(this.userQueryForm, this.pagination)
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) {  //点击“重置”按钮
            this.$refs[formName].resetFields();
            this.submitQueryForm()
        },
        filterOrg(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        orgNodeClick(node){
            this.userQueryForm.orgId = node.id
            this.submitQueryForm()
        },
        handlePageSizeChange(val) { //当每页条数发生变化，使用新的参数值加载表格数据
            this.pagination.pageSize = val;
            this.submitQueryForm()
        },
        handlePageNumChange(val) { //当页号发生变化，使用新的参数值加载表格数据
            this.pagination.pageNum = val;
            this.submitQueryForm()
        },

        handleChange(){
            this.publicForm.orgId = this.selectedKeys[this.selectedKeys.length-1]
        },
        setData(pageInfo) { //查询结果加载完成，去影响页面渲染
            if (pageInfo.flag) {
                this.tableData = pageInfo.data.records
                this.pagination.pageSize = pageInfo.data.size
                this.pagination.total = pageInfo.data.total
            }
        },
        setOrgData(orgTree) {
            if (orgTree.flag) {
                this.orgData = orgTree.data
            }
        },
        addUserHandler() { //点击新增按钮
            this.cascaderDisabled = false
            this.dialogVisible = true; //弹出框表单显示
            this.dialogTitle = "新增用户"   //弹出框Title
            this.selectedKeys = []
            this.$refs["userQueryForm"].resetFields()  //重置弹出框表单
        },
        submitForm() {
            this.$refs["publicFormRef"].validate((valid) => {
                if (valid) {
                    if (this.cascaderDisabled) {
                        updateUser(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addUser(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//新增之后，重新查询table
                                this.dialogClosed();
                            })
                    }
                } else {
                    return false;
                }
            });
        },
        editUser(row) {
            this.cascaderDisabled = true
            this.dialogTitle = "修改用户"
            this.dialogVisible = true
            this.publicForm = {...row}
        },
        removeUser(row) {
            this.$confirm("确定删除[" + row.username + "]?")
                .then(_ => {
                    this.publicForm = {...row}   //
                    deleteUser(row.username)  //调用axios接口api
                        .then(res => {
                            this.submitQueryForm();//删除之后，重新查询table
                            this.$message({message: res.data, type: 'success'});
                        }).catch(err => {
                        this.$message({message: err.message, type: 'success'});
                    })
                });
        },
        resetPwd(row) {
            this.$confirm("确定重置密码为："
                + this.$store.getters.getSysConfigItem("user.init.password")
                + " 么？")
                .then(_ => {
                    resetUserPwd(row.username).then(res => {
                        this.$message({message: res.data, type: 'success'})
                    });
                });
        },
        rolePermission(row) {
            this.roleDialogVisible = true
            this.roleDialogTitle = "用户" + row.username + "角色分配"
            this.handlingUserId = row.id
            this.handlingUsername = row.username
            getCheckedRoles(row.id)
                .then(res => {
                    this.roleData = res.data.roleData  //加载系统角色列表
                    this.checkedRoleIds = res.data.checkedRoleIds  //加载该用户的已选角色
                })
        },
        dialogClosed() {
            this.$refs["publicFormRef"].resetFields()
            this.dialogVisible = false
        },
        saveUserRoles() {
            saveCheckedUserRoles(this.handlingUsername,this.handlingUserId,this.checkedRoleIds)
                .then(res => {
                    this.$message({message: res.data, type: 'success'});
                    this.roleDialogVisible = false
                })
        }
    },
    beforeRouteEnter(to, from, next) {
        axios.all([
            getUsers(
                {username:"",phone:"",enabled:"",email:"",orgId:null,timeRange: ["",""]}
                ,{pageNum: 1, pageSize: 1}
            ),
            getOrgTree({status:null,name:""})])
            .then(axios.spread(function (res1, res2) {
                // 两个请求都执行完成后，进入该函数
                next(vm => {vm.setData(res1);vm.setOrgData(res2)})
            }));
    }
}
</script>

<style scoped>

</style>