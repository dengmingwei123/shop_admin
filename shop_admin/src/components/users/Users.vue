<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select"
      @keyup.enter.native="search"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>

    <!-- 添加用户 -->
    <el-button
      type="success"
      plain
      @click="showAddDialog"
    >添加用户</el-button>

    <!-- 用户列表 -->
    <el-table
      :data="userData"
      style="width: 100%"
    >
      <el-table-column
        prop="username"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
      >
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            plain
            size="mini"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            plain
            size="mini"
            @click="delUser(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-check"
            type="success"
            plain
            size="mini"
            @click="showAssignRoleDialog(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination
      background
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[2,4,6,8]"
      :current-page="currentPage"
      @current-change="handlerCurrentChange"
      @size-change="handlerSizesChange"
    >
    </el-pagination>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 主体 -->
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="70px"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="addForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 页脚 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <!-- 主体 -->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="70px"
        :rules="rules"
        status-icon
      >
        <!-- 用户名 -->
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 页脚 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDialogVisible"
      width="40%"
    >
      <el-form label-width="80px">
        <el-form-item label="用户名:">
          <el-tag type="info">{{ assignRoleForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select
            placeholder="请选择"
            v-model="assignRoleForm.rid"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRole"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '', // 搜索
      currentPage: 1, // 当前页
      pageSize: 2, // 每页多少条
      userData: [], // 用户数据
      total: 0, // 获取的用户数据总数
      // 添加对话框的显示状态
      addDialogVisible: false,
      // 添加表单信息
      addForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱地址', trigger: 'change' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确格式的手机号', trigger: 'change' }
        ]
      },
      // 编辑对话框显示状态
      editDialogVisible: false,
      // 编辑表单信息
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignRoleDialogVisible: false,
      roleList: [],
      assignRoleForm: {
        id: '',
        username: '',
        rid: ''
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      let res = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status } } = res.data
      if (status === 200) {
        this.userData = res.data.data.users
        this.total = res.data.data.total
      }
    },
    // 页码发生改变时触发
    handlerCurrentChange(currentPage) {
      // 当前页
      this.currentPage = currentPage
      // 重新获取数据,渲染页面
      this.getUserList()
    },
    // 每页显示个数发生改变的时候触发事件
    handlerSizesChange(pageSize) {
      // 改变一页显示多少条
      this.pageSize = pageSize
      // 每次更改后跳转到第一页
      this.currentPage = 1
      // 重新获取数据,渲染页面
      this.getUserList()
    },
    // 搜索
    search() {
      // 获取用户列表
      this.getUserList()
    },
    // 显示添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = await this.axios({
            url: 'users',
            method: 'post',
            data: this.addForm
          })
          let { meta: { status, msg } } = res.data
          if (status === 201) {
            // 添加成功
            this.$message.success('恭喜你,添加用户成功')
            // 关闭对话框
            this.addDialogVisible = false
            // 当前页改到最后
            // 因为total是渲染之前的数据,所以需要自增
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            // 重新渲染页面
            this.getUserList()
            // 重置表单信息
            this.$refs.addForm.resetFields()
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 显示删除确认框
    async delUser(row) {
      try {
        await this.$confirm('您确定要删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 确定:发送请求
        let res = await this.axios.delete(`users/${row.id}`)
        let { meta: { status } } = res.data
        if (status === 200) {
          // 当前页面的数据为空的时候,需要跳转页面,到上一页,因为当时删除的是数据库的数据,这边还没同步过来,所以判断的是1条数据
          if (this.userData.length === 1 && this.currentPage !== 1) this.currentPage--
          // 重新渲染页面
          this.getUserList()
          // 显示信息
          this.$message.success('删除用户成功')
        } else {
          this.$message.error('删除用户失败')
        }
      } catch (err) {
        this.$message.error('取消删除用户')
      }
    },
    // 显示编辑对话框
    showEditDialog(row) {
      // 显示编辑对话框
      this.editDialogVisible = true
      // 将当前的数据渲染到对话框中
      console.log(row)
      this.editForm.id = row.id
      this.editForm.email = row.email
      this.editForm.username = row.username
      this.editForm.mobile = row.mobile
    },
    // 编辑用户
    editUser() {
      // 校验表单
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let res = await this.axios.put(`users/${this.editForm.id}`, this.editForm)
          let { meta: { status } } = res.data
          if (status === 200) {
            // 关闭对话框
            this.editDialogVisible = false
            // 重新渲染页面
            this.getUserList()
            this.$message.success('恭喜你,用户编辑成功')
          } else {
            this.$message.error('用户编辑失败')
          }
        } else {
          return false
        }
      })
    },
    // 显示分配角色对话框
    async showAssignRoleDialog(row) {
      // 获取到用户ID
      this.assignRoleForm.id = row.id
      this.assignRoleForm.username = row.username
      this.assignRoleDialogVisible = true
      // 根据用户ID查询用户信息获取角色ID
      let res = await this.axios.get(`users/${row.id}`)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        if (data.rid === -1) {
          this.assignRoleForm.rid = ''
        } else {
          this.assignRoleForm.rid = data.rid
        }
      }
      console.log(res)
      this.getRoleList()
    },
    // 获取所有角色列表
    async getRoleList() {
      // 发送请求获取所有的角色列表
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    // 分配角色
    async assignRole() {
      if (!this.assignRoleForm.rid) {
        this.assignRoleForm.rid = ''
        this.$message.error('角色列表不得为空')
        return false
      }
      let res = await this.axios.put(`users/${this.assignRoleForm.id}/role`, {
        rid: this.assignRoleForm.rid
      })
      let { meta: { status } } = res.data
      if (status === 200) {
        // 关闭分配对话框
        this.assignRoleDialogVisible = false
        // 重新渲染页面
        this.getUserList()
        // 提示信息
        this.$message.success('恭喜您,分配角色成功')
      }
      console.log(res)
    },
    // 改变状态
    async changeStatus(row) {
      let res = await this.axios.put(`users/${row.id}/state/${row.mg_state}`)
      let { meta: { status } } = res.data
      if (status === 200) {
        // 重新渲染页面
        this.getUserList()
        // 提示信息
        this.$message.success('恭喜您,修改状态成功')
      } else {
        this.$message.error('修改状态失败')
      }
    }
  },
  mounted() {
    // 进入页面获取数据渲染
    this.getUserList()
  }
}
</script>

<style lang='less' scoped>
.input-with-select {
  width: 350px;
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
