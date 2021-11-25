// VARIABLES ================================================

let home = {
	initialise: undefined,
	updateColdEmails: undefined,
	populateUnverifiedGroups: undefined,
	verifyGroup: undefined,
};

// FUNCTIONS ================================================

home.initialise = async function () {
	try {
		await home.populateUnverifiedGroups();
	} catch (error) {
		console.log(error);
	}
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
	const element = document.querySelector("#unverified-group-list");
	element.innerHTML = `<div class="spinner-border" role="status"></div>`;
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
	const html = `<thead>
		<tr><th class="p-3" scope="col">Name</th></tr>
		<tr><th class="p-3" scope="col">Creator</th></tr>
		<tr><th class="p-3" scope="col">Location</th></tr>
		<tr><th class="p-3" scope="col">Actions</th></tr>
	</thead>`;
	element.innerHTML = html;
	for (let i = 0; i < data.content.length; i++) {
		const group = data.content[i];
		const html = `<tbody id="body-${group._id}">
			<tr><td class="p-3">${group.name}</td></tr>
			<tr><td class="p-3">${group.licenses.active.find((license) => license.role === "admin").profile.account.email}</td></tr>
			<tr><td class="p-3">${group.location.address}, ${group.location.city}, ${group.location.country}</td></tr>
			<tr>
				<td class="p-3">
					<button type="button" class="px-4 py-2 btn btn-primary" value="${group._id}" onclick="home.verifyGroup(this);">
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
