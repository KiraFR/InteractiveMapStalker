const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    try {
      await callback(array[index], index, array);
    }catch(err){
      console.log(err);
    };
  }
}

export { asyncForEach };
