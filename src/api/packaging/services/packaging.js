'use strict';

/**
 * packaging service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::packaging.packaging');
