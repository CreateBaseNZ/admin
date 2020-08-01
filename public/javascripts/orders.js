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
  saveTracking: undefined,
  processBuilt: undefined,
  // SHIPPED: PICKUP
  populateShippedPickup: undefined,
  addShippedPickup: undefined,
  processShippedPickup: undefined,
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
  orders.populateShippedPickup(categorisedOrders.shippedPickup);
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
  const shippedPickup = fetchedOrders.filter(order => {
    return (order.status === "shipped" && order.shipping.method === "pickup");
  })
  // SUCCESS HANDLER: RETURN CATEGORISED ORDER OBJECT
  return { checkedout, validated, built, shippedPickup };
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
    const html = orders.createValidatedMake(make, order._id);
    makes += html;
  }
  // CREATE THE VALIDATED HTML
  const html = `
  <div id="orders-validated-${order._id}">
    <div>${makes}</div>
    <button id="button-${order._id}" onclick="orders.processValidated('${order._id}');">Process</button>
  </div>
  `;
  // INSERT THE VALIDATED HTML
  document.querySelector("#orders-validated-container").insertAdjacentHTML("afterbegin", html);
  // SUCCESS HANDLER
  return;
}

// @FUNC  orders.createValidatedMake
// @TYPE
// @DESC  
orders.createValidatedMake = (make, orderId) => {
  // CREATE THE HTML
  const html = `
  <div class="orders-validated-make">
    <p>Built: <input type="number" id="input-${make.id}" value="${make.quantity.built}"></p>
    <p>Ordered: ${make.quantity.ordered}</p>
    <button id="button-${make.id}" onclick="orders.saveValidatedMake('${make.id}', '${orderId}');">Save</button>
  </div>
  `;
  // SUCCESS HANDLER
  return html;
}

// @FUNC  orders.saveValidatedMake
// @TYPE
// @DESC  
orders.saveValidatedMake = async (makeId, orderId) => {
  // DISABLE BUTTON
  document.querySelector(`#button-${makeId}`).setAttribute("disabled", "");
  document.querySelector(`#button-${orderId}`).setAttribute("disabled", "");
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
    document.querySelector(`#button-${makeId}`).removeAttribute("disabled");
    document.querySelector(`#button-${orderId}`).removeAttribute("disabled");
    return reject();
  }
  // SUCCESS HANDLER
  // enable button
  document.querySelector(`#button-${makeId}`).removeAttribute("disabled");
  document.querySelector(`#button-${orderId}`).removeAttribute("disabled");
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
    data = (await axios.post("/orders/process-validated", { orderId }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    // TO DO .....
    // FETCH FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    document.querySelector(`#button-${orderId}`).removeAttribute("disabled");
    return;
  }
  // DELETE ELEMENT
  document.querySelector(`#orders-validated-${orderId}`).remove();
  // ADD ORDER TO BUILT
  orders.addBuilt(data.content);
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

// @FUNC  orders.addBuilt
// @TYPE
// @DESC  
orders.addBuilt = (order = {}) => {
  // CREATE THE BUILT HTML
  let tracking = "";
  if (order.shipping.method !== "pickup") {
    tracking = `
    <input type="text" name="tracking" id="input-${order._id}" value="${order.shipping.tracking}">
    <button id="button-save-${order._id}" onclick="orders.saveTracking('${order._id}');">Save</button>
    `;
  }
  const html = `
  <div id="orders-built-${order._id}">
    ${tracking}
    <button id="button-process-${order._id}" onclick="orders.processBuilt('${order._id}');">Process</button>
  </div>
  `;
  // INSERT THE BUILT HTML
  document.querySelector("#orders-built-container").insertAdjacentHTML("afterbegin", html);
  // SUCCESS HANDLER
  return;
}

// @FUNC  orders.saveTracking
// @TYPE
// @DESC  
orders.saveTracking = async (orderId) => {
  // DISABLE BUTTONS
  document.querySelector(`#button-save-${orderId}`).setAttribute("disabled", "");
  document.querySelector(`#button-process-${orderId}`).setAttribute("disabled", "");
  // COLLECT INPUT
  const tracking = document.querySelector(`#input-${orderId}`).value;
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/orders/save-tracking", { orderId, tracking }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    // TO DO .....
    // FETCH FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    document.querySelector(`#button-save-${orderId}`).removeAttribute("disabled");
    document.querySelector(`#button-process-${orderId}`).removeAttribute("disabled");
    return;
  }
  // ENABLE BUTTONS
  document.querySelector(`#button-save-${orderId}`).removeAttribute("disabled");
  document.querySelector(`#button-process-${orderId}`).removeAttribute("disabled");
  // SUCCESS HANDLER
  return;
}

// @FUNC  orders.processBuilt
// @TYPE
// @DESC  
orders.processBuilt = async (orderId) => {
  // DISABLE BUTTONS
  document.querySelector(`#button-process-${orderId}`).setAttribute("disabled", "");
  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/orders/process-built", { orderId }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    // TO DO .....
    // FETCH FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    document.querySelector(`#button-save-${orderId}`).removeAttribute("disabled");
    document.querySelector(`#button-process-${orderId}`).removeAttribute("disabled");
    return;
  }
  // DELETE ELEMENT
  document.querySelector(`#orders-built-${orderId}`).remove();
  // SUCCESS HANDLER
  return;
}

/* ----------------------------------------------------------------------------------------
SHIPPED: PICKUP
---------------------------------------------------------------------------------------- */

// @FUNC  orders.populateShippedPickup
// @TYPE
// @DESC  
orders.populateShippedPickup = (shippedPickup = []) => {
  if (!shippedPickup.length) {
    // TO DO .....
    // NO ORDER HANDLER
    // TO DO .....
    return;
  }
  for (let i = 0; i < shippedPickup.length; i++) {
    const order = shippedPickup[i];
    orders.addShippedPickup(order);
  }
}

// @FUNC  orders.addShippedPickup
// @TYPE
// @DESC  
orders.addShippedPickup = (order = {}) => {
  // CREATE THE SHIPPED PICKUP HTML
  const html = `
  <div id="orders-shipped-pickup-${order._id}">
    ${tracking}
    <button id="button-${order._id}" onclick="orders.processShippedPickup('${order._id}');">Picked Up</button>
  </div>
  `;
  // INSERT THE SHIPPED PICKUP HTML
  document.querySelector("#orders-shipped-pickup-container").insertAdjacentHTML("afterbegin", html);
  // SUCCESS HANDLER
  return;
}

// @FUNC  orders.processShippedPickup
// @TYPE
// @DESC  
orders.processShippedPickup = async (orderId) => {

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