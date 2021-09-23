// VARIABLES ================================================

let home = {
	initialise: undefined,
	sendNewsletter: undefined,
	emailEducators: undefined,
};

// FUNCTIONS ================================================

home.initialise = async function () {
	document.querySelector("#newsletter-email-submit").addEventListener("click", function () {
		home.sendNewsletter();
	});
	document.querySelector("#educator-email-submit").addEventListener("click", function () {
		home.emailEducators();
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

home.createJoinOrg = async function () {
	// Send the request to the backend
	let data;
	try {
		data = (await axios.post("/organisation/create-join-email"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	console.log(data);
	// Success handler
	return;
};

// END ======================================================
