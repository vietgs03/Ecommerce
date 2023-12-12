const _ = require('lodash')
const getInfoData = ({filed=[],object={} })=>{
    return _.pick(object,filed)
}
// convert array to object 
// ['a','b'] => {a:1,b:1}

const getSelectData = (select = [])=>{
    return Object.fromEntries(select.map(el=>[el,1]))
}
// ['a','b'] => {a:0,b:0}

const getUnSelectData = (select = [])=>{
    return Object.fromEntries(select.map(el=>[el,0]))
}
const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] == null) delete obj[key];
    });
    return obj;
}
module.exports={
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject
}