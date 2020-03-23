<template>
	<div class="password-container">
		<h3 class="title">设置登录密码</h3>
		<el-form :model="passwpordForm" :rules="rules2" ref="passwpordForm" label-position="top" label-width="80px" class="demo-ruleForm password-form">
			<el-form-item label="工号">
                <span class="account">20160111</span>
			</el-form-item>
			<el-form-item prop="checkPass" label="输入登录密码">
				<el-input size="large" type="password" v-model="passwpordForm.checkPass" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width:100%;">
				<el-button size="large" type="primary" style="width:100%;" @click.native.prevent="submit" :loading="logining">提交</el-button>
				<el-button size="large" style="width:100%;" @click.native.prevent="toLogin">去登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			logining: false,
			passwpordForm: {
				checkPass: '123456'
			},
			rules2: {
				checkPass: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
				]
			}
		};
	},
	methods: {
        submit(){
            console.log('submit');
        },
		toLogin(ev) {
            this.$router.push({ path: '/login' });
		}
	}
}

</script>

<style lang="scss" scoped>
.password-container {
	/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	-webkit-border-radius: 5px;
	border-radius: 5px;
	-moz-border-radius: 5px;
	background-clip: padding-box;
	margin-top: 140px;
	.password-form{
		margin: 0 auto;
		width: 350px;
		padding: 35px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}
	.title {
		font-size: 28px;
		margin: 0px auto 30px auto;
		text-align: center;
		color: #505458;
	}
    .account{
        font-size: 26px;
        font-weight: bold;
    }
    .el-button+.el-button{
        margin: 10px 0 0 0;
    }
}
</style>