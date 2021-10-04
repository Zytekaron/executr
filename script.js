// 0=project_id 1=topic_name 2=data_buffer

let pubsub = cache.get('pubsub_' + args[0]);
if (!pubsub) {
    const { PubSub } = require('@google-cloud/pubsub');
    pubsub = new PubSub({ projectId: args[0] });
    cache.set('pubsub_' + args[0], pubsub);
}

pubsub
    .topic(args[1])
    .publish(args[2]);
