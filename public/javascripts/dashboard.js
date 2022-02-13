// VARIABLES ================================================

let dashboard = {
	initialise: undefined,
	renderChart: undefined,

	dailyActive: undefined,
};

// FUNCTIONS ================================================

dashboard.initialise = async function () {
	dashboard.renderChart();
	return;
};

dashboard.renderChart = async function () {
	const numberOfDays = 7;
	// Fetch all of the profiles
	let data1;
	try {
		data1 = (await axios.post("/dashboard/fetch-profiles"))["data"];
	} catch (error) {
		data1 = { status: "error", content: error };
	}
	const profiles = data1.content;
	let totalValue = 0;
	let labels = [];
	let values = [];
	for (let i = 0; i < numberOfDays; i++) {
		const label = moment().subtract(i, "days").format("ddd, D MMM");
		let value = 0;
		for (let j = 0; j < profiles.length; j++) {
			const profile = profiles[j];
			const lastVisit = moment(profile.date.visited).format("ddd, D MMM");
			if (label === lastVisit) {
				value++;
				totalValue++;
				console.log(profile);
			}
		}
		values.unshift(value);
		labels.unshift(label);
	}
	const data = {
		labels: labels,
		datasets: [{ label: `${totalValue} unique users visited in the last ${numberOfDays} days`, data: values }],
	};
	const config = {
		type: "bar",
		data: data,
		options: { scales: { y: { beginAtZero: true } } },
	};
	dashboard.dailyActive = new Chart(document.getElementById("daily-active"), config);
	return;
};

// END ======================================================
