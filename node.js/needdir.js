const testFolder='./data';
const fs=require('fs');

//readdir을 이용해서 디렉토리 내 파일 목록을 가져올 수 있다.
fs.readdir(testFolder,(err,files)=>{
    files.forEach(file=>{
        console.log(file);
    })
})