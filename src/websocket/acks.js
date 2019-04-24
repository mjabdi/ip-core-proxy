const SimpleHashTable = require('simple-hashtable');
const acks = {};

const _acks = new SimpleHashTable();

acks.ackReceived = (bank , ack) =>
{
    if (_acks.containsKey(bank))
    {
        _acks.get(bank).push(ack);
    }
    else
    {
        _acks.put(bank, [ack]);
    }
}

acks.containsAck = (bank, ack) =>
{
    if (_acks.containsKey(bank))
    {
        return _acks.get(bank).indexOf(ack) > -1;
    }
    return false;
}

module.exports = acks;