const fs = require('fs')// module to deal with the file system
const http = require('http')// module to deal with network and Server
const url = require('url')// module to deal with url and links
const slugify = require("slugify")
const replaceTemplate = require("./moduls/replaceTemplate");


/***********************************************************************/
//----------------------------File system------------------------------->

//read and writ file from the system syncronusly (bloking code)
// // to read a file from the system
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8") 
// console.log(textIn)
// // to write on a file in the system
// let textOut = `this what we know about avocado : ${textIn} \n Created on ${Date.now()} `
// fs.writeFileSync("./starter/txt/output.txt", textOut); 


//read and writ file from the system asyncronusly (non-bloking code)
// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data) => {
//     console.log(data)
// });//2 first it will read the file in the background and when it finshed the callBack function will be excuted
// console.log("will read the file now") // 1


// fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {// data1 = read-this
//     if (err) return console.log("ERROR!")

//     fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./starter/txt/append.txt`, "utf-8", (err, data3) => {
//             console.log(data3);

//             fs.writeFile("./starter/txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//                 console.log("your file has been writen")
//             })
//         }); 
//     });
// });


/***************************************************************************************/
//---------------------------------SERVER AND URL ROUTING------------------------------->

let tempOverview = fs.readFileSync(`./starter/templates/templet-overview.html`, "utf-8")
let tempCard = fs.readFileSync(`./starter/templates/templetcard.html`, "utf-8")
let tempProduct = fs.readFileSync(`./starter/templates/templet-product.html`, "utf-8")

let data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, "utf-8") //api data but came as string
let dataObject = JSON.parse(data);// to convert string into js object

let slugs = dataObject.map(e => slugify(e.productName, { lower: true }));
console.log(slugs);

// to creat a server 
let server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true)

    //overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });
        let cardshtml = dataObject.map(e => replaceTemplate(tempCard, e)).join('');
        let output = tempOverview.replace('{%PRODUCT_CARDS%}', cardshtml)
        res.end(output);

        //product    
    } else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const product = dataObject[query.id];
        let output = replaceTemplate(tempProduct, product)
        res.end(output);
        //api    
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(data);
        //not found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world' // custom header
        });
        res.end("<h1>page not found</h1>");
    }
})

// server.listen(port, host, callback)  make the server listening to requests
server.listen(8000, "127.0.0.1", () => {
    console.log("listening to requests on port 8000");
})

//Challenge: Product Store Server from chatgpt
// const data = fs.readFileSync(`./starter/dev-data/data.json`, "utf-8")
// const dataObject = JSON.parse(data);
// // console.log(data)

// let server = http.createServer((req, res) => {
//     const { pathname, query } = url.parse(req.url, true);

//     if (pathname === "/" || pathname === "/overview") {
//         let card =
//             `<h1>Products Store</h1>
//         <ul>
//         <li>Product 1</li>
//         <li>Product 2</li>
//         <li>Product 3</li>
//         </ul>`
//         res.end(card);

//     } else if (pathname === "/api") {
//         res.writeHead(200, {
//             "content-type": "application/json"
//         })
//         res.end(JSON.stringify(dataObject));

//     } else if (pathname === "/product") {
//         let product = dataObject[query.id]
//         if (product) {
//             let card = `
//             <h1>${product.productName}</h1>
//             <p>the price is =${product.price}</p>
//             <p>ID:${product.id}</p>`
//             res.end(card)

//         } else {
//             res.end(`<h1>Product Not Found</h1>`)
//         }
//     } else if (pathname === "/count") {
//         res.end(`number of product is = ${dataObject.length}`)
//     } else {
//         res.end(`<h1>Page Not Found</h1>`)
//     }
// })

// server.listen(8000, "127.0.0.1", () => {
//     console.log("listening to requests on port 8000");
// });