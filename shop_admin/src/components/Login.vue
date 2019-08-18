<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      status-icon
    >
      <img
        src="@/assets/images/诗乃.jpg"
        alt=""
      >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-button
        type="primary"
        @click="login"
      >登录</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = await this.axios.post('http://localhost:8888/api/private/v1/login', this.form)
          let { meta, meta: { status }, data } = res.data
          if (status === 200) {
            this.$message.success('登录成功')
            // 在修改锚点之前,先保存token到localStorage中
            localStorage.setItem('token', data.token)
            // 成功修改锚点
            this.$router.push('/home')
          } else if (status === 400) {
            this.$message({
              message: `${meta.msg}`,
              center: true,
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;
  .el-form {
    position: relative;
    width: 385px;
    height: 200px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 0px 50px;
    border-radius: 20px;
    img {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -70px);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button {
      transform: translateX(80px);
    }
    .el-button + .el-button {
      transform: translateX(130px);
    }
  }
}
</style>
