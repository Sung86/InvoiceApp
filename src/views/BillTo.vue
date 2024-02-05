<template>
	<div class="q-pa-xl">
		<div>
			<div class="text-h5 text-weight-bold q-mr-lg">Bill To:</div>
			<table>
				<tr>
					<td>Client Name</td>
					<td>:</td>
					<td>{{ contract?.client?.name }}</td>
				</tr>
				<tr>
					<td>Contract Number:</td>
					<td>:</td>
					<td>{{ contract?.contractNumber }}</td>
				</tr>
				<tr>
					<td>Project Name</td>
					<td>:</td>
					<td>{{ contract?.projectName }}</td>
				</tr>
			</table>
		</div>

		<div class="q-my-md">
			<div class="row justify-between items-center q-mb-md">
				<div class="row items-center">
					<span class="text-subtitle1 q-mr-md"> Invoice Due Date: </span>
					<InputDate @date="(val) => (invoiceDueDate = val)" />
				</div>
				<q-btn
					color="secondary"
					size="lg"
					label="Add"
					class="text-capitalize"
					@click="addRow()"
				/>
			</div>
			<q-table
				:rows="rows"
				:columns="columns"
				row-key="index"
				:rows-per-page-options="[0]"
				virtual-scroll
			>
				<template #top>
					<span class="text-grey"> Click cell to edit </span>
				</template>
				<template #body="props">
					<q-tr :props="props">
						<q-td key="sequenceNumber" :props="props">
							{{ props.row.sequenceNumber }}
						</q-td>

						<q-td key="description" :props="props">
							{{ props.row.description }}
							<q-popup-edit
								v-model="props.row.description"
								v-slot="scope"
								buttons
							>
								<q-input
									v-model="scope.value"
									dense
									autofocus
									@keyup.enter="scope.set"
								/>
							</q-popup-edit>
						</q-td>
						<q-td key="qty" :props="props">
							{{ props.row.qty }}
							<q-popup-edit
								v-model.number="props.row.qty"
								v-slot="scope"
								buttons
							>
								<q-input
									v-model.number="scope.value"
									dense
									autofocus
									type="number"
									@keyup.enter="scope.set"
								/>
							</q-popup-edit>
						</q-td>
						<q-td key="unitPrice" :props="props">
							{{ formatPrice(props.row.unitPrice) }}
							<q-popup-edit
								v-model="props.row.unitPrice"
								v-slot="scope"
								buttons
							>
								<q-input
									prefix="$"
									v-model="scope.value"
									dense
									autofocus
									@keyup.enter="scope.set"
									type="number"
								/>
							</q-popup-edit>
						</q-td>
						<q-td key="amount" :props="props">
							{{ formatPrice(calculateAmount(props.row)) }}
						</q-td>
						<q-td key="actions" :props="props">
							<ButtonDelete @click="deleteRow(props.rowIndex)" />
						</q-td>
					</q-tr>
				</template>
			</q-table>
			<div class="row justify-end q-mt-md q-mr-lg">
				<table>
					<tr>
						<td>SubTotal</td>
						<td>:</td>
						<td>{{ formatPrice(subtotal) }}</td>
					</tr>
					<tr>
						<td>GST(10%)</td>
						<td>:</td>
						<td>{{ formatPrice(gst) }}</td>
					</tr>
					<tr>
						<td>Total</td>
						<td>:</td>
						<td>{{ formatPrice(total) }}</td>
					</tr>
				</table>
			</div>
			<div class="row justify-center q-pt-md">
				<q-btn
					color="secondary"
					size="md"
					label="Produce Invoice"
					class="text-capitalize"
					:disable="!rows.length || !checkDate(invoiceDueDate)"
					@click="onCreateInvoice()"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { defineAsyncComponent } from 'vue';
import {
	getContract,
	createDocReference,
	createTimestamp,
	addData,
} from '@/apis/firestore';
import {
	validateDate,
	priceFormatter,
	generateInvoiceNumber,
} from '@/helpers/common';
export default {
	components: {
		ButtonDelete: defineAsyncComponent(() =>
			import('@/components/buttons/ButtonDelete')
		),
		InputDate: defineAsyncComponent(() => import('@/components/InputDate')),
	},
	props: {
		contractId: {
			type: String,
			default: '',
			required: true,
		},
	},
	computed: {
		...mapGetters({
			clients: 'simpleTable/getClients',
		}),
		subtotal() {
			return this.rows.reduce((sum, value) => sum + value.amount, 0);
		},
		gst() {
			return this.subtotal * 0.1;
		},
		total() {
			return this.subtotal + this.gst;
		},
	},
	async created() {
		if (this.clients.length <= 0) this.loadClients();
		const contract = await getContract(this.contractId);
		this.contract = contract;
	},
	data: () => ({
		contract: {},
		invoiceDueDate: '',
		columns: [
			{
				name: 'sequenceNumber',
				label: '#',
				field: 'sequenceNumber',
			},
			{
				name: 'description',
				label: 'Description',
				field: 'description',
				align: 'center',
				sortable: true,
			},
			{
				name: 'qty',
				label: 'Qty',
				field: 'qty',
				align: 'center',
				sortable: true,
			},
			{
				name: 'unitPrice',
				label: 'Unit Price',
				field: 'unitPrice',
				format: (val) => (val ? `$${val}` : val),
				align: 'center',
				sortable: true,
			},
			{
				name: 'amount',
				label: 'Amount',
				field: 'amount',
				format: (val) => (val ? `$${val}` : val),
				align: 'center',
				sortable: true,
			},
			{
				name: 'actions',
				label: 'Actions',
				field: 'actions',
				align: 'center',
				sortable: false,
			},
		],
		rows: [],
	}),
	methods: {
		...mapActions({
			loadClients: 'simpleTable/loadClients',
		}),
		async onCreateInvoice() {
			const contractReference = createDocReference(
				`contracts/${this.contract._id}`
			);
			const clientReference = createDocReference(
				`clients/${this.contract.client._id}`
			);
			const timestampInvoiceDate = createTimestamp();
			const timestampDueDate = createTimestamp(this.invoiceDueDate);
			const invoiceNo = generateInvoiceNumber();
			const data = {
				amountPaid: 0,
				contractRef: await contractReference,
				clientRef: await clientReference,
				dueDate: await timestampDueDate,
				invoiceAmount: this.total,
				invoiceDate: await timestampInvoiceDate,
				invoiceNumber: await invoiceNo,
				isPaid: false,
				items: this.rows.map(({ description, qty, unitPrice }) => ({
					description,
					qty,
					unitPrice,
				})),
			};
			const res = await addData('invoices', data);
			if (res.status) {
				this.$router.push({
					name: 'InvoiceDetail',
					params: { invoiceId: res.docId },
				});
			} else {
				this.$q.notify({
					type: 'negative',
					message: `Something went wrong, please try again later`,
					position: 'top',
				});
			}
		},
		addRow() {
			this.rows.push({
				sequenceNumber: this.rows.length + 1,
				description: 'Item Description',
				qty: 1,
				unitPrice: 0,
				amount: 0,
			});
		},
		deleteRow(rowIndex) {
			this.rows.splice(rowIndex, 1);
		},
		calculateAmount(row) {
			row.amount = row.qty * row.unitPrice;
			return row.amount;
		},
		formatPrice: priceFormatter,
		checkDate: validateDate,
	},
};
</script>

<style></style>
