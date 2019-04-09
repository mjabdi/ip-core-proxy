"use strict";

class Message
{
    constructor(payload)
    {
        this.payload = payload;
        this.timestamp = new Date();
        this.status = 'new';
    }
}

module.exports = Message;
