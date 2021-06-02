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
    // "published_at",
    "formats",
    "previewUrl",
    "provider_metadata",
    "alternativeText",
    "caption",
    "hash",
    "width",
    "height",
    "size",
    "ext",
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
   * Create post.
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
    const preCleanedResponse = sanitizeEntity(entity, {
      model: strapi.models.post,
    });
    return cleanUps(preCleanedResponse);
  },

  /**
   * Retrieve single post.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.post.findOne({ id });
    return cleanUps(sanitizeEntity(entity, { model: strapi.models.post }));
  },

  /**
   * Find posts.
   *
   * @return {Object}
   */

  async find(ctx) {
    let entities;
    let response = {};
    let { _start, _limit } = ctx.query;
    let limit = parseInt(_limit) || 5;
    let start = parseInt(_start) || 0;

    if (ctx.query._q) {
      entities = await strapi.services.post.search(ctx.query);
    } else {
      entities = await strapi.services.post.find({
        _start: start,
        _limit: limit,
      });
    }
    let cleanedEntities = entities.map((entity) =>
      cleanUps(sanitizeEntity(entity, { model: strapi.models.post }))
    );

    const total = await strapi.query("post").count();
    const nextStart = start + limit;
    const prevStart = start - limit;
    console.log(nextStart);
    response["count"] = total;
    response["next"] =
      total <= nextStart
        ? null
        : `http://localhost:1337/posts?_start=${nextStart}&_limit=${limit}`;
    response["previous"] =
      start < limit
        ? null
        : `http://localhost:1337/posts?_start=${prevStart}&_limit=${limit}`;
    response["data"] = cleanedEntities;
    return response;
  },

  /**
   * Delete post.
   *
   * @return {Object}
   */

  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.query("post").delete({ id });
    console.log(entity);
    // const entity2 = await strapi.query("post").delete({ id });
    // console.log(entity2);
    if (entity) {
      try {
        if (entity.attachments) {
          for (let attachment in entity.attachments) {
            console.log(attachment, "here attach");
            await strapi.plugins.upload.services.upload.remove(attachment);
          }
        }
        if (entity.replies) {
          for (let reply in entity.replies) {
            console.log(reply, "here repliy");
            await strapi.services.replies.delete(reply.id);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    return {
      message: "Post and all its attachement and replies has been deleted",
    };
  },
};
