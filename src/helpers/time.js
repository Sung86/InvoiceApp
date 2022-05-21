export const formatDate = (date) => {
	const tokenised = date.toString().split(' ');
	const day = tokenised[2];
	const month = tokenised[1];
	const year = tokenised[3];

	return `${day} ${month} ${year}`;
};
