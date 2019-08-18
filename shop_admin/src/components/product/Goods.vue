<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品 -->
    <el-button
      type="success"
      plain
      @click="$router.push('/goods-add')"
    >添加商品</el-button>
    <!-- 商品列表 -->
    <el-table
      :data="productList"
      style="width=100%"
    >
      <el-table-column
        type='index'
        :index="indexMessage"
      ></el-table-column>
      <el-table-column
        label="商品分类"
        prop="goods_name"
      >

      </el-table-column>
      <el-table-column
        label="商品价格"
        prop="goods_price"
      >

      </el-table-column>
      <el-table-column
        label="商品质量"
        prop="goods_weight"
      >

      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope='scope'>
          {{ scope.row.add_time | my-filter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            plain
            size="mini"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            plain
            size="mini"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      productList: []
    }
  },
  methods: {
    // 获取商品列表数据
    async getProductList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { goods, total } } = res.data
      if (status === 200) {
        this.productList = goods
        this.total = total
      }
      console.log(res)
    },
    // 当每页显示对少条改变时触发
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductList()
    },
    // 当前页发生改变时触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.getProductList()
    },
    // 控制下标
    indexMessage(index) {
      return this.pageSize * (this.currentPage - 1) + (index + 1)
    }
  },
  created() {
    this.getProductList()
  },
  filters: {
    // 过滤时间
    filterTime(sourceTime) {
      sourceTime = sourceTime * 1000
      let da = new Date(sourceTime)
      let year = da.getFullYear()
      let month = da.getMonth() + 1
      month = month >= 10 ? month : '0' + month
      let day = da.getDate()
      day = day > 10 ? day : '0' + day
      let hour = da.getHours()
      hour = hour > 10 ? hour : '0' + hour
      let minute = da.getMinutes()
      minute = minute > 10 ? minute : '0' + minute
      let second = da.getSeconds()
      second = second > 10 ? second : '0' + second
      return `${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`
    }
  }
}
</script>

<style lang="less" scoped>
</style>
