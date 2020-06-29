/* ========================================================================================
VARIABLES
======================================================================================== */

let orders = {
  initialise: undefined,
  fetch: undefined,
  categorise: undefined,
  // VALIDATED
  populateValidated: undefined,
  addValidated: undefined,
  createValidatedMake: undefined,
  saveValidatedMake: undefined,
  processValidated: undefined,
  // BUILT
  populateBuilt: undefined,
  addBuilt: undefined,
  // CHECKEDOUT
  populateCheckedout: undefined,
  addCheckedout: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @FUNC  orders.initialise
// @TYPE
// @DESC  
orders.initialise = async () => {
  // FETCH ORDERS
  let fetchedOrders;
  try {
    fetchedOrders = await orders.fetch();
  } catch (error) {
    return;
  }
  // SEPARATE ORDERS
  const categorisedOrders = orders.categorise(fetchedOrders);
  // POPULATE ELEMENTS
  orders.populateValidated(categorisedOrders.validated);
  orders.populateBuilt(categorisedOrders.built);
  orders.populateCheckedout(categorisedOrders.checkedout);
}

// @FUNC  orders.fetch
// @TYPE
// @DESC  
orders.fetch = () => {
  return new Promise(async (resolve, reject) => {
    let data;
    try {
      data = (await axios.get("/orders/fetch"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    if (data.status === "error") {
      // TO DO .....
      // ERROR HANDLER
      // TO DO .....
      console.log(data.content); // TEMPORARY
      return reject();
    } else if (data.status === "failed") {
      // TO DO .....
      // FETCH FAILED HANDLER
      // TO DO .....
      console.log(data.content); // TEMPORARY
      return reject();
    }
    return resolve(data.content);
  });
}

// @FUNC  orders.categorise
// @TYPE
// @DESC  
orders.categorise = (fetchedOrders = []) => {
  const checkedout = fetchedOrders.filter(order => order.status === "checkedout");
  const validated = fetchedOrders.filter(order => order.status === "validated");
  const built = fetchedOrders.filter(order => order.status === "built");
  // SUCCESS HANDLER: RETURN CATEGORISED ORDER OBJECT
  return { checkedout, validated, built };
}

/* ----------------------------------------------------------------------------------------
VALIDATED
---------------------------------------------------------------------------------------- */

// @FUNC  orders.populateValidated
// @TYPE
// @DESC  
orders.populateValidated = (validated = []) => {
  if (!validated.length) {
    // TO DO .....
    // NO ORDER HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < validated.length; i++) {
    const order = validated[i];
    orders.addValidated(order);
  }
}

// @FUNC  orders.addValidated
// @TYPE
// @DESC  
orders.addValidated = (order) => {
  // CREATE MAKES HTML
  let makes = "";
  for (let i = 0; i < order.makes.checkout.length; i++) {
    const make = order.makes.checkout[i];
    const html = orders.createValidatedMake(make);
    makes += html;
  }
  // CREATE THE VALIDATED HTML
  const html = `
  <div id="orders-validated-${order._id}">
    <div>${makes}</div>
    <button id="button-${order._id}" onclick="orders.processValidated('${order._id}');">Finish</button>
  </div>`;
  // INSERT THE VALIDATED HTML
  document.querySelector("#orders-validated-container").insertAdjacentHTML("afterbegin", html);
  // SUCCESS HANDLER
  return;
}

// @FUNC  orders.createValidatedMake
// @TYPE
// @DESC  
orders.createValidatedMake = (make) => {
  // CREATE THE HTML
  const html = `
  <div class="orders-validated-make">
    <p>Built: <input type="number" name="built" id="input-${make.id}" value="${make.quantity.built}"></p>
    <p>Ordered: ${make.quantity.ordered}</p>
    <button id="button-${make.id}" onclick="orders.saveValidatedMake('${make.id}');">Save</button>
  </div>
  `;
  // SUCCESS HANDLER
  return html;
}

// @FUNC  orders.saveValidatedMake
// @TYPE
// @DESC  
orders.saveValidatedMake = async (makeId) => {
  // DISABLE BUTTON
  document.querySelector(`#button-${makeId}`).setAttribute("disabled", "");
  // COLLECT INPUT
  const quantity = document.querySelector(`#input-${makeId}`).value;
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/orders/validated/save-make", { makeId, quantity }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return reject();
  } else if (data.status === "failed") {
    // TO DO .....
    // FETCH FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return reject();
  }
  // SUCCESS HANDLER
  // enable button
  document.querySelector(`#button-${makeId}`).removeAttribute("disabled");
  return;
}

// @FUNC  orders.processValidated
// @TYPE
// @DESC  
orders.processValidated = async (orderId) => {
  // DISABLE BUTTON
  document.querySelector(`#button-${orderId}`).setAttribute("disabled", "");
  // SEND REQUEST
  let data;
  try {
    data = (await axios.get("/orders/process-validated"))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return reject();
  } else if (data.status === "failed") {
    // TO DO .....
    // FETCH FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return reject();
  }
  // DELETE ELEMENT
  document.querySelector(`#orders-validated-${orderId}`).remove();
  // ADD ORDER TO BUILT
  orders.addBuilt(order);
  return;
}

/* ----------------------------------------------------------------------------------------
BUILT
---------------------------------------------------------------------------------------- */

// @FUNC  orders.populateBuilt
// @TYPE
// @DESC  
orders.populateBuilt = (built = []) => {
  if (!built.length) {
    // TO DO .....
    // NO ORDER HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < built.length; i++) {
    const order = built[i];
    orders.addBuilt(order);
  }
}

/* ----------------------------------------------------------------------------------------
CHECKEDOUT
---------------------------------------------------------------------------------------- */

// @FUNC  orders.populateCheckedout
// @TYPE
// @DESC  
orders.populateCheckedout = (checkedout = []) => {
  if (!checkedout.length) {
    // TO DO .....
    // NO ORDER HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < built.length; i++) {
    const order = built[i];
    orders.addCheckedout(order);
  }
}

// @FUNC  orders.addCheckedout
// @TYPE
// @DESC  
orders.addCheckedout = (orders) => {
  return;
}

/* ========================================================================================
END
======================================================================================== */