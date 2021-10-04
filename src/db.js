const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    async init() {
        await client.connect();
        this.funcs.collection = client.db('zytekaron').collection('funcs');
        this.store.collection = client.db('zytekaron').collection('funcs_store');
        this.ready = true;
    },
    funcs: {
        async get(_id) {
            return this.collection.findOne({ _id });
        },
        async find(query) {
            return this.collection.findOne(query);
        },
        async insert(doc) {
            return this.collection.insertOne(doc);
        },
        async update(_id, data) {
            return this.collection.updateOne({ _id }, { $set: data });
        },
        async delete(_id) {
            return this.collection.deleteOne({ _id });
        },
        async all() {
            const cursor = await this.collection.find({});
            return cursor.toArray();
        }
    },
    store: {
        async set(_id, key, value) {
            const update = {
                $setOnInsert: { _id },
                $set: { [key]: value }
            };
            await this.collection.updateOne({ _id }, update, { upsert: true });
        },
        async get(_id, key) {
            const doc = await this.collection.findOne({ _id });
            return doc?.[key];
        },
        async delete(_id, key) {
            const update = {
                $setOnInsert: { _id },
                $unset: { [key]: "" }
            };
            await this.collection.updateOne({ _id }, update, { upsert: true });
        }
    }
};
