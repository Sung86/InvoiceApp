<template>
	<div class="row justify-center items-center">
		<div class="background-image">
			<div class="absolute-full text-subtitle2 flex flex-center">
				<q-card class="q-px-lg q-pb-md flat" style="min-width: 60%">
					<q-card-section class="text-dark">
						<div class="text-center text-h4 q-mt-sm q-mb-lg">
							Tassie Web - Invoice System
						</div>
						<div v-if="isSignInError" class="text-red text-center text-h6">
							Invalid Account
						</div>
						<q-form class="q-gutter-md" @submit="onSignIn()">
							<div class="text-h5">Email:</div>
							<q-input
								v-model="email"
								outlined
								lazy-rules
								type="email"
								no-error-icon
								:rules="rules"
								:disable="isOnSubmit"
							/>

							<div class="text-h5 q-mt-md">Password:</div>
							<q-input
								v-model="password"
								outlined
								:type="isShowPassword ? 'text' : 'password'"
								lazy-rules
								no-error-icon
								:rules="rules"
							>
								<template #append>
									<q-icon
										:name="isShowPassword ? 'visibility_off' : 'visibility'"
										class="cursor-pointer"
										@click="isShowPassword = !isShowPassword"
									/>
								</template>
							</q-input>

							<div class="row justify-center q-mt-lg">
								<q-btn
									push
									class="text-capitalize q-px-xl"
									color="primary"
									type="submit"
									label="Sign In"
									size="1.3rem"
									:loading="isOnSubmit"
									:disable="isOnSubmit"
								/>
							</div>
						</q-form>
					</q-card-section>
				</q-card>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	data: () => ({
		email: '',
		password: '',
		rules: [(val) => (val !== null && val !== '') || 'Required'],
		isOnSubmit: false,
		isSignInError: false,
		isShowPassword: false,
	}),
	methods: {
		...mapActions({
			signIn: 'user/signIn',
		}),
		async onSignIn() {
			this.isSignInError = false;
			this.isOnSubmit = true;
			const data = { email: this.email, password: this.password };
			const result = await this.signIn(data);
			if (result === false) this.isSignInError = true;
			else this.$router.push({ name: 'Clients' });
			this.isOnSubmit = false;
		},
	},
};
</script>

<style scoped>
.background-image {
	height: 100vh;
	width: 100vw;
	background-repeat: repeat;
	background-image: url('../assets/logo.png');
}
</style>
