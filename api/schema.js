"use strict";
const Promise = require('bluebird');
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList} = require('graphql');

const AyahType = new GraphQLObjectType({
    name: 'Ayah',
    fields: {
        _id: {type: GraphQLString},
        verse: {type: GraphQLInt},
        _language: {type: GraphQLInt},
        _sura: {type: GraphQLInt},
        ayah_text: {type: GraphQLString}
    }
});

const SuraType = new GraphQLObjectType({
    name: 'Sura',
    fields: {
        _id: {type: GraphQLInt},
        title: {type: GraphQLString},
        ayah: {
            type: new GraphQLList(AyahType),
            args: {
                offset: {type: GraphQLInt, name: 'offset'},
                limit: {type: GraphQLInt, name: 'limit'},
                translate: {type: GraphQLString, name: 'translate'}
            },
            resolve: (sura, {offset, limit, translate}, {getAyahOfSura}) => {
                return getAyahOfSura(sura._id, offset, limit, translate);
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Root',
        fields: {
            sura: {
                type: SuraType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLString,
                    },
                },
                resolve: (sura, {id}, {getSura}) => {
                    return getSura(id)
                }
            },
            allSura: {
                type: new GraphQLList(SuraType),
                resolve: (allSura, args, {getAllSura}) => {
                    return getAllSura();
                }
            },
            search: {
                type: new GraphQLList(AyahType),
                args: {
                    query: {
                        name: "query",
                        type: GraphQLString
                    }
                },
                resolve: (search, {query}, {searchAyah}) => {
                    return searchAyah(query);
                }
            }
        }
    })
});

module.exports = schema;