require('babel-polyfill');

function getValues() {
  return Promise.resolve([1,2,3,4]);
}

async function foo() {
  var values = await getValues();
  console.log(values);
}
