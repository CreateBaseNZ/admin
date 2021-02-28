/* ==========================================================
VARIABLES
========================================================== */

let dashboard = {
  init: {
    init: undefined
  },

  upload: {
    avatar: undefined,
    image: undefined
  }
}

/* ==========================================================
FUNCTIONS
========================================================== */

dashboard.upload.avatar = async () => {
  // Disable button
  // TO DO
  // Collect inputs
  // Collect input
  let input;
  const file = document.querySelector("#avatar-input");
  if (file.files.length !== 0) {
    input = await global.compressImage("#avatar-form", "avatar", 300);
  } else {
    input = new FormData();
  }
  // Validate input
  const avatar = input.get("avatar");
  if (!avatar) return console.log("Please provide an image");
  // Send the file to the backend
  let data;
  try {
    data = (await axios.post("/dashboard/upload/default-avatar", input))["data"];
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
  console.log(data.content);
  return;
}

dashboard.upload.image = async () => {
  // Disable button
  // TO DO
  // Collect inputs
  // Collect input
  let input;
  const file = document.querySelector("#image-input");
  if (file.files.length !== 0) {
    input = await global.compressImagePNG("#image-form", "image", 500);
  } else {
    input = new FormData();
  }
  // Validate input
  const image = input.get("image");
  if (!image) return console.log("Please provide an image");
  // Send the file to the backend
  let data;
  try {
    data = (await axios.post("/dashboard/upload/image", input))["data"];
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
  console.log(data.content);
  return;
}

/* ==========================================================
END
========================================================== */