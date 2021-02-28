/* ==========================================================
VARIABLES
========================================================== */

let global = {
  compressImage: undefined,
  compressImagePNG: undefined,
  readImage: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

/**
 * Compress the image file.
 * @param {String} identifier 
 * @param {String} name 
 * @param {Number} compressSize 
 */
global.compressImage = async (identifier = "", name = "", compressSize = 300) => {
  return new Promise(async (resolve) => {
    // Collect image
    const element = document.querySelector(identifier);
    let input = new FormData(element);
    const file = input.get(name);
    // Compress image
    const canvas = await global.readImage(file, compressSize);
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 1);
    });
    const newFile = new File([blob], file.name, {
      type: "image/jpeg", lastModified: Date.now()
    });
    // Update input
    input.set(name, newFile);
    // Return success handler
    return resolve(input);
  });
}

/**
 * Compress the image file.
 * @param {String} identifier 
 * @param {String} name 
 * @param {Number} compressSize 
 */
global.compressImagePNG = async (identifier = "", name = "", compressSize = 300) => {
  return new Promise(async (resolve) => {
    // Collect image
    const element = document.querySelector(identifier);
    let input = new FormData(element);
    const file = input.get(name);
    // Compress image
    const canvas = await global.readImage(file, compressSize);
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png", 1);
    });
    const newFile = new File([blob], file.name, {
      type: "image/png", lastModified: Date.now()
    });
    // Update input
    input.set(name, newFile);
    // Return success handler
    return resolve(input);
  });
}

/**
 * Read the image and draw compressed image into a canvas.
 * @param {File} file 
 * @param {Number} compressSize 
 */
global.readImage = (file, compressSize = 300) => {
  return new Promise(async (resolve) => {
    let canvas = document.createElement("canvas");
    let img = document.createElement("img");
    // Set properties of the image element
    img.src = await new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target.result);
    });
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    // Set the compress size
    let height = undefined;
    let width = undefined;
    let scaleFactor = undefined;
    if (img.height >= img.width && img.height > compressSize) {
      scaleFactor = compressSize / img.height;
      height = compressSize;
      width = img.width * scaleFactor;
    } else if (img. height < img.width && img.width > compressSize) {
      scaleFactor = compressSize / img.width;
      height = img.height * scaleFactor;
      width = compressSize;
    } else {
      width = img.width;
      height = img.height;
    }
    // Draw the compressed image onto the canvas
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    // Return compressed image
    return resolve(canvas);
  });
}

/* ==========================================================
END
========================================================== */