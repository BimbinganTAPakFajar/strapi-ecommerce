const { v4: uuidv4 } = require("uuid");

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    data.uuid = uuidv4();
  },
};
