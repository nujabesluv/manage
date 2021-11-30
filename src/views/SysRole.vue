<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="roleQueryForm" :model="roleQueryForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="角色名称" prop="roleLike">
                            <el-input v-model="roleQueryForm.roleLike" placeholder="请输入角色名称/角色编码/角色描述"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">查询</el-button>
                            <el-button type="primary" plain @click="resetQueryForm('roleQueryForm')"
                                       icon="el-icon-refresh">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-button type="primary" icon="el-icon-plus" @click="addRole() ">新增</el-button>

            <el-table :data="tableData" border>
                <el-table-column prop="roleName" label="角色名称" align="center"/>
                <el-table-column prop="roleCode" label="角色编码" align="center"/>
                <el-table-column prop="roleDesc" label="角色描述" width="600" align="center"/>
                <el-table-column prop="sort" label="排序" width="100" align="center"/>
                <el-table-column prop="status" label="状态" width="150" align="center">
                    <template v-slot="scope">
                        <el-switch
                            active-text ="启用"
                            inactive-text = "禁用"
                            v-model="scope.row.status"
                            @change="roleStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit"
                                   @click="editRole(scope.row)">修改
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete"
                                   @click="removeRole(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="success" icon=""
                                   @click="rolePermission(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%" @close="dialogClosed">
            <el-divider></el-divider>
            <el-form :model="publicForm" :rules="publicFormRules" ref="publicFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="publicForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input v-model="publicForm.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="publicForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item label="序号" prop="sort">
                    <el-input v-model="publicForm.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
                </span>
        </el-dialog>

        <el-dialog :title="permissionTitle" :visible.sync="permissionDialogVisible">
            <el-row>
                <el-col :span="12">
                    <el-button type="primary" @click="menuCheckedKeysHandler">保存菜单查看权限</el-button>
                    <el-tree ref="menuTreeRef"
                        :props="menuProps"
                        :data="menuTree"
                        node-key="id"
                        :default-expanded-keys="menuDefaultExpandedKeys"
                        :default-checked-keys="menuDefaultCheckedKeys"
                        show-checkbox></el-tree>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="apiCheckedKeysHandler">保存接口访问权限</el-button>
                    <el-tree ref="apiTreeRef"
                        :props="apiProps"
                        :data="apiTree"
                        node-key="id"
                        :default-expanded-keys="apiDefaultExpandedKeys"
                        :default-checked-keys="apiDefaultCheckedKeys"
                        show-checkbox></el-tree>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import {getRoles, updateRole, addRole, deleteRole, changeRoleStatus} from '@/api/system'
import {getMenuCheckedTree, saveMenuCheckedKeys,
    getApiCheckedTree, saveApiCheckedKeys} from '@/api/system'
import axios from 'axios'

export default {
    name: "SysRole",
    data() {
        return {
            roleQueryForm: {
                roleLike: ""
            },

            tableData: [],
            handlingRoleId: null,
            handlingRoleCode: null,

            menuTree: [],
            apiTree: [],
            menuDefaultExpandedKeys:[],
            menuDefaultCheckedKeys:[],
            apiDefaultExpandedKeys:[],
            apiDefaultCheckedKeys:[],
            menuProps: {
                label: "menuName",
                children: "children"
            },
            apiProps:{
                label: "apiName",
                children: "children"
            },

            dialogTitle: "",
            permissionTitle: "",
            dialogVisible: false,
            permissionDialogVisible: false,

            publicForm: {
                id: null,
                roleName: "",
                roleCode: "",
                roleDesc: "",
                sort: null,
            },

            publicFormRules: {
                roleName: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'},
                ],
                roleCode: [
                    {required: true, message: '请输入角色编码', trigger: 'blur'},
                ],
            }
        }
    },
    beforeRouteEnter(to, from, next) {  //在进入页面之前初始化数据
        getRoles("").then(res => {  //调用axios角色信息查询接口
            next(vm => vm.setData(res))
        })
    },
    methods: {
        async roleStatusChange(row){
            const res = await changeRoleStatus(row.id,row.status)
            if(res.flag){ //如果请求成功，给出成功信息提示
                this.$message({message: res.data, type: 'success'});
            }
        },
        submitQueryForm() {   //点击“查询按钮”触发查询操作
            getRoles(this.roleQueryForm.roleLike) //axios获取表单数据接口
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) { //查询表单查询条件重置
            this.$refs[formName].resetFields(); //查询条件重置
            this.submitQueryForm(formName)//表格数据重新查询
        },
        addRole() { //点击新增按钮
            this.dialogVisible = true; //弹出框表单显示
            this.dialogTitle = "新增角色"   //弹出框Title
            this.resetDialogForm()  //重置弹出框表单
        },
        editRole(row) {
            this.dialogVisible = true;//弹出框表单显示
            this.dialogTitle = "修改角色"   //弹出框Title
            this.publicForm = {...row}  //从被点击行获取数据，为弹出框表单数据初始化
        },
        resetDialogForm() {  //重置弹出框表单数据
            this.publicForm.id = null
            this.publicForm.roleName = ''
            this.publicForm.roleCode = ''
            this.publicForm.roleDesc = ''
            this.publicForm.sort = ''
        },
        submitForm() { //点击“提交”按钮，提交弹出框表单数据
            this.$refs["publicFormRef"].validate((valid) => {  //数据校验
                if (valid) {  //如果校验通过
                    if (this.publicForm.id) { //有id是更新数据，没有id是新增数据
                        updateRole(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addRole(this.publicForm)
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
        dialogClosed() {
            this.$refs["publicFormRef"].resetFields()
            this.dialogVisible = false
        },
        removeRole(index, row) {   //点击“删除”按钮触发该函数
            this.$confirm("确定删除[" + row.roleName + "]?")
                .then(_ => {
                    deleteRole(row.id)
                        .then(res => {
                            this.submitQueryForm();//删除之后，重新查询table
                            this.$message({message: res.data, type: 'success'});
                        }).catch(err => {
                        this.$message({message: err.message, type: 'success'});
                    })
                });
        },
        setData(roles) {  //初始化表格数据
            if (roles.flag) {
                this.tableData = roles.data
            }
        },
        rolePermission(row){
            this.handlingRoleId = row.id  //当前正在分配权限的角色id
            this.handlingRoleCode = row.roleCode
            let _this = this
            axios.all([getMenuCheckedTree(row.id), getApiCheckedTree(row.id)])
                .then(axios.spread(function (res1, res2) {
                    // 两个请求都执行完成后，进入该函数
                    _this.menuTree = res1.data.tree
                    _this.menuDefaultExpandedKeys = res1.data.expandedKeys
                    _this.menuDefaultCheckedKeys = res1.data.checkedKeys
                    _this.apiTree = res2.data.tree
                    _this.apiDefaultExpandedKeys = res2.data.expandedKeys
                    _this.apiDefaultCheckedKeys = res2.data.checkedKeys
                    _this.permissionDialogVisible = true;
                    _this.permissionTitle = row.roleName + "角色:权限分配"
                }));
        },
        menuCheckedKeysHandler(){
            const checkedKeys = this.$refs.menuTreeRef.getCheckedKeys()
            saveMenuCheckedKeys(this.handlingRoleId,checkedKeys)
                .then(res => {
                    this.$message({message: res.data, type: 'success'});
                })
        },
        apiCheckedKeysHandler(){
            const checkedKeys = this.$refs.apiTreeRef.getCheckedKeys()
            saveApiCheckedKeys(this.handlingRoleCode,this.handlingRoleId,checkedKeys)
                .then(res => {
                    this.$message({message: res.data, type: 'success'});
                })
        }
    }
}
</script>

<style scoped>

</style>