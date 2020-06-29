/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
CREATE COMMENT MODEL
=========================================================================================*/

const ChunkSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  files_id: { type: Schema.Types.ObjectId },
  n: { type: Number },
  data: { type: Buffer }
});

/*=========================================================================================
EXPORT COMMENT MODEL
=========================================================================================*/

module.exports = Comment = mongoose.model("fs.chunk", ChunkSchema);

/*=========================================================================================
END
=========================================================================================*/
