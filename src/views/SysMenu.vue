<template>
    <div>
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="menuQueryForm" :model="menuQueryForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="menuQueryForm.name" placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="是否禁用" prop="status">
                            <el-select v-model="menuQueryForm.status" placeholder="请选择菜单状态">
                                <el-option label="未禁用" value="false"></el-option>
                                <el-option label="已禁用" value="true"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="submitQueryForm()" icon="el-icon-search">查询</el-button>
                            <el-button type="primary" plain @click="resetQueryForm('menuQueryForm')"
                                       icon="el-icon-refresh">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-button type="primary" icon="el-icon-plus" @click="addMenuHandler() ">新增</el-button>

            <el-table :data="tableData" row-key="id" border default-expand-all>
                <el-table-column prop="menuName" label="菜单名称" width="300" fixed="left"/>
                <el-table-column prop="url" label="访问路径" width="400" align="center"/>
                <el-table-column prop="icon" label="菜单图标" width="400" align="center"/>
                <el-table-column prop="sort" label="排序" width="100" align="center"/>
                <el-table-column prop="status" label="状态" width="150" align="center">
                    <template v-slot="scope">
                        <el-switch
                            active-text ="启用"
                            inactive-text = "禁用"
                            v-model="scope.row.status"
                            @change="menuStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit"
                                   @click="editMenuHandler(scope.row)">修改
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
                <el-form-item label="上级菜单" prop="menuPid">
                    <el-cascader
                        v-model="selectedKeys"
                        :options="tableData"
                        :props="props"
                        :disabled="cascaderDisabled"
                        @change="handleChange()"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="publicForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" prop="url">
                    <el-input v-model="publicForm.url"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="publicForm.icon"></el-input>
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
import {getMenuTree, addMenu, updateMenu, deleteMenu, changeMenuStatus} from "@/api/system";

export default {
    name: "SysMenu",
    data() {
        return {
            menuQueryForm: {
                name: "",
                status: null
            },
            tableData: [],
            props: {
                expandTrigger: "hover",
                checkStrictly: true,
                value: "id",
                label: "menuName",
                children: "children",
                leaf: "isLeaf"
            },

            dialogTitle: "",
            cascaderDisabled: false,
            dialogVisible: false,

            selectedKeys: [],

            publicForm: {
                id: null,
                menuPid: null,
                menuName: "",
                url: "",
                icon: "",
                sort: null,
            },

            publicFormRules: {
                menuPid: [
                    {required: true, message: '请选择上级菜单', trigger: 'blur'},
                ],
                menuName: [
                    {required: true, message: '请输入菜单名称', trigger: 'blur'},
                ],
                url: [
                    {required: true, message: '请输入访问路径', trigger: 'blur'}
                ],
                sort: [
                    {required: true, message: '请输入当前组织机构在同级组织内的排序序号', trigger: 'blur'},
                ],
            },
        }
    },
    beforeRouteEnter(to, from, next) {
        getMenuTree({name: "", status: null}).then(res => {
            next(vm => vm.setData(res))
        })
    },
    methods: {
        async menuStatusChange(row){
            const res = await changeMenuStatus(row.id,row.status)
            if(res.flag){ //如果请求成功，给出成功信息提示
                this.$message({message: res.data, type: 'success'});
            }
        },
        resetDialogForm(){
            this.publicForm.id = null
            this.publicForm.menuPid = null
            this.selectedKeys = []
            this.publicForm.menuName = ""
            this.publicForm.url = ""
            this.publicForm.icon = ""
            this.publicForm.sort = null
        },
        setData(menuTree) {
            if (menuTree.flag) {
                this.tableData = menuTree.data
            }
        },
        submitQueryForm() {
            getMenuTree({name: this.menuQueryForm.name, status: this.menuQueryForm.status})
                .then(res => {
                    this.setData(res)
                })
        },
        resetQueryForm(formName) {
            this.$refs[formName].resetFields();
            this.submitQueryForm(formName)
        },
        addMenuHandler() {
            this.cascaderDisabled = false
            this.dialogTitle = "新增菜单"
            this.dialogVisible = true
            this.resetDialogForm()
        },
        editMenuHandler(row) {
            this.cascaderDisabled = true
            this.dialogTitle = "修改菜单"
            this.dialogVisible = true
            this.publicForm = {...row}
        },
        removeMenu(row) {
            this.$confirm("确定删除[" + row.menuName + "]?")
                .then(_ => {
                    this.publicForm = {...row}
                    deleteMenu(this.publicForm)  //调用axios接口api
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
            this.publicForm.menuPid = this.selectedKeys[this.selectedKeys.length-1]
        },
        submitForm() {
            this.$refs["publicFormRef"].validate((valid) => {
                if (valid) {
                    if (this.cascaderDisabled) {
                        updateMenu(this.publicForm)
                            .then(res => {
                                this.$message({message: res.data, type: 'success'});
                                this.submitQueryForm();//修改之后，重新查询table
                                this.dialogClosed();
                            })
                    } else {
                        addMenu(this.publicForm)
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