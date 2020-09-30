'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

function random() {
    return Math.random() * (0.001) - 0.0005;
}

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
                    "nome": entities[i].nome
                }
            };

            if (!feature.geometry.coordinates.longitude || !feature.geometry.coordinates.latitude) {
                feature.geometry.coordinates = [entities[i].campus.longitude + random(), entities[i].campus.latitude + random()];
            }
            features.push(feature);
        }

        const geojson = {
            "type": "FeatureCollection",
            "features": features
        }

        return geojson;
    },
};
