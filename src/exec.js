const Discord = require('discord.js');
const centra = require('centra');
const superagent = require('superagent');
const ms = require('ms');
const _ = require('lodash');

const jvar = require('jvar');
const type = require('jvar/fn/type');
const randomString = require('jvar/utility/randomString');
const randomId = () => randomString(16, '0123456789abcdef');
const { inspect } = require('util');

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
        return inspect(await eval(code));
    } catch (err) {
        return err.toString();
    }
}
