'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.pet.search(ctx.query);
        } else {
            entities = await strapi.services.pet.find(ctx.query, ['campus', 'campus.universidade', 'logo']);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.pet }));
    },
    async findOne(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.pet.findOne({ id }, ['campus', 'campus.universidade', 'logo']);
        return sanitizeEntity(entity, { model: strapi.models.pet });
    },
    geojson: async ctx => {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.pet.search(ctx.query);
        } else {
            entities = await strapi.services.pet.find(ctx.query);
        }

        let features = [];

        for (var i = 0; i < entities.length; i++) {
            let feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [entities[i].longitude, entities[i].latitude]
                },
                "properties": {
                    "id": entities[i].id,
                    "nome": entities[i].nome
                }
            };
            features.push(feature);
        }

        const geojson = {
            "type": "FeatureCollection",
            "features": features
        }

        return geojson;
    },
};
