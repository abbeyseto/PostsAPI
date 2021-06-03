"use strict";

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
   * Create replies.
   * It accepts contentType/json and multipart/data for file inputs
   * @return {Object}
   */
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.replies.create(data, { files });
    } else {
      entity = await strapi.services.replies.create(ctx.request.body);
    }
    const preCleanedResponse = sanitizeEntity(entity, {
      model: strapi.models.replies,
    });
    return cleanUps(preCleanedResponse);
  },

  /**
   * Retrieve single reply.
   * Finds a replies by the ID of the replies
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.replies.findOne({ id });
    return cleanUps(sanitizeEntity(entity, { model: strapi.models.replies }));
  },

  /**
   * Find replies.
   * replies are returned in a paginated format based on limit used.
   * @return {Object}
   */
  async find(ctx) {
    let entities;
    let response = {};
    let { _start, _limit, post_id } = ctx.query;
    let limit = parseInt(_limit) || 5;
    let start = parseInt(_start) || 0;

    if (ctx.query._q) {
      console.log(ctx.query);
      entities = await strapi.services.replies.search(ctx.query);
    } else {
      entities = await strapi.services.replies.find({
        _start: start,
        _limit: limit,
        post_id: post_id
      });
    }
    let cleanedEntities = entities.map((entity) =>
      cleanUps(sanitizeEntity(entity, { model: strapi.models.replies }))
    );

    const total = await strapi.query("replies").count();
    const nextStart = start + limit;
    const prevStart = start - limit;
    response["count"] = total;
    response["next"] = total <= nextStart ? null : `http://localhost:1337/repliess?_start=${nextStart}&_limit=${limit}`;
    response["previous"] = start < limit ? null : `http://localhost:1337/repliess?_start=${prevStart}&_limit=${limit}`;
    response["data"] = cleanedEntities;
    return response;
  },

  /**
   * Update a replies.
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.replies.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.replies.update({ id }, ctx.request.body);
    }

    return cleanUps(sanitizeEntity(entity, { model: strapi.models.replies }));
  },

  /**
   * Delete replies.
   * @return {Object}
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.query("replies").delete({ id });

    if (entity) {
      try {
        if (entity.attachments) {
          for (let attachment in entity.attachments) {
            await strapi.plugins.upload.services.upload.remove(attachment);
          }
        }
        if (entity.replies) {
          for (let reply in entity.replies) {
            await strapi.services.replies.delete(reply.id);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    return {
      message: "replies and all its attachement and replies has been deleted",
    };
  },
};
