<template>
	<div class="q-ma-xl">
		<div ref="invoiceContainer">
			<div class="row">
				<div class="col-7">
					<div class="row items-center">
						<q-avatar size="80px" class="q-mr-md">
							<img src="@/assets/logo.png" />
						</q-avatar>
						<span class="text-h5 text-bold"> Tassie Web </span>
					</div>
					<div class="column q-mt-md">
						<span>www.tassieweb.com</span>
						<span>Email: info@tassieweb.com</span>
					</div>
				</div>
				<div class="col-1"></div>
				<div class="col-4">
					<div class="column">
						<div class="column q-mb-xl">
							<span class="text-h6 text-bold">INVOICE</span>
							<span>ABN : 12345678910</span>
						</div>
						<div class="column">
							<span>Date: {{ invoiceDate }}</span>
							<span>Invoice Number: {{ invoiceNumber }}</span>
							<span>Due Date: {{ dueDate }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="q-my-xl">
				<div
					class="text-white text-h6 text-bold q-pl-md q-py-sm"
					style="background-color: #668a81; width: 50vw"
				>
					BILL TO
				</div>
				<div class="q-mt-md q-ml-md">{{ client.name }}</div>
			</div>
			<q-table
				class="invoice-items-table"
				color="#EFF0F4"
				:rows="rows"
				:columns="columns"
				row-key="sequenceNumber"
				:rows-per-page-options="[0]"
				virtual-scroll
				hide-pagination
				flat
			/>
			<div class="row justify-end q-mr-lg q-mt-xl">
				<table style="border-collapse: collapse" class="text-subtitle1">
					<tr>
						<td>SubTotal</td>
						<td>:</td>
						<td class="row justify-end">{{ formatPrice(subtotal) }}</td>
					</tr>
					<tr>
						<td>GST(10%)</td>
						<td>:</td>
						<td class="row justify-end">{{ formatPrice(gst) }}</td>
					</tr>

					<tr class="text-bold">
						<td class="border-top-black">TOTAL</td>
						<td class="border-top-black"></td>
						<td class="border-top-black">{{ formatPrice(total) }}</td>
					</tr>
				</table>
			</div>
			<div class="q-mt-xl" style="width: 300px">
				<div>Terms & Payment Instructions</div>
				<q-separator color="black" class="q-my-md" />
				<div>Thank you for your business!</div>
				<div>Payment may be made in the following way:</div>
				<div>Bank: CBA - Commonwealth bank</div>
				<div>Account Name: Tassie Web</div>
				<div>BSB: 123456</div>
				<div>Account Number: 1234-5678</div>
			</div>
		</div>
	</div>
	<div class="row justify-center">
		<q-btn
			push
			class="q-my-xl text-capitalize"
			color="green"
			type="submit"
			label="Produce PDF"
			size="1.3rem"
			@click="onGenerateInvoicePDF()"
		/>
	</div>
</template>

<script>
import { getInvoice } from '@/apis/firestore';
import { formatDate } from '@/helpers/time';
import { priceFormatter } from '@/helpers/common';
import { uploadInvoicePdf } from '@/apis/storage';
import { QSpinnerFacebook } from 'quasar';
import html2pdf from 'html2pdf.js';
export default {
	props: {
		invoiceId: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		client: {},
		invoiceNumber: '',
		invoiceDate: '',
		dueDate: '',
		pdfFileName: '',
		columns: [
			{
				name: 'sequenceNumber',
				label: '#',
				field: 'sequenceNumber',
				align: 'center',
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
				format: (val) => (val ? `${priceFormatter(val)}` : val),
				align: 'center',
				sortable: true,
			},
			{
				name: 'amount',
				label: 'Amount',
				field: 'amount',
				format: (val) => (val ? `${priceFormatter(val)}` : val),
				align: 'center',
				sortable: true,
			},
		],
		rows: [],
	}),
	computed: {
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
		this.showLoadingData();
		const { client, items, invoiceNumber, invoiceDate, dueDate } =
			await getInvoice(this.invoiceId);
		this.pdfFileName = `INV${invoiceNumber}-${client.name}`;
		this.client = client;
		this.invoiceNumber = invoiceNumber;
		this.invoiceDate = formatDate(invoiceDate.toDate());
		this.dueDate = formatDate(dueDate.toDate());
		this.rows = items.map(({ description, qty, unitPrice }, index) => ({
			sequenceNumber: index + 1,
			description,
			qty,
			unitPrice,
			amount: qty * unitPrice,
		}));
		this.$q.loading.hide();
	},

	methods: {
		formatPrice: priceFormatter,
		showLoadingData() {
			this.$q.loading.show({
				spinner: QSpinnerFacebook,
				spinnerColor: 'blue',
				spinnerSize: 140,
				message: 'Loading Data. . .',
				messageColor: 'white',
			});
		},
		showLoadingPdfGeneration() {
			this.$q.loading.show({
				spinnerColor: 'blue',
				spinnerSize: 140,
				message: 'Generating PDF. . .',
				messageColor: 'white',
			});
		},
		async onGenerateInvoicePDF() {
			this.showLoadingPdfGeneration();
			const opt = {
				margin: 1,
				filename: `${this.pdfFileName}.pdf`,
				image: { type: 'png', quality: 1 },
				html2canvas: {
					dpi: 192,
					letterRendering: true,
					scale: 1,
					useCORS: true,
				},
				jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
			};
			const invoiceContainer = this.$refs.invoiceContainer;
			const pdf = await html2pdf()
				.set(opt)
				.from(invoiceContainer)
				.outputPdf('blob', 'my-invoice.pdf');
			const { status } = await uploadInvoicePdf(
				this.invoiceId,
				pdf,
				`invoices/${opt.filename}`
			);
			this.$q.loading.hide();
			if (status) {
				this.$router.push({ path: '/invoices' });
				this.$q.notify({
					type: 'positive',
					message: `PDF for Invoice ${this.invoiceNumber} has been successfully generated.`,
					position: 'top',
				});
			} else {
				this.$q.notify({
					type: 'negative',
					message: `Something went wrong, please try again later.`,
					position: 'top',
				});
			}
		},
	},
};
</script>

<style lang="scss">
.invoice-items-table {
	.q-table__top,
	th {
		background-color: #668a81;
		color: white;
		font-size: large;
		font-weight: bold;
	}
	td {
		background-color: #f5f5f5;
	}
}
</style>
<style lang="scss" scoped>
.border-top-black {
	border-top: 1px solid black;
}
</style>
