import * as mongoose from "mongoose";
// 일반 Node.js 에서 mongoose를 사용할 때와 다르게
// 함수를 호출할 때마다 connection을 만드어주어야 한다
// => 이건 MongoDB의 저장된 접속정보를 재활용하는 방법으로 상쇄시킬 수 있는 단점이다

import Story from './model/Story';

let connection = null;
const connect = () => {
    if(connection && mongoose.connection.readyState === 1) {
        return Promise.resolve(connection);
    } else {
        // mongodb 주소는 꼭 어딘가에 올려져있는 주소가 필요하다
        // local로는 접근할 수 없으므로
        return mongoose.connect('mongodb+srv://dbUser:yewon0630*@cluster0-zudbr.mongodb.net/test?retryWrites=true&w=majority')
        .then((conn) => {
            connection = conn;
            return connection;
        });
    }
}

// C
export const createStory = async event => {
    const {title, body} = JSON.parse(event.body);
    connect().then(() => {
        const story = new Story({title, body});
        return createResponse(200, JSON.stringify(story.save()));
    }).catch((e) => {
        return createResponse(500, e);
    });
};

// R
export const readStories = async event => {
    connect().then(() => {
        Story.find().sort({ _id: -1 }).limit(5).lean().exec()
        .then((stories) =>{
            
            if(stories) {
                createResponse(200, stories)
            } else {
                createResponse(404)
            }
        }
        );
    }).catch((e) => {
        return createResponse(500, e);
    });
};

// R - single
export const readStory = async event => {
    connect().then(() => {
        Story.findById(event.pathParameters.id).exec()
        .then(
            story => {
                if(story) {
                    return createResponse(200, story);
                } else{
                    return createResponse(404);
                }
            }
        )
    }).catch((e) => {
        return createResponse(500, e);
    });
};


// U
export const updateStory = async event => {
    const uStory = JSON.parse(event.body);
    connect().then(() => {
        Story.findOneAndUpdate({_id: event.pathParameters.id }, update, {new: true}).exec()
        .then((story) => {
            if(story) {
                return createResponse(200, 'update');
            } else {
                return createResponse(404);
            }
        });
    }).catch((e) => {
        return createResponse(500, e);
    });
};

// D
export const deleteStory = async event => {
    connect().then(() => {
        Story.remove({ _id: event.pathParameter.id}).exec()
        .then(() => {
            createResponse(204, null);
        })
    }).catch((e) => {
        return createResponse(500, e);
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