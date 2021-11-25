// VARIABLES ================================================

let home = {
	initialise: undefined,
	sendNewsletter: undefined,
	emailEducators: undefined,
	updateColdEmails: undefined,
	populateUnverifiedGroups: undefined,
	verifyGroup: undefined,
};

// FUNCTIONS ================================================

home.initialise = async function () {
	// document.querySelector("#newsletter-email-submit").addEventListener("click", function () {
	// 	home.sendNewsletter();
	// });
	// document.querySelector("#educator-email-submit").addEventListener("click", function () {
	// 	home.emailEducators();
	// });
	try {
		await home.populateUnverifiedGroups();
	} catch (error) {
		console.log(error);
	}
	return;
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

home.updateColdEmails = async function (element) {
	element.disabled = true;
	element.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>`;
	let data;
	try {
		data = (await axios.post("/update-cold-emails"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status !== "succeeded") {
		element.innerHTML = "Error!";
		throw new Error("error");
	}
	element.disabled = false;
	element.innerHTML = `Update and Schedule Cold Emails`;
	// Success handler
	return;
};

home.populateUnverifiedGroups = async function () {
	// Fetch unverified groups
	let data;
	try {
		data = (await axios.post("/group/fetch-unverified"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status !== "succeeded" && data.status === "failed") {
		if (data.content.groups !== "do not exists") {
			window.alert("Error!");
			throw new Error("error");
		}
	} else if (data.status !== "succeeded") {
		window.alert("Error!");
		throw new Error("error");
	}
	// Render the group details to the front end
	const element = document.querySelector("#unverified-group-list");
	const html = `<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Creator</th>
		</tr>
		<tr>
			<th scope="col">Location</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>`;
	element.insertAdjacentHTML("beforeend", html);
	for (let i = 0; i < data.content.length; i++) {
		const group = data.content[i];
		const html = `<tbody id="body-${group._id}">
			<tr>
				<td>${group.name}</td>
				<td>${group.licenses.active.find((license) => license.role === "admin").profile.account.email}</td>
			</tr>
			<tr>
				<td>${group.location.address}, ${group.location.city}, ${group.location.country}</td>
				<td>
					<button type="button" class="btn btn-primary" value="${group._id}" onclick="home.verifyGroup(this);">
						Verify
					</button>
				</td>
			</tr>
		</tbody>`;
		element.insertAdjacentHTML("beforeend", html);
	}
	return;
};

home.verifyGroup = async function (element) {
	element.disabled = true;
	element.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>`;
	// Create the input object
	const input = { query: { _id: element.value }, date: new Date().toString() };
	// Fetch unverified groups
	let data;
	try {
		data = (await axios.post("/group/verify", { input }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status !== "succeeded") {
		element.innerHTML = "Error!";
		throw new Error("error");
	}
	element.disabled = false;
	element.innerHTML = `Verify`;
	// Remove the element
	document.querySelector(`#body-${element.value}`).remove();
	// Success handler
	return;
};

// END ======================================================
