<template>
	<q-input
		v-model="date"
		outlined
		no-error-icon
		mask="##/##/####"
		:rules="[(val) => checkDate(val)]"
		hide-bottom-space
		placeholder="DD/MM/YYYY"
		class="date-input"
		style="background-color: white"
	>
		<template #append>
			<q-icon name="event" class="cursor-pointer">
				<q-popup-proxy
					ref="qDateProxy"
					cover
					transition-show="scale"
					transition-hide="scale"
				>
					<q-date v-model="date" mask="DD/MM/YYYY">
						<div class="row items-center justify-end">
							<q-btn v-close-popup label="Close" color="primary" flat />
						</div>
					</q-date>
				</q-popup-proxy>
			</q-icon>
		</template>
	</q-input>
</template>

<script>
import { validateDate } from '@/helpers/common';
export default {
	emits: {
		date: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		date: '',
	}),
	watch: {
		date() {
			this.$emit('date', this.date);
		},
	},
	methods: {
		checkDate: validateDate,
	},
};
</script>

<style>
.date-input .q-field__bottom {
	display: none;
}
</style>
