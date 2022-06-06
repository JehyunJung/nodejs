const fs=require("fs");

console.log("A");
data=fs.readFileSync('./node.js/sample.txt',"utf-8")
console.log(data);
console.log("C");