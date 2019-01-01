const axios = require('axios')
const Dictionary = require("oxford-dictionary-api");
const dotenv = require('dotenv').config()

const app_id = process.env.OX_APP_ID;
const app_key = process.env.OX_APP_KEY;
const dict = new Dictionary(app_id, app_key);


const editUrban = (definition, word) => {
    const regex = new RegExp(`\\[\(\\w+\)\\]`, 'gmi')
    const regex2 = new RegExp(`${word}`, 'gmi')
    // /\[(\w+)\]/g
    console.log(regex, regex2)
    return definition.replace(/\[([\w+\s*]+)\]/g, (a, b) => b).replace(regex2, '_'.repeat(word.length))
}
const fetchUrban = async (word) => {
    return axios.get(`http://api.urbandictionary.com/v0/define?term={${word}}`)
        .then(({ data }) => {
            return Promise.resolve(
                data.list.length > 0 ? editUrban(data.list.sort((a, b) => b.thumbs_up > a.thumbs_up)[0].definition, word) : false
            )
        }).catch((e) => {
            throw (e)
        })
}
const fetchOxford = async word => {
    return new Promise((resolve, reject) => {
        dict.find(word, function (error, data) {
            if (error) {
                return reject(error)
            }
            resolve((data.results[0].lexicalEntries[0].entries[0].senses[0].short_definitions[0]))
        })
    })
}

module.exports = { fetchUrban, fetchOxford }

