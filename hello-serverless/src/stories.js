import * as mongoose from 'mongoose'
// Node.js에서 일반적으로 mongoose를 사용할 때와는 다르게, 함수를 호출할 때마다 커넥션을 만들어야 한다.
// -> 이건 MongoDB에서 저장된 접속정보를 재활용하는 방법으로 상쇄시킬 수 있는 단점이다.

import Story from './model/Story';

let connection = null;
const connect = () => {
    if(connection && mongoose.connection.readyState === 1) {
        return Promise.resolve(connection);
    } else {
        // 클라우드에서는 로컬 주소 내부에 접근할 수 없으므로 꼭 리모트 주소가 필요하다.
        return mongoose.connect('mongodb+srv://dbUser:yewon0630*@cluster0-zudbr.mongodb.net/test?retryWrites=true&w=majority')
        .then((conn) => {
            connection = conn;
            return connection;
        });
    }
}

// Create
export const createStory = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const {title, body} = JSON.parse(event.body);
    connect().then(() => {
        const story = new Story({title, body});
        return story.save();
    }).then(story => {
        return callback(null, createResponse(200, story));        
    }).catch((e) => {
        return callback(null, createResponse(500, e));
    });
};

// Read List
export const readStories = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connect().then(() => {
        return Story.find().sort({ _id: -1 }).limit(5).lean().exec()
    }).then((stories) =>{
        if(stories) {
            return callback(null, createResponse(200, stories));
        } else {
            return callback(null, createResponse(404));
        }
    }).catch((e) => {
        return callback(null, createResponse(500, e));
    });
};

// Read Item
export const readStory = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connect().then(() => {
        Story.findById(event.pathParameters.id).exec()
        .then(
            story => {
                if(story) {
                    return callback(null, createResponse(200, story));
                } else{
                    return callback(null, createResponse(404));
                }
            }
        )
    }).catch((e) => {
        return callback(null, createResponse(500, e));
    });
};


// Update
export const updateStory = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const uStory = JSON.parse(event.body);
    connect().then(() => {
        Story.findOneAndUpdate({_id: event.pathParameters.id }, uStory, {new: true}).exec()
        .then((story) => {
            if(story) {
                return callback(null, createResponse(200, 'update'));
            } else {
                return callback(null, createResponse(404));
            }
        });
    }).catch((e) => {
        return callback(null, createResponse(500, e));
    });
};

// Delete
export const deleteStory = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connect().then(() => {
        Story.remove({ _id: event.pathParameters.id }).exec()
    }).then(() => {
        return callback(null, createResponse(204, null));
    }).catch((e) => {
        return callback(null, createResponse(500, e));
    });
};

const createResponse = (status, body = null) => ({
    statusCode: status,
    body: JSON.stringify(
        {body},
        null,
        2
    ),
});