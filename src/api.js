const express = require('express');
const { Router } = express;
const app = Router();

const randomString = require('jvar/utility/randomString');
const randomId = () => randomString(16, '0123456789abcdef')

const { funcs } = require('./db');
const exec = require('./exec');

const auth = process.env.ZYTEKARON_AUTH;

const cache = new Map();
async function getExecutor(id) {
    if (!cache.has(id)) {
        const doc = await funcs.find({
            $or: [
                { _id: id },
                { name: id }
            ]
        });
        if (doc) cache.set(id, doc);
    }
    
    return cache.get(id);
}

app.use(express.json());

// Check authorization
app.use((req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(403).send({ success: false, error: 'Forbidden' });
    }
    if (authorization !== auth) {
        return res.status(401).send({ success: false, error: 'Unauthorized' });
    }
    next();
});

// Ping
app.get('/', (req, res) => {
    res.status(200).send({ success: true });
});

// View an executor
app.get('/:id', async (req, res) => {
    const doc = await getExecutor(req.params.id);

    if (doc) {
        res.status(200).send({ success: true, data: doc });
    } else {
        res.status(404).send({ success: false, error: 'Executor not found' });
    }
});

// Delete an executor
app.delete('/:id', async (req, res) => {
    try {
        await funcs.delete(req.params.id);
        cache.delete(req.params.id);

        res.status(200).send({ success: true });
    } catch (err) {
        res.status(500).send({ success: false, error: 'Error whilst deleting: ' + err });
    }
});

// Update an executor
app.patch('/:id', async (req, res) => {
    try {
        await funcs.update(req.params.id, req.body);
        cache.delete(req.params.id);

        res.status(200).send({ success: true });
    } catch (err) {
        res.status(500).send({ success: false, error: 'Error whilst updating: ' + err });
    }
});

// Create a new executor
app.post('/', async (req, res) => {
    const data = req.body;
    try {
        data._id = data.id || randomId();
        delete data.id;

        await funcs.insert(data);
        cache.delete(data.id);

        res.status(200).send({ success: true, data: { id: data._id, name: data.name, code: data.code } });
    } catch (err) {
        res.status(500).send({ success: false, error: 'Error whilst inserting: ' + err });
    }
});

// Run a section of code
app.post('/run', async (req, res) => {
    const { code, args } = req.body;

    try {
        const result = await exec('', code, args);

        res.status(200).send({ success: true, data: result });
    } catch (err) {
        res.status(500).send({ success: false, data: err.toString() });
    }
});

// Run an existing executor by id/name
app.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { code } = await getExecutor(id) || {};
    if (!code) {
        return res.status(400).send({ success: false, error: 'Unknown executor ' + id });
    }

    try {
        const result = await exec(id, code, req.body.args);
        res.status(200).send({ success: true, data: result });
    } catch (err) {
        res.status(500).send({ success: false, data: err.toString() });
    }
});

app.use((_, res) => {
    res.status(404).send({ success: false, error: 'Not Found' });
});

module.exports = app;
