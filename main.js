const http = require('http');
const fs = require('fs');
const url = require('url');
const qs=require("querystring");

function templateHTML(title,list,body,control){
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
                ${control}
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
    let title=queryData.id;
    //루트 경로로 접근 했을 경우 url의 pathname은 /이다.
    if(pathName==="/"){
        //만약 query string이 없는 경우, 이는 메인페이지를 접속한 것을 의미한다.
        if(title === undefined){
            fs.readdir("./data",(err,files)=>{
                const list=templateList(files);
                const title="Welcome";
                const description="Hello, Node.js";
                const template=templateHTML(title,list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
                })
            
            }
        fs.readdir("./data",(err,files)=>{
            const list=templateList(files);
            const title=queryData.id;
            fs.readFile(`./data/${title}`,'utf8',(err,description)=>{
                const template=templateHTML(title,list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    <form action="/process_delete" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete"></input>
                    </form>
                    `);
                    response.writeHead(200);
                    response.end(template);
                }
            );
            })
        
    }
    else if(pathName==="/create"){
        fs.readdir("./data",(err,files)=>{
            const list=templateList(files);
            const title="WEB - Create";
            const template=templateHTML(title,list,`
                <form action="/process_create" method="post"?
                    <p>
                        <input type="text" name="title" placeholder="title">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `,``);
            response.writeHead(200);
            response.end(template);
            });

        }
    else if(pathName=="/process_create"){
        let body="";
        request.on("data",function(data){
            body+=data;
        })
        request.on("end",function(){
            const post=qs.parse(body);
            const title=post.title;
            const description=post.description;

            fs.writeFile(`data/${title}`,description,"utf-8",(err)=>{
                response.writeHead(302,{
                    Location:`/?id=${title}`
                });
                response.end();
            })
        })
        
    }
    else if(pathName=="/update"){
        fs.readdir("./data",(err,files)=>{
            const list=templateList(files);
            const title=queryData.id;
            fs.readFile(`./data/${title}`,'utf8',(err,description)=>{
                const template=templateHTML(title,list,
                    `
                    <form action="/process_update" method="post">
                        <input type="hidden" name="id" value="${title}">
                    <p>
                        <input type="text" name="title" placeholder="title" value="${title}">
                    </p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    `<a href="/create">create</a><a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                }
            );
            })
    }
    else if(pathName=="/process_update"){
        let body="";
        request.on("data",function(data){
            body+=data;
        })
        request.on("end",function(){
            const post=qs.parse(body);
            console.log(post)
            const id=post.id
            const title=post.title;
            const description=post.description;
            console.log(id,title,description);
            fs.rename(`./data/${id}`,`./data/${title}`,(err)=>{
                fs.writeFile(`data/${title}`,description,"utf-8",(err)=>{
                    response.writeHead(302,{
                        Location:`/?id=${title}`
                    });
                    response.end();
                }) 
            });
            
        })
    }
    else if(pathName === "/process_delete"){
        let body="";
        request.on("data",function(data){
            body+=data;
        })
        request.on("end",function(){
            const post=qs.parse(body);
            console.log(post)
            const id=post.id

            fs.unlink(`./data/${id}`,(err)=>{
                console.log(err)
                response.writeHead(302,{
                    Location:`/`
                });
                response.end();

            }
            )}
        );
    }
    else{
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);