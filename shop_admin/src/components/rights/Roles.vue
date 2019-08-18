<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户 -->
    <el-button
      type="success"
      plain
      @click="showAddDialog"
    >添加用户</el-button>
    <!-- 角色列表 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <!-- 权限显示 -->
        <template slot-scope="scope">
          <!-- 没有权限的 -->
          <el-row v-if="scope.row.children.length===0">
            <span>暂无角色权限</span>
          </el-row>
          <!-- 一级权限 -->
          <el-row
            v-for="level1 in scope.row.children"
            :key="level1.id"
            class="level1"
          >
            <el-col :span='4'>
              <el-tag
                closable
                @close='delRight(scope.row,level1.id)'
              >{{ level1.authName }}</el-tag> <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span='20'>
              <!-- 二级权限 -->
              <el-row
                v-for="level2 in level1.children"
                :key="level2.id"
                class="level2"
              >
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close='delRight(scope.row,level2.id)'
                  >{{ level2.authName }}</el-tag> <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    type="danger"
                    closable
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    class="level3"
                    @close='delRight(scope.row,level3.id)'
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delRole(scope.row)"
          ></el-button>
          <!-- 分配权限 -->
          <el-button
            type="success"
            plain
            size="mini"
            icon="el-icon-check"
            @click="showAssignDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        label-width="80px"
        :model="addForm"
        ref="addForm"
        :rules="rules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >添加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        label-width="80px"
        :model="editForm"
        ref="editForm"
        :rules="rules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRole"
        >修改</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%"
      @closed="emptyTree"
    >
      <!-- 树形组件 -->
      <el-tree
        :data="rights"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRights"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      assignDialogVisible: false,
      rights: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    // 获取所有用户数据
    async getRoleList() {
      // 进入页面获取角色列表
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = await this.axios.post('roles', this.addForm)
          let { meta: { status } } = res.data
          if (status === 201) {
            // 添加成功
            // 1.提示信息
            this.$message.success('添加角色成功')
            // 2.关闭添加对话框
            this.addDialogVisible = false
            // 3.重新渲染页面
            this.getRoleList()
            // 4.清空表单信息
            this.$refs.addForm.resetFields()
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑对话框
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
    },
    // 修改角色
    editRole() {
      // 表单校验
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          let { meta: { status } } = res.data
          if (status === 200) {
            // 关闭编辑对话框
            this.editDialogVisible = false
            // 重新渲染页面
            this.getRoleList()
            // 提示信息
            this.$message.success('编辑用户成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除角色
    async delRole(row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let { meta: { status } } = res.data
        if (status === 200) {
          // 删除成功,重新渲染页面
          this.$message.success('删除角色成功')
          this.getRoleList()
        }
      } catch (err) {
        this.$message.info('取消删除角色')
      }
    },
    // 删除指定权限
    async delRight(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        // row就等于返回来的剩余的权限
        row.children = data
        this.$message.success('删除成功')
      }
    },
    // 显示分配权限对话框
    async showAssignDialog(row) {
      this.roleId = row.id
      this.assignDialogVisible = true
      // 发送请求,获取所有的树形权限数据
      let res = await this.axios.get('rights/tree')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.rights = data
        // 创建一个空数组,存储已选中权限的id
        let temp = []
        // 找三级权限
        row.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              temp.push(level3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(temp)
      }
    },
    // 分配权限
    async assignRights() {
      // 点击确定的时候,获取当前所有选中的权限
      // 获取选中的三级权限id
      let keys = this.$refs.tree.getCheckedKeys()
      // 获取选中的三级权限上面的一级和二级权限id
      let halfKeys = this.$refs.tree.getHalfCheckedKeys()
      // 合并数组
      let rids = keys.concat(halfKeys)
      // 转为字符串
      rids = rids.join()
      // 发送请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let { meta: { status } } = res.data
      if (status === 200) {
        // 关闭对话框
        this.assignDialogVisible = false
        // 重新渲染页面
        this.getRoleList()
        // 提示信息
        this.$message.success('恭喜您,分配权限成功')
      }
    },
    // 在关闭分配权限对话框的时候,清空已勾选权限
    emptyTree() {
      this.$refs.tree.setCheckedKeys([])
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
}
.level1 {
  .level2 {
    margin-bottom: 10px;
    .level3 {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
