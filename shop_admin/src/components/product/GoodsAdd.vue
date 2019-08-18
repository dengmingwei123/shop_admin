<template>
  <div class="goodsAdd">
    <!-- 步骤条 -->
    <el-steps
      :active="active"
      finish-status="success"
    >
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <!-- tab框 -->
    <el-tabs
      tab-position="left"
      @tab-click="change"
      v-model="activeName"
    >
      <!-- 基本信息 -->
      <el-tab-pane
        label="基本信息"
        name="dasic"
      >
        <el-form
          :model="addForm"
          ref="addForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item
            label="商品名称"
            prop="goods_name"
          >
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item
            label="商品价格"
            prop="goods_price"
          >
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item
            label="商品重量"
            prop="goods_weight"
          >
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item
            label="商品数量"
            prop="goods_number"
          >
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item
            label="商品分类"
            prop="goods_cat"
          >
            <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio
              v-model="addForm.radio"
              :label='true'
            >是</el-radio>
            <el-radio
              v-model="addForm.radio"
              :label='false'
            >否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="next(1,'picture')"
            >下一步</el-button>
            <el-button
              type="primary"
              @click="addProduct"
              class="addProduct"
            >直接添加</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 上传图片 -->
      <el-tab-pane
        label="商品图片"
        name="picture"
      >
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-remove="removeFile"
          :on-success="uploadSuccess"
          :file-list="fileList"
          list-type="picture"
          :headers="headers"
        >
          <el-button
            size="small"
            type="primary"
          >点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button
          type="primary"
          @click="next(2,'content')"
          class="nextButton"
        >下一步</el-button>
      </el-tab-pane>
      <el-tab-pane
        label="商品内容"
        name="content"
      >
        <quill-editor v-model='addForm.goods_introduce'></quill-editor>
        <el-button
          type="primary"
          @click="addProduct"
        >添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'dasic',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        radio: false,
        pics: []
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      fileList: [],
      headers: {
        Authorization: localStorage.getItem('token')
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        goods_price: [
          { required: true, message: '请输入商品重量', trigger: 'change' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'change' }
        ],
        goods_weight: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 获取当前tab栏位置
    change(tab) {
      this.active = +tab.index
    },
    // 下一步
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 上传成功
    uploadSuccess(response) {
      // eslint-disable-next-line
      let { meta: { status }, data: { tmp_path } } = response
      if (status === 200) {
        this.addForm.pics.push({ pic: tmp_path })
      }
    },
    // 删除文件
    removeFile(file) {
      let tmpPath = file.response.data.tmp_path
      let index = this.addForm.pics.findIndex(item => item.pic === tmpPath)
      this.addForm.pics.splice(index, 1)
    },
    // 添加商品
    addProduct() {
      // 表单校验
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送请求添加商品
          let res = await this.axios.post('goods', {
            ...this.addForm,
            goods_cat: this.addForm.goods_cat.join()
          })
          let { meta: { status, msg } } = res.data
          if (status === 201) {
            // 提示信息
            this.$message.success('添加商品成功')
            // 跳转路由
            this.$router.push('/goods')
          } else {
            this.$message.error(msg)
          }
        } else {
          this.active = 0
          this.activeName = 'dasic'
          return false
        }
      })
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    let { meta: { status }, data } = res.data
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.nextButton {
  margin-top: 20px;
}
.quill-editor {
  background-color: #fff;
  margin-bottom: 10px;
  /deep/ .ql-editor {
    height: 300px;
  }
}
.el-form {
  background-color: #eee;
  padding: 30px 20px 10px 10px;
  border-radius: 20px;
}
.addProduct {
  margin-left: 60px;
}
</style>
