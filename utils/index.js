const { AbilityBuilder, Ability } = require("@casl/ability");

function getToken(req) {
    let token =
        req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : null;

        return token && token.length ? token : null
}

const policies = {
    user(user, {can}){
        can('create', 'Transaction');
        can('read', 'Transaction', {user_id: user._id});
    },
    admin(user, {can}){
        can('manage', 'all');
    }
}

const policyFor = user => {
    let builder = new AbilityBuilder();
    if( user && typeof policies[user.role] === 'function'){
        policies[user.role](user, builder);
    } 

    return new Ability(builder.rules)
}

module.exports = {
    getToken,
    policyFor
}