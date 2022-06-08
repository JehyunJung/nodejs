const http = require('http');
const fs = require('fs');
const url = require('url');
const qs=require("querystring");
const template=require("./lib/template");
const path=require('path');
const sanitizeHtml=require('sanitize-html');

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
                const list=template.list(files);
                title="Welcome";
                const description="Hello, Node.js";
                const html=template.html(title,list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
                })
            
            }
        else{
            fs.readdir("./data",(err,files)=>{
                const list=template.list(files);
                const fileteredId=path.parse(title).base;
                console.log(err);
                console.log(path.parse(title));
                fs.readFile(`./data/${fileteredId}`,'utf8',(err,description)=>{
                    const sanitizedTitle=sanitizeHtml(title);
                    const sanitizedDescription=sanitizeHtml(description);
                    const html=template.html(title,list,
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${sanitizedTitle}">update</a>
                            <form action="/process_delete" method="post">
                                <input type="hidden" name="id" value="${sanitizedTitle}">
                                <input type="submit" value="delete"></input>
                            </form>
                            `);
                        response.writeHead(200);
                        response.end(html);
                    }
                );
                })
        }
        
    }
    else if(pathName==="/create"){
        fs.readdir("./data",(err,files)=>{
            const list=template.list(files);
            title="WEB - Create";
            const html=template.html(title,list,`
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
            response.end(html);
            });

        }
    else if(pathName=="/process_create"){
        let body="";
        request.on("data",function(data){
            body+=data;
        })
        request.on("end",function(){
            const post=qs.parse(body);
            title=post.title;
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
            const list=template.list(files);
            const fileteredId=path.parse(title).base;
            fs.readFile(`./data/${fileteredId}`,'utf8',(err,description)=>{
                const html=template.html(title,list,
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
                    response.end(html);
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
            title=post.title;
            const description=post.description;
            const fileteredId=path.parse(title).base;
            fs.rename(`./data/${id}`,`./data/${title}`,(err)=>{
                fs.writeFile(`data/${fileteredId}`,description,"utf-8",(err)=>{
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
            const fileteredId=path.parse(id).base;
            fs.unlink(`./data/${fileteredId}`,(err)=>{
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