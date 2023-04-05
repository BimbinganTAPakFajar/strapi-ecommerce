'use strict';

/**
 * packaging router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::packaging.packaging');
