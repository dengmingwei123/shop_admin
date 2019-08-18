<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <!-- logo -->
      <div class="logo"></div>
      <!-- 退出 -->
      <div class="logout">
        <span>欢迎光临</span>
        <a
          href="javascript:;"
          @click="logout"
        >退出</a>
      </div>
      <!-- 标题 -->
      <div class="title">
        <h3>电商后台管理系统</h3>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.slice(1).split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu
            v-for="item in asideList"
            :key="item.id"
            :index="item.path"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="list in item.children"
              :key="list.id"
              :index="list.path"
            ><i class="el-icon-menu"></i><span>{{ list.authName }}</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <!-- home组件的子组件出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      asideList: []
    }
  },
  methods: {
    logout() {
      this.$confirm('您是否确定要退出登录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 退出成功,需要删除token
        localStorage.removeItem('token')
        // 跳转页面
        this.$router.push('/login')
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message.info('取消退出')
      })
    }
  },
  async created() {
    // 进入页面的时候,就发送请求获取侧边栏数据
    let res = await this.axios.get('menus')
    let { meta: { status }, data } = res.data
    if (status === 200) {
      this.asideList = data
    }
  }
}
</script>

<style lang="less" scoped>
// 大盒子
.home {
  height: 100%;
  padding-left: 200px;
  padding-top: 60px;
  // 头部
  .el-header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: #b3c1cd;
    div {
      height: 60px;
    }
    // logo
    .logo {
      width: 180px;
      background: url() no-repeat center center;
      background-size: contain;
      float: left;
    }
    // 标题
    .title {
      overflow: hidden;
      h3 {
        line-height: 60px;
        color: #fff;
        font-size: 24px;
        text-align: center;
      }
    }
    // 退出
    .logout {
      width: 180px;
      float: right;
      font-weight: bold;
      font-size: 18px;
      line-height: 60px;
      text-align: right;
      a {
        color: red;
      }
    }
  }
  // 侧边栏
  .el-aside {
    position: fixed;
    left: 0;
    z-index: 999;
    height: 100%;
    background-color: #545c64;
    .el-menu {
      width: 200px;
    }
  }
  // 主体
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
