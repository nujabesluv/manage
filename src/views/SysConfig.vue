<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>配置参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="menuQueryForm" :model="configQueryForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="参数名称" prop="configLike">
                            <el-input v-model="configQueryForm.configLike" placeholder="请输入参数名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">查询</el-button>
                            <el-button type="primary" plain @click="resetQueryForm('configQueryForm')"
                                       icon="el-icon-refresh">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-button type="primary" icon="el-icon-plus" @click="addConfigHandler() ">新增</el-button>

            <el-table :data="tableData" row-key="id" border default-expand-all>
                <el-table-column prop="paramName" label="参数名称" width="300" align="center"/>
                <el-table-column prop="paramKey" label="参数编码" width="300" align="center"/>
                <el-table-column prop="paramValue" label="参数值" width="300" align="center"/>
                <el-table-column prop="paramDesc" label="参数描述" width="500" align="center"/>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit"
                                   @click="editConfigHandler(scope.row)">修改
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete"
                                   @click="removeConfig(scope.row)">删除
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
                <el-form-item label="参数名称" prop="paramName">
                    <el-input v-model="publicForm.paramName"></el-input>
                </el-form-item>
                <el-form-item label="参数编码" prop="paramKey">
                    <el-input v-model="publicForm.paramKey"></el-input>
                </el-form-item>
                <el-form-item label="参数值" prop="paramValue">
                    <el-input v-model="publicForm.paramValue"></el-input>
                </el-form-item>
                <el-form-item label="参数描述" prop="paramDesc">
                    <el-input v-model="publicForm.paramDesc"></el-input>
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
import {addConfig, deleteConfig, getConfig, updateConfig} from "@/api/system";

export default {
    name: "SysConfig",
    data() {
        return {
            configQueryForm: {
                configLike: ""
            },
            tableData: [],

            dialogTitle: "",
            dialogVisible: false,

            publicForm: {
                id: null,
                paramName: null,
                paramKey: "",
                paramValue: "",
                paramDesc: ""
            },

            publicFormRules: {
                paramName: [
                    {required: true, message: '请输入参数中文名称', trigger: 'blur'},
                ],
                paramKey: [
                    {required: true, message: '请输入参数编码', trigger: 'blur'},
                    {pattern: /^[A-Za-z0-9.]+$/, message: '只能包含英文、数字和"."', trigger: 'blur'}
                ],
                paramValue: [
                    {required: true, message: '请输入参数值', trigger: 'blur'},
                ],
                paramDesc: [
                    {required: true, message: '请输入参数描述信息', trigger: 'blur'},
                ]
            },
        }
    },
    methods: {
        submitQueryForm() {
            getConfig({configLike: this.configQueryForm.configLike})
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) {
            this.$refs[formName].resetFields();
            this.submitQueryForm(formName)
        },
        resetDialogForm(){
            this.publicForm.id = null
            this.publicForm.paramName = ""
            this.publicForm.paramKey = ""
            this.publicForm.paramValue = ""
            this.publicForm.paramDesc = ""
        },
        addConfigHandler() {
            this.dialogTitle = "新增参数"
            this.dialogVisible = true
            this.resetDialogForm()
        },
        editConfigHandler(row) {
            this.dialogTitle = "修改参数"
            this.dialogVisible = true
            this.publicForm = {...row}
        },
        handleRefresh(){
            this.$store.dispatch("refreshConfig")
                .then(res => {
                    this.$message({message: "刷新配置参数到应用中成功！", type: 'success'});
                })
        },
        dialogClosed() {
            this.$refs["publicFormRef"].resetFields()
            this.dialogVisible = false
        },
        submitForm() {
            this.$refs["publicFormRef"].validate((valid) => {
                if (valid) {
                    if (this.publicForm.id) {
                        updateConfig(this.publicForm).then(res => {
                                this.handleRefresh()
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addConfig(this.publicForm).then(res => {
                            this.handleRefresh()
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
        removeConfig(row){
            this.$confirm("确定删除全局参数:["+row.paramName+"]?")
                .then(_ => {
                    deleteConfig(row.id)
                        .then(res => {
                            this.handleRefresh()
                            this.submitQueryForm();//删除之后，重新查询table
                            this.$message({message: res.data, type: 'success'});
                        }).catch(err => {
                        this.$message({message: err.message, type: 'error'});
                    })
                });
        },
        setData(res) {
            if (res.flag) {
                this.tableData = res.data
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        getConfig("").then(res => {
            next(vm => vm.setData(res))
        })
    }
}
</script>

<style scoped>

</style>