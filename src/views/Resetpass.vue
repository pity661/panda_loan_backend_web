<template>
	<div class="reset-password-container">
		<h3 class="title">修改登录密码</h3>
        <el-steps :space="400" :active="active" finish-status="success" class="steps">
            <el-step title="输入旧密码"></el-step>
            <el-step title="设置新密码"></el-step>
        </el-steps>
		<el-form :model="resetPasswpordForm" :rules="rules2" ref="resetPasswpordForm" label-position="top" label-width="80px" class="demo-ruleForm reset-password-form">
            <el-form-item label="工号">
                <span class="account">20160111</span>
			</el-form-item>
			<el-form-item v-if="active === 0" prop="oldPass" label="输入旧密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.oldPass" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item v-if="active === 1" prop="newPass" label="输入新密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.newPass" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item  v-if="active === 1" prop="newPassConfirm" label="确认新密码">
				<el-input size="large" type="password" v-model="resetPasswpordForm.newPassConfirm" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item style="width:100%;">
                <el-button v-if="active === 0" size="large" style="width:100%;" @click="next">下一步</el-button>
                <el-button v-if="active === 1" size="large" style="width:100%;" @click="submit">提交</el-button>
				<el-button size="large" style="width:100%;" @click.native.prevent="toLogin">去登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
            active:0,
			logining: false,
			resetPasswpordForm: {
				oldPass: ''
			},
			rules2: {
				oldPass: [
					{ required: true, message: '请输入旧密码', trigger: 'blur' },
				],
                newPass: [
					{ required: true, message: '请输入新密码', trigger: 'blur' },
				],
                newPassConfirm: [
					{ required: true, message: '确认新密码', trigger: 'blur' },
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
		},
        next() {
            this.active++;
        }
	}
}

</script>

<style lang="scss" scoped>
.reset-password-container {
	/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	-webkit-border-radius: 5px;
	border-radius: 5px;
	-moz-border-radius: 5px;
	background-clip: padding-box;
	margin-top: 140px;
	.reset-password-form{
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
    .steps{
		margin: 0px auto 30px auto;
        width: 422px;
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