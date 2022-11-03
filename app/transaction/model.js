const mongoose = require('mongoose');
const { model, Schema} = mongoose;

const transactionSchema = Schema({
    
    amount:{
        type: Number,
        default: 0
    },
    transactionType:{
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = model('Transaction', transactionSchema);