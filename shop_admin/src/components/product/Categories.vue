<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button
      type="success"
      plain
      @click="showAddDialog"
    >添加分类</el-button>
    <!-- 分类列表 -->
    <el-table
      :data="categoriesData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-tree-column
        file-icon="none"
        folder-icon="none"
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        :indentSize="20"
      ></el-table-tree-column>
      <el-table-column label="是否删除">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="cat_level"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="delCategories(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        ref='addForm'
        :rules="rules"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addForm.cat_pid"
            :options="catData"
            :props="props"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCategories"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 引入树形插件
var ElTreeGrid = require('element-tree-grid')

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      categoriesData: [],
      total: 0,
      loding: false,
      addDialogVisible: false,
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      catData: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    // 获取分页列表
    async getCategoriesList() {
      // 每次请求,做个加载显示
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res.data
      if (status === 200) {
        this.categoriesData = result
        this.total = total
        // 数据返回后,加载效果去除
        this.loading = false
      }
    },
    // 在page-sizes改变时触发，参数是当前需要的pagesize
    handleSizeChange(val) {
      // pageSize = 需要显示的page-sizes
      this.pageSize = val
      // 重新渲染页面
      this.getCategoriesList()
    },
    // 在当前页改变时触发,参数是当前页
    handleCurrentChange(val) {
      // 当前页 = 修改后的当前页
      this.currentPage = val
      // 重新渲染
      this.getCategoriesList()
    },
    // 显示添加分类对话框
    async showAddDialog() {
      this.addDialogVisible = true
      // 发送请求,获取一级二级权限
      let res = await this.axios.get('categories?type=2')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.catData = data
      }
    },
    // 添加分类
    addCategories() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.addForm.cat_level = this.addForm.cat_pid.length
          this.addForm.cat_pid = this.addForm.cat_pid[this.addForm.cat_pid.length - 1]
          if (!this.addForm.cat_pid) {
            this.addForm.cat_pid = 0
          }
          let res = await this.axios.post('categories', this.addForm)
          let { meta: { status, msg } } = res.data
          if (status === 201) {
            this.$message.success('添加成功')
            // 关闭对话框
            this.addDialogVisible = false
            // 添加分类对话框重置
            this.$refs.addForm.resetFields()
            // 清空选项框
            this.addForm.cat_pid = ''
            // 重新渲染页面
            this.getCategoriesList()
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 删除分类
    async delCategories(row) {
      try {
        await this.$confirm('请是否需要删除此分类?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${row.cat_id}`)
        console.log(res)
        let { meta: { status } } = res.data
        if (status === 200) {
          // 提示信息
          this.$message.success('恭喜您,删除分类成功')
          // 重新渲染页面
          this.getCategoriesList()
        }
      } catch (err) {
        this.$message.info('很好,停止了删除')
      }
    }
  },
  created() {
    this.getCategoriesList()
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style lang="">
</style>
