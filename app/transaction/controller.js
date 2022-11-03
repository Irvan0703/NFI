const Transaction = require('./model');
const User = require('../user/model')

const transact = async(req, res, next) => {
    try {
        const payload = req.body;
        let trans;
        let saldo = 0;

        if (payload.transactionType === 'deposito'){
            trans = new Transaction(payload);
            await trans.save();

            trans = await Transaction
            .aggregate([
                {
                    $group:{
                        _id:"$transactionType",
                        amount:{$sum : "$amount"}
                    }
                }
            ])
            .then(res => {
                let depo = 0;
                let wd = 0; 
                for(let i = 0; i < res.length; i++){
                    if(res[i]._id === 'deposito'){
                        depo += res[i].amount
                    }
                    if(res[i]._id === 'withdraw'){
                        wd += res[i].amount
                    }

                }

                 saldo = depo - wd + payload.amount;

            })
        }
        if (payload.transactionType === 'withdraw'){
            
            trans = await Transaction
            .aggregate([
                {
                    $group:{
                        _id:"$transactionType",
                        amount:{$sum : "$amount"}
                    }
                }
            ])
            .then(async res => {
                let depo = 0;
                let wd = 0; 
                for(let i = 0; i < res.length; i++){
                    if(res[i]._id === 'deposito'){
                        depo += res[i].amount
                    }
                    if(res[i]._id === 'withdraw'){
                        wd += res[i].amount
                    }

                }

                 saldo = depo - wd;

                if ( saldo < payload.amount){
                    console.log('Saldo kurang')
                } else {
                    saldo -= payload.amount;
                    trans = new Transaction(payload);
                    await trans.save();
                }
            })

        }
        return res.json({
            total_amount: saldo
        });
    } catch (err) {
        if (err && err.name === 'ValidationError'){
            return res.json({
                error:1,
                message: err.message,
                fields: err.errors 
            });
        }
        next(err);
    }
}

const index = async(req,res,next) => {
    try {
        let trans;
        let saldo = 0;

         trans = await Transaction
        .aggregate([
            {
                $group:{
                    _id:"$transactionType",
                    amount:{$sum : "$amount"}
                }
            }
        ])
        .then(res => {
            let depo = 0;
            let wd = 0; 
            for(let i = 0; i < res.length; i++){
                if(res[i]._id === 'deposito'){
                    depo += res[i].amount
                }
                if(res[i]._id === 'withdraw'){
                    wd += res[i].amount
                }

            }

             saldo = depo - wd;

        })

            return res.json({
                total_amount: saldo
            });
    } catch (err) {
        if (err){
            return res.json({
                error:1,
                message: err.message,
                fields: err.errors 
            });
        }
        next(err);
    }
}

module.exports = {
    transact,
    index
}