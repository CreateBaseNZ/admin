// VARIABLES ================================================

let home = {
	initialise: undefined,
	sendNewsletter: undefined,
	emailEducators: undefined,
	fetchSchools: undefined,
	refactor: undefined,
	updateColdEmails: undefined,
	sendColdEmails: undefined,
};

// FUNCTIONS ================================================

home.initialise = async function () {
	// document.querySelector("#newsletter-email-submit").addEventListener("click", function () {
	// 	home.sendNewsletter();
	// });
	// document.querySelector("#educator-email-submit").addEventListener("click", function () {
	// 	home.emailEducators();
	// });
	// document.querySelector("#fetch-schools").addEventListener("click", function () {
	// 	home.fetchSchools();
	// });
	// document.querySelector("#refactor").addEventListener("click", function () {
	// 	home.refactor();
	// });
	document.querySelector("#update-cold-emails").addEventListener("click", function () {
		home.updateColdEmails();
	});
	document.querySelector("#send-cold-emails").addEventListener("click", function () {
		home.sendColdEmails();
	});
};

home.sendNewsletter = async function () {
	// Construct the input
	const input = {
		group: document.querySelector("#newsletter-email-group").value,
		subject: document.querySelector("#newsletter-email-subject").value,
		body: document.querySelector("#newsletter-email-body").value,
	};
	// TODO: Perform the validation
	// Send the request to the backend
	let data;
	try {
		data = (await axios.post("/send-newsletter", { input }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
	// Success handler
	return;
};

home.emailEducators = async function () {
	// Construct the input
	const input = {
		subject: document.querySelector("#educator-email-subject").value,
		body: document.querySelector("#educator-email-body").value,
	};
	// TODO: Perform the validation
	// Send the request to the backend
	let data;
	try {
		data = (await axios.post("/email-educator", { input }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
	// Success handler
	return;
};

home.fetchSchools = async function () {
	let data;
	try {
		data = (await axios.get("https://catalogue.data.govt.nz/api/3/action/datastore_search?resource_id=20b7c271-fd5a-4c9e-869b-481a0e2453cd&limit=3000"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data.result.records);
};

home.refactor = async function () {
	let data;
	try {
		data = (await axios.post("/refactor-mails"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
};

home.updateColdEmails = async function () {
	let data;
	try {
		data = (await axios.post("/update-cold-emails"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
};

home.sendColdEmails = async function () {
	let data;
	try {
		data = (await axios.post("/send-cold-emails"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
};

// END ======================================================
