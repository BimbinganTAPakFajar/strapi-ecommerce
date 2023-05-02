const { v4: uuidv4 } = require("uuid");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    console.log(data.uuid);
    data.uuid = uuidv4();
  },
};
