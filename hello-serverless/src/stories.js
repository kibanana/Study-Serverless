import * as mongoose from "mongoose";
// 일반 Node.js 에서 mongoose를 사용할 때와 다르게
// 함수를 호출할 때마다 connection을 만드어주어야 한다
// => 이건 MongoDB의 저장된 접속정보를 재활용하는 방법으로 상쇄시킬 수 있는 단점이다

import { Story } from './model/Story';

const connect = () => {
    return mongoose.connect('mongodb://serverless:serverless@ds239128.mlab.com:39128/serverless');
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
        return createResponse(200, 'list');
    }).catch((e) => {
        return createResponse(500, e);
    });
};

// R - single
export const readStory = async event => {
    connect().then(() => {
        return createResponse(200, 'read');
    }).catch((e) => {
        return createResponse(500, e);
    });
};


// U
export const updateStory = async event => {
    connect().then(() => {
        return createResponse(200, 'update');
    }).catch((e) => {
        return createResponse(500, e);
    });
};

// D
export const deleteStory = async event => {
    connect().then(() => {
        return createResponse(200, 'delete');
    }).catch((e) => {
        return createResponse(500, e);
    });
};

const createResponse = (status, message) => ({
    statusCode: status,
    body: JSON.stringify(
        {
        message: message,
        input: event,
        },
        null,
        2
    ),
});