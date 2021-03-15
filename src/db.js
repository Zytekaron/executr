const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    async init() {
        await client.connect();
        this.collection = client.db('zytekaron').collection('funcs');
    },
    async get(id) {
        return this.collection.findOne({ _id: id });
    },
    async findOne(query) {
        const cursor = await this.collection.find(query);
        return (await cursor.toArray())[0];
    },
    async insert(doc) {
        return this.collection.insertOne(doc);
    },
    async update(id, data) {
        return this.collection.updateOne({ _id: id }, { $set: data });
    },
    async delete(id) {
        return this.collection.deleteOne({ _id: id });
    },
    async all() {
        const cursor = await this.collection.find({});
        return cursor.toArray();
    }
}