import * as mongoose from "mongoose";

const HOST = 'mongodb://localhost:27017/';

export const connect = (database) => {
    return new Promise<void>((resolve, reject) => {
        const URI = HOST+database
        return mongoose.connect(URI, (err: any) => {
            if (!err) {
                console.log('Connected to', URI)
                resolve()
            }
            else {
                reject(err)
            }
        });
    })
}

export const disconnect = () => {
    return mongoose.disconnect()
}

export default mongoose
