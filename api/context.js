"use strict";
const DataLoader = require('dataloader');
const Sura = require('./models/Sura');
const Ayah = require('./models/Ayah');
const Language = require('./models/Language');

const ayahLoader = new DataLoader((ayahIds) => {
    return new Promise((resolve, reject) => {
        Ayah.find({_id: {$in : ayahIds.map(ayahId => ({_id: ayahId}))}})
            .exec((err, fullAyah) => {
                if (err) {
                    reject(err)
                } else {
                    const newAyah = {};
                    fullAyah.forEach(fA => {
                        newAyah[fA._id] = fA.toJSON();
                    });
                    resolve(ayahIds.map(ayahId => newAyah[ayahId]))
                }
            })
    })
})

const getAyahOfSura = (sura_id, offset, limit, translate) => {
    return new Promise((resolve, reject) => {
        Language.findOne({code: translate ? translate : 'id'})
            .exec((err, language) => {
                if (err) return reject(err);
                Ayah.find({_sura: sura_id})
                    .or([{_language: 1}, {_language: language._id}])
                    .select('_id')
                    .skip(offset)
                    .limit(limit)
                    .sort("verse")
                    .sort("_language")
                    .exec((err, ayah) => {
                        if (err) {
                            return reject(err)
                        } else {
                            ayahLoader.loadMany(ayah.map(a => a._id))
                                .then(resolve)
                                .catch(reject)
                        }
                    })
            })
    })
}

const getSura = (_id) => {
    return new Promise((resolve, reject) => {
        Sura.findOne({_id: _id})
            .exec((err, sura) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(sura.toJSON());
                }
            })
    })
}

const getAllSura = () => {
    return new Promise((resolve, reject) => {
        Sura.find({})
            .sort('_id')
            .exec((err, sura) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(sura)
                }
            })
    })
}

const searchAyah = (query) => {
    return new Promise((resolve, reject) => {
        Ayah.find({$text: {$search: query}})
            .limit(50)
            .exec((err, ayah) => {
                if (err) {
                    reject(err);
                } else {
                    Promise.all(ayah.map(a => {
                        return new Promise((resolve, reject) => {
                            Ayah.find({_sura: a._sura, verse: a.verse})
                                .or([{_language: a._language}, {_language: 1}])
                                .exec((err, arabic) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve(arabic.map(ar => ar.toJSON()));
                                    }
                                })
                        })
                    })).then(ayahs => {
                        resolve(ayahs.reduce((p, c) => [...p, ...c], []));
                    }).catch(reject)
                }
            })
    })
}

const context = {
    Sura,
    Ayah,
    Language,
    getSura,
    getAyahOfSura,
    getAllSura,
    searchAyah,
    ayahLoader
};

module.exports = context;