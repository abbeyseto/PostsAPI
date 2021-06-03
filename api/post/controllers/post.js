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
   * Create post.
   * It accepts contentType/json and multipart/data for file inputs
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
   * Finds a post by the ID of the post
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.post.findOne({ id });
    return cleanUps(sanitizeEntity(entity, { model: strapi.models.post }));
  },

  /**
   * Find posts.
   * Post are returned in a paginated format based on limit used.
   * @return {Object}
   */
  async find(ctx) {
    let entities;
    let response = {};
    let { _start, _limit } = ctx.query;
    let limit = parseInt(_limit) || 5;
    let start = parseInt(_start) || 0;
    
    if (ctx.query._q) {
      console.log("Query called");
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
   * Update a post.
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.post.update({ id }, ctx.request.body);
    }

    return cleanUps(sanitizeEntity(entity, { model: strapi.models.post }));
  },

  /**
   * Update a post.
   *
   * @return {Object}
   */

  async like(ctx) {
    const { id, user_id } = ctx.params;
    const { liked } = ctx.request.body;
    let entity = await strapi.services.post.findOne({ id });
    let updatedEntity;

    //If Liked value is @true
    if (liked) {
      const found =
        entity.likes.length === 0
          ? false
          : entity.likes.some((el) => el.id === parseInt(user_id));
      if (found) {
        return { message: "You already liked the post" };
      } else {
        updatedEntity = await strapi
          .query("post")
          .update({ id }, { entity, likes: [...entity.likes, user_id] });
      }
      return cleanUps(
        sanitizeEntity(updatedEntity, { model: strapi.models.post })
      );
    }

    // If Liked value is @false
    if (!liked) {
      let filteredEntity = entity.likes.filter(function (obj) {
        return obj.id !== parseInt(user_id);
      });
      entity.likes = filteredEntity;
      updatedEntity = await strapi.query("post").update({ id }, entity);
      return cleanUps(
        sanitizeEntity(updatedEntity, { model: strapi.models.post })
      );
    }
    return { message: "An error occured" };
  },

  /**
   * Delete post.
   * @return {Object}
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.query("post").delete({ id });

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
      message: "Post and all its attachement and replies has been deleted",
    };
  },
};
