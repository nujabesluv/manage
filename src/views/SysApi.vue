<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>接口管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="apiQueryForm" :model="apiQueryForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="接口名称" prop="name">
                            <el-input v-model="apiQueryForm.name" placeholder="请输入接口名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="是否禁用" prop="status">
                            <el-select v-model="apiQueryForm.status" placeholder="请选择接口状态">
                                <el-option label="未禁用" value="false"></el-option>
                                <el-option label="已禁用" value="true"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">查询</el-button>
                            <el-button type="primary" plain @click="resetQueryForm('apiQueryForm')"
                                       icon="el-icon-refresh">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-button type="primary" icon="el-icon-plus" @click="addApiHandler() ">新增</el-button>

            <el-table :data="tableData" row-key="id" border default-expand-all>
                <el-table-column prop="apiName" label="接口名称"/>
                <el-table-column prop="url" label="访问路径" align="center"/>
                <el-table-column prop="sort" label="排序" width="100" align="center"/>
                <el-table-column prop="status" label="状态" align="center">
                    <template v-slot="scope">
                        <el-switch
                            active-text ="启用"
                            inactive-text = "禁用"
                            v-model="scope.row.status"
                            @change="apiStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit"
                                   @click="editApiHandler(scope.row)">修改
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete"
                                   @click="removeMenu(scope.row)">删除
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
                <el-form-item label="接口分组" prop="apiPid">
                    <el-cascader
                        v-model="selectedKeys"
                        :options="tableData"
                        :props="props"
                        :disabled="cascaderDisabled"
                        clearable
                        @change="handleChange()"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="接口名称" prop="apiName">
                    <el-input v-model="publicForm.apiName"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" prop="url">
                    <el-input v-model="publicForm.url"></el-input>
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
import {getApiTree, addApi, updateApi, deleteApi, changeApiStatus} from "@/api/system";

export default {
    name: "SysApi",
    data(){
        return{
            apiQueryForm: {
                name: "",
                status: null
            },
            tableData: [],
            props: {
                expandTrigger: "hover",
                checkStrictly: true,
                value: "id",
                label: "apiName",
                children: "children",
                leaf: "isLeaf"
            },

            dialogTitle: "",
            cascaderDisabled: false,
            dialogVisible: false,

            selectedKeys: [],

            publicForm: {
                id: null,
                apiPid: null,
                apiName: "",
                url: "",
                sort: null,
            },

            publicFormRules: {
                apiPid: [
                    {required: true, message: '请选择父接口', trigger: 'blur'},
                ],
                apiName: [
                    {required: true, message: '请输入接口名称', trigger: 'blur'},
                ],
                url: [
                    {required: true, message: '请输入访问路径', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: '请输入当前接口在同级接口内的序号', trigger: 'blur'},
                ],
            },
        }
    },
    beforeRouteEnter(to, from, next) {
        getApiTree({name: "", status: null}).then(res => {
            next(vm => vm.setData(res))
        })
    },
    methods: {
        async apiStatusChange(row){
            const res = await changeApiStatus(row.id,row.status)
            if(res.flag){ //如果请求成功，给出成功信息提示
                this.$message({message: res.data, type: 'success'});
            }
        },
        resetDialogForm(){
            this.publicForm.id = null
            this.publicForm.apiPid = null
            this.selectedKeys = []
            this.publicForm.apiName = ""
            this.publicForm.url = ""
            this.publicForm.sort = null
        },
        setData(apiTree) {
            if (apiTree.flag) {
                this.tableData = apiTree.data
            }
        },
        submitQueryForm() {
            getApiTree({name: this.apiQueryForm.name, status: this.apiQueryForm.status})
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) {
            this.$refs[formName].resetFields();
            this.submitQueryForm(formName)
        },
        addApiHandler() {
            this.cascaderDisabled = false
            this.dialogTitle = "新增接口"
            this.dialogVisible = true
            this.resetDialogForm()
        },
        editApiHandler(row) {
            this.cascaderDisabled = true
            this.dialogTitle = "修改接口"
            this.dialogVisible = true
            this.publicForm = {...row}
        },
        removeMenu(row) {
            this.$confirm("确定删除[" + row.apiName + "]?")
                .then(_ => {
                    this.publicForm = {...row}
                    deleteApi(this.publicForm)  //调用axios接口api
                        .then(res => {
                            this.submitQueryForm();//删除之后，重新查询table
                            this.$message({message: res.data, type: 'success'});
                        }).catch(err => {
                        this.$message({message: err.message, type: 'success'});
                    })
                });
        },
        dialogClosed() {
            this.$refs["publicFormRef"].resetFields()
            this.dialogVisible = false
        },
        handleChange() {
            this.publicForm.apiPid = this.selectedKeys[this.selectedKeys.length-1]
        },
        submitForm() {
            this.$refs["publicFormRef"].validate((valid) => {
                if (valid) {
                    if (this.cascaderDisabled) {
                        updateApi(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addApi(this.publicForm)
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
        }
    }
}
</script>

<style scoped>

</style>