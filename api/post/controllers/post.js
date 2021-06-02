"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const _ = require("lodash");

const cleanUps = (entity) => {
  const sanitizedValue = _.omit(entity, [
    "confirmed",
    "blocked",
    "role",
    "provider",
    "phone",
    "address",
    "wallet_balance",
    "created_at",
    "updated_at",
    "locals",
    "published_at",
    "formats",
    "previewUrl",
    "provider_metadata",
    "alternativeText",
    "caption",
    "hash",
    "width",
    "height",
    "size",
    "ext"
  ]);

  _.forEach(sanitizedValue, (value, key) => {
    if (_.isArray(value)) {
      sanitizedValue[key] = value.map(cleanUps);
    } else if (_.isObject(value)) {
      sanitizedValue[key] = cleanUps(value);
    }
  });

  return sanitizedValue;
};

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.create(data, { files });
    } else {
      entity = await strapi.services.post.create(ctx.request.body);
    }
    return cleanUps(sanitizeEntity(entity, { model: strapi.models.post }));
  },

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.post.search(ctx.query);
    } else {
      entities = await strapi.services.post.find(ctx.query);
    }

    return entities.map((entity) =>
      cleanUps(sanitizeEntity(entity, { model: strapi.models.post }))
    );
  },
};
