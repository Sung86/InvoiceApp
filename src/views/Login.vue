<template>
	<q-page class="row justify-center items-center">
		<div class="absolute-full text-subtitle2 flex flex-center">
			<q-card class="q-px-xl q-pb-xl q-pt-md flat" style="min-width: 50%">
				<q-card-section class="text-dark">
					<div class="text-h3 text-center">Sign In</div>
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
							hide-bottom-space
							:rules="rules"
							:disable="isOnSubmit"
						/>

						<div class="text-h5 q-mt-md">Password:</div>
						<q-input
							v-model="password"
							outlined
							:type="isShowPassword ? 'text' : 'password'"
							hide-bottom-space
							lazy-rules
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
								label="SignIn"
								size="1.3rem"
								:loading="isOnSubmit"
								:disable="isOnSubmit"
							/>
						</div>
					</q-form>
				</q-card-section>
			</q-card>
		</div>
	</q-page>
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
			else this.$router.push({ name: 'Contracts' });
			this.isOnSubmit = false;
		},
	},
};
</script>

<style scoped></style>
