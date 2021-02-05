/* ==========================================================
VARIABLES
========================================================== */

let home = {
  init: {
    init: undefined
  },

  login: {
    collect: undefined,
    disable: undefined,
    enable: undefined,
    loadListeners: undefined,
    submit: undefined,
    validate: undefined
  }
}

/* ==========================================================
FUNCTIONS
========================================================== */

home.init.init = () => {
  // Add login event listeners
  home.login.loadListeners();
}

home.login.collect = () => {
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  const remember = true;
  return { email, password, remember };
}

home.login.loadListeners = () => {
  document.querySelector("#login-button").addEventListener("click", home.login.submit);
}

home.login.submit = async () => {
  // Disable button
  // TO DO
  // Collect inputs
  const inputs = home.login.collect();
  // Validate inputs - frontend
  // TO DO
  // Validate inputs - backend
  let data;
  try {
    data = (await axios.post("/login/validate", inputs))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    console.log(data.content);
    // Enable button
    // TO DO
    return;
  } else if (data.status === "failed") {
    console.log(data.content);
    // Enable button
    // TO DO
    return;
  }
  // Success handler
  document.querySelector("#login-form").submit();
  return;
}

// TO DO
home.login.validate = () => {

}

/* ==========================================================
END
========================================================== */