var _ = require('lodash');
var fs = require('fs');
// var data = require("./data.json");
var data = {
  name: 'bobby'
}
// console.log(_.random(1,5));
//
// console.log(data.name);
//
// fs.readFile('./data.json', 'utf-8', (err, data) => {
//   var data = JSON.parse(data);
//   console.log(data.name);
// })
//
// fs.readdir('/', (err, data) => {
//   console.log(data);
// })

fs.writeFile('data.json', JSON.stringify(data), (err) => {
  console.log("file written", err);
  break;
})
