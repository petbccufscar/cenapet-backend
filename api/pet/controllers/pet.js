'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    geojson: async ctx => {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.pet.search(ctx.query);
        } else {
            entities = await strapi.services.pet.find(ctx.query);
        }

        let features = [];

        for (var i = 0; i < entities.length; i++) {
            const feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [entities[i].campus.Longitude, entities[i].campus.Latitude]
                },
                "properties": {
                    "name": entities[i].Nome
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
