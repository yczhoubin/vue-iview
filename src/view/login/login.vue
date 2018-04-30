<style>
.loginForm {
  width: 300px;
  height: 400px;
  margin: auto;
  text-align: center;
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<template>
  <div>
    <Form ref="loginForm" :model="loginInfo" :rules="ruleInline" class="loginForm">
      <FormItem prop="user">
        <Input v-model="loginInfo.user" type="text" placeholder="user name">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input v-model="loginInfo.password" type="password" placeholder="Password">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginInfo: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("提交成功!");
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    }
  }
};
</script>
