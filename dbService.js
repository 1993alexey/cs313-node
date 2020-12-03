class DbService {
    constructor() {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://alex:alex@cluster0.mvimo.mongodb.net/messages?retryWrites=true&w=majority";
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    }

    getMessages() {
        return new Promise((resolve, reject) => {
            this.client.connect(err => {
                this.db = this.client.db('messages')
                this.collection = this.db.collection('messages')
                this.collection.find({}).toArray((err, docs) => resolve(docs))
                console.log('connected to mongo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            });
        })
    }

    saveMessage(message) {
        this.collection.insertOne(message)
    }
}

module.exports = DbService
