const Discord = require('discord.js');
const Eris = require('eris');
const centra = require('centra');
const superagent = require('superagent');
const ms = require('ms');
const _ = require('lodash');

const jvar = require('jvar');
const type = require('jvar/fn/type');
const randomString = require('jvar/utility/randomString');
const randomId = () => randomString(16, '0123456789abcdef');
const { inspect } = require('util');

const discordClient = new Eris('Bot ' + process.env.DISCORD_BOT_TOKEN);

const _caches = new Map();
const _getCache = (id) => {
    if (!_caches.has(id)) {
        _caches.set(id, new Map());
    }
    return _caches.get(id);
}

module.exports = async (id, code, args = []) => {
    const cache = _getCache(id);

    try {
        const _result = await eval(code);
        if (type(_result) == 'string') {
            return _result;
        }
        return inspect(_result);
    } catch (err) {
        return err.toString();
    }
}
