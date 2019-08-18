<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-table :data="rightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="权限名称"
        prop="authName"
      ></el-table-column>
      <el-table-column
        label="路径"
        prop="path"
      ></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  async created() {
    // 进入页面,发送请求,获取权限列表
    let res = await this.axios.get('rights/list')
    // 结构获取的数据
    let { meta: { status }, data } = res.data
    if (status === 200) {
      this.rightList = data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
