// VARIABLES ================================================

let dashboard = {
	initialise: undefined,
	renderChart: undefined,
	userDetail: undefined,

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
	let studentCount = 0;
	let teacherCount = 0;
	let labels = [];
	let values = [];
	for (let i = 0; i < numberOfDays; i++) {
		const label = moment().subtract(i, "days").format("ddd, D MMM");
		document.querySelector("#user-detail").insertAdjacentHTML("beforeend", `<h1>${label}</h1>`);
		let value = 0;
		for (let j = 0; j < profiles.length; j++) {
			const profile = profiles[j];
			let skip = false;
			for (let k = 0; k < profile.licenses.length; k++) {
				const license = profile.licenses[k];
				if (license.group.name === "CreateBase School") skip = true;
			}
			if (skip) continue;
			const lastVisit = moment(profile.date.visited).format("ddd, D MMM");
			if (label === lastVisit) {
				value++;
				totalValue++;
				for (let l = 0; l < profile.licenses.length; l++) {
					const role = profile.licenses[l].role;
					if (role === "admin" || role === "teacher") {
						teacherCount++;
					} else if (role === "student") {
						studentCount++;
					}
				}
				dashboard.userDetail(profile);
			}
		}
		values.unshift(value);
		labels.unshift(label);
	}
	const data = {
		labels: labels,
		datasets: [{ label: `${totalValue} unique users (${teacherCount} teachers and ${studentCount} students) visited in the last ${numberOfDays} days`, data: values }],
	};
	const config = {
		type: "bar",
		data: data,
		options: { scales: { y: { beginAtZero: true } } },
	};
	dashboard.dailyActive = new Chart(document.getElementById("daily-active"), config);
	return;
};

dashboard.userDetail = function (profile) {
	let groups = "";
	for (let i = 0; i < profile.licenses.length; i++) {
		const license = profile.licenses[i];
		if (groups === "") {
			groups += `${license.group.name} (${license.role})`;
		} else {
			groups += `, ${license.group.name} (${license.role})`;
		}
	}
	if (groups !== "") {
		groups += ".";
	} else {
		groups += "No group.";
	}
	let email;
	if (profile.account.local) {
		email = profile.account.local.email;
	} else if (profile.account.google) {
		email = profile.account.google.email;
	}
	const html = `
<div>
	<p>-----------------------------------------------------</p>
	<p>${profile.name.first} ${profile.name.last} (${email})</p>
	<p>${groups}</p>
	<p>Created: ${moment(profile.date.created).format("ddd, D MMM YY, hh:mm a")} | Modified: ${moment(profile.date.modified).format("ddd, D MMM YY, hh:mm a")} | Visited: ${moment(
		profile.date.visited
	).format("ddd, D MMM YY, hh:mm a")}</p>
</div>
`;
	return document.querySelector("#user-detail").insertAdjacentHTML("beforeend", html);
};

// END ======================================================
