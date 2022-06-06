const http = require('http');
const fs = require('fs');
const url = require('url');


function templateHTML(title,list,body){
    const template=`
    <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${body}
            </body>
        </html>
    `;
    return template;
}

function templateList(fileList){
    let list='<ul>';
    fileList.forEach(file=>{
        console.log(file);
        list+=`<li><a href="/?id=${file}">${file}</a></li>`
        })
    list+="</ul>";

    return list;
}

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData=url.parse(_url,true).query;
    const pathName=url.parse(_url,true).pathname;
    //루트 경로로 접근 했을 경우 url의 pathname은 /이다.
    if(pathName==="/"){
        //만약 query string이 없는 경우, 이는 메인페이지를 접속한 것을 의미한다.
        if(title === undefined){
            fs.readdir("./data",(err,files)=>{
                const list=templateList(files);
                const title="Welcome";
                const description="Hello, Node.js";
                const template=templateHTML(title,list,`<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
                })
            
            }
        fs.readdir("./data",(err,files)=>{
            const list=templateList(files);
            const title=queryData.id;
            fs.readFile(`./data/${title}`,'utf8',(err,description)=>{
                const template=templateHTML(title,list,`<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                }
            );
            })
        
    }
    else{
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);