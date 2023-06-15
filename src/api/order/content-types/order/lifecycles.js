const { v4: uuidv4 } = require("uuid");
const getTotalAmount = (cart) => {
  const totalAmount = {};
  cart.forEach((item) => {
    const itemId = item.id;
    const itemAmount = item.amount;
    if (itemId in totalAmount) {
      totalAmount[itemId] += itemAmount;
    } else {
      totalAmount[itemId] = itemAmount;
    }
  });
  return totalAmount;
};
module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    console.log(data.uuid);
    data.uuid = uuidv4();
  },
  async afterUpdate(event) {
    const { data } = event.params;
    if (data.status === "Pesanan Diproses") {
      const amounts = getTotalAmount(data.cart);
      Object.keys(amounts).forEach(async (itemId) => {
        const product = await strapi.entityService.findOne(
          "api::product.product",
          itemId,
          {
            populate: "*",
          }
        );
        const newProduct = await strapi.entityService.update(
          "api::product.product",
          itemId,
          {
            data: {
              stock: product.stock - amounts[itemId],
            },
          }
        );
        const productDetail = product.product_detail;
        const itemAmount = amounts[itemId];
        const sold = productDetail.sold + itemAmount;
        const newProductDetail = await strapi.entityService.update(
          "api::product-detail.product-detail",
          productDetail.id,
          {
            data: {
              sold: sold,
            },
          }
        );
      });
    }
  },
};
