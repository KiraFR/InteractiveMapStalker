const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    }catch(err){
      console.log(err);
    };
  }
}

const uuid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

const fetchJS = async (url, option = null) => {
    const result = await fetch(url, option);
    const json = await result.json();
    return json;
}

export { asyncForEach, uuid, fetchJS };
