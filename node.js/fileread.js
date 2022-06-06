const fs=require("fs");

console.log("A");
fs.readFile('./node.js/sample.txt',"utf-8",(err,data)=>{
    if(err){
        throw err;
    }
    console.log(data);
})
console.log("C");