/* ========================================================================================
VARIABLES
======================================================================================== */

let wallet = {
  bankTransfer: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @FUNC  wallet.bankTransfer
// @TYPE  ASYNC
// @DESC  
wallet.bankTransfer = async () => {
  // INITIALISE HANDLER
  document.querySelector("#bank-transfer-button").setAttribute("disabled", "");
  // COLLECT FORM INPUTS
  const inputs = new FormData(document.querySelector("#bank-transfer"));
  const bankTransfer = { code: inputs.get("code"), amount: inputs.get("amount") };
  // VALIDATE INPUTS
  if (!bankTransfer.code) {
    return;
  } else if (!bankTransfer.amount) {
    return;
  }
  // SUBMIT REQUEST
  let data;
  try {
    data = (await axios.post("/wallet/bankTransfer", bankTransfer))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // FAILED HANDLER
  if (data.status === "error") {
    console.log(data.content);
    return;
  } else if (data.status === "failed") {
    console.log(data.content);
    return;
  }
  // SUCCEED HANDLER
  // enable button
  document.querySelector("#bank-transfer-button").removeAttribute("disabled");
  // clear input field
  document.querySelector("#bank-transfer-code").value = "";
  document.querySelector("#bank-transfer-amount").value = "";
  return;
}

/* ========================================================================================
END
======================================================================================== */