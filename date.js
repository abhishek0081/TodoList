
exports.getDate = ()=>
{
    const today = new Date(); 
    const options ={
        weekday:"long",
        day:"numeric",
        month:"long",
    };
    return [today.toLocaleDateString("en-US",options),today.toLocaleTimeString()];
};

// console.log(module)



//module.exports.getDate = getDate;
//module.exports.getDay = getDay;
