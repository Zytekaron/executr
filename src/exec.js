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

const { store: _store } = require('./db');
const _getStore = (id) => {
    return _.mapValues(_store, value =>
        typeof value == 'function'
            ? value.bind(_store, id)
            : value
    );
}

const _ctx = require('fs').readFileSync(__dirname + '/exec.js');

module.exports = async (_script, code, args = []) => {
    const cache = _getCache(_script);
    const store = _getStore(_script);

    try {
        const _result = await eval(code);

        return type(_result) == 'string'
            ? _result
            : inspect(_result);
    } catch (err) {
        return err.toString();
    }
};
