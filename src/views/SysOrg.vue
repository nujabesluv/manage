<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>组织管理</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <el-form ref="orgQueryForm" :model="orgQueryForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="组织名称" prop="name">
                            <el-input v-model="orgQueryForm.name" placeholder="请输入组织名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="是否禁用" prop="status">
                            <el-select v-model="orgQueryForm.status" placeholder="请选择组织状态">
                                <el-option label="未禁用" value="false"></el-option>
                                <el-option label="已禁用" value="true"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">查询</el-button>
                            <el-button type="primary" plain @click="resetQueryForm('orgQueryForm')"
                                       icon="el-icon-refresh">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-button type="primary" icon="el-icon-plus" @click="addOrgHandler() ">新增</el-button>

            <el-table :data="tableData" row-key="id" border default-expand-all>
                <el-table-column prop="orgName" label="组织名称" width="250" fixed="left"/>
                <el-table-column prop="phone" label="联系电话" width="200" align="center"/>
                <el-table-column prop="email" label="email" width="300" align="center"/>
                <el-table-column prop="sort" label="排序" width="100" align="center"/>
                <el-table-column prop="status" label="状态" width="150" align="center">
                    <template v-slot="scope">
                        <el-switch
                            active-text ="启用"
                            inactive-text = "禁用"
                            v-model="scope.row.status"
                            @change="orgStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址" width="400" align="center"/>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit"
                                   @click="editOrgHandler(scope.row)">修改
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete"
                                   @click="removeOrg(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%" @close="dialogClosed">
            <el-divider></el-divider>
            <el-form :model="publicForm" :rules="publicFormRules" ref="publicFormRef" label-width="100px">
                <el-form-item label="上级组织" prop="orgPid">
                    <el-cascader
                        v-model="selectedKeys"
                        :options="tableData"
                        :props="props"
                        :disabled="cascaderDisabled"
                        @change="handleChange()"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="组织名称" prop="orgName">
                    <el-input v-model="publicForm.orgName"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="publicForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="publicForm.email"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="publicForm.address"></el-input>
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

    </div>
</template>

<script>
import {getOrgTree, addOrg, updateOrg, deleteOrg, changeOrgStatus} from '@/api/system'

export default {
    name: "SysOrg",
    data() {
        return {
            orgQueryForm: {
                name: "",
                status: null
            },
            tableData: [],
            props: {
                expandTrigger: "hover",
                checkStrictly: true,
                value: "id",
                label: "orgName",
                children: "children",
                leaf: "isLeaf"
            },

            dialogTitle: "",
            cascaderDisabled: false,
            dialogVisible: false,

            selectedKeys: [],

            publicForm: {
                id: null,
                orgPid: null,
                orgName: "",
                phone: "",
                email: "",
                address: "",
                sort: null,
            },

            publicFormRules: {
                orgPid: [
                    {required: true, message: '请选择上级组织机构', trigger: 'blur'},
                ],
                orgName: [
                    {required: true, message: '请输入组织机构名称', trigger: 'blur'},
                ],
                phone: [
                    {pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'}
                ],
                email: [
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: '请输入当前组织机构在同级组织内的排序序号', trigger: 'blur'},
                ],
            },
        }
    },
    beforeRouteEnter(to, from, next) {
        getOrgTree({name: "", status: null}).then(res => {
            next(vm => vm.setData(res))
        })
    },
    methods: {
        async orgStatusChange(row){
            const res = await changeOrgStatus(row.id,row.status)
            if(res.flag){ //如果请求成功，给出成功信息提示
                this.$message({message: res.data, type: 'success'});
            }
        },
        handleChange(){
            this.publicForm.orgPid = this.selectedKeys[this.selectedKeys.length-1]
        },
        resetDialogForm(){
            this.publicForm.id = null
            this.publicForm.orgPid = null
            this.selectedKeys = []
            this.publicForm.orgName = ""
            this.publicForm.phone = ""
            this.publicForm.email = ""
            this.publicForm.address = ""
            this.publicForm.sort = null
        },
        addOrgHandler() {
            this.cascaderDisabled = false
            this.dialogTitle = "新增组织"
            this.dialogVisible = true
            this.resetDialogForm()
        },
        editOrgHandler(row) {
            this.cascaderDisabled = true
            this.dialogTitle = "修改组织"
            this.dialogVisible = true
            this.publicForm = {...row}
        },

        submitQueryForm() {
            getOrgTree({name: this.orgQueryForm.name, status: this.orgQueryForm.status})
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) {
            this.$refs[formName].resetFields();
            this.submitQueryForm(formName)
        },
        setData(orgTree) {
            if (orgTree.flag) {
                this.tableData = orgTree.data
            }
        },

        dialogClosed() {
            this.$refs["publicFormRef"].resetFields()
            this.dialogVisible = false
        },
        submitForm() {
            this.$refs["publicFormRef"].validate((valid) => {
                if (valid) {
                    if (this.cascaderDisabled) {
                        updateOrg(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addOrg(this.publicForm)
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
        removeOrg(row) {
            this.$confirm("确定删除[" + row.orgName + "]?")
                .then(_ => {
                    this.publicForm = {...row}   //从被选行赋值给addForm，临时借用AddForm
                    deleteOrg(this.publicForm)  //调用axios接口api
                        .then(res => {
                            this.submitQueryForm();//删除之后，重新查询table
                            this.$message({message: res.data, type: 'success'});
                        }).catch(err => {
                        this.$message({message: err.message, type: 'success'});
                    })
                });
        },
    }
}
</script>

<style scoped>

</style>