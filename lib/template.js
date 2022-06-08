const template={
    html:function(title,list,body,control){
        const html=`
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
        return html;
    },
    list:function(fileList){
        let list='<ul>';
        fileList.forEach(file=>{
            list+=`<li><a href="/?id=${file}">${file}</a></li>`
            })
        list+="</ul>";
    
        return list;
    }
}

module.exports=template;