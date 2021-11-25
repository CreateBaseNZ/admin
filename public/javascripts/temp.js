// VARIABLES ================================================

let temp = {
	initialise: undefined,
	tempSubscribeUsers: undefined,
	tempNotifyUsers: undefined,
};

// FUNCTIONS ================================================

temp.initialise = async function () {
	return;
};

temp.tempSubscribeUsers = async function (element) {
	element.disabled = true;
	element.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>`;
	let data;
	try {
		data = (await axios.get("/temp/subscribe-users"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status !== "succeeded") {
		element.innerHTML = "Error!";
		throw new Error("error");
	}
	element.disabled = false;
	element.innerHTML = `Subscribe Users`;
	// Success handler
	return;
};

temp.tempNotifyUsers = async function (element) {
	element.disabled = true;
	element.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>`;
	let data;
	try {
		data = (await axios.get("/temp/notify-users"))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status !== "succeeded") {
		element.innerHTML = "Error!";
		throw new Error("error");
	}
	element.disabled = false;
	element.innerHTML = `Notify Users`;
	// Success handler
	return;
};

// END ======================================================
