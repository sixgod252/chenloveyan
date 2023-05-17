const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/template-overview.html`, `utf-8`);
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`, `utf-8`);
const tempProduct = fs.readFileSync(`${__dirname}/template-product.html`, `utf-8`);

const data = fs.readFileSync(`${__dirname}/data.json`, `utf-8`);
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    const pathName = pathname;
    // Overview
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        //console.log("cardsHtml");
        // res.end(tempOverview);
        res.end(output);

    // Product page
    } else if(pathName === '/product') {
        // console.log(query);
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json',"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "PUT, POST, PATCH, DELETE, GET"});
        res.end(data);
    
    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page no found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
