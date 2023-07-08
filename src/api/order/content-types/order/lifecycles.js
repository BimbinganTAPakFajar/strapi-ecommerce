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
    const {
      where: { id },
      data,
    } = event.params;
    console.log(event.params.populate, "POPULATE");
    if (data.status === "Pesanan Diproses" && data.resi !== null) {
      const order = await strapi.entityService.findOne("api::order.order", id, {
        populate: "*",
      });
      console.log("ORDER", order);
      const amounts = getTotalAmount(order.cart);
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
