const http = require("http");
const fs = require("fs");
const items = require("./data/data");

// CREATE SERVER
const server = http.createServer((req, res) => {

  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = myUrl.pathname;
  const query = Object.fromEntries(myUrl.searchParams.entries());

  // Serve CSS
  if (path === "/style.css") {
    fs.readFile("./content/style.css", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
    return;
  }

  // Static Pages 
  if (path === "/") {
    fs.readFile("./content/home.html", (err, data) => {
      if (err) { 
        res.writeHead(500); res.end("Server Error"); return; }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
    return;
  }

  if (path === "/about") {
    fs.readFile("./content/about.html", (err, data) => {
      if (err) {
      res.writeHead(500); res.end("Server Error"); return; }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  if (path === "/help") {
    fs.readFile("./content/help.html", (err, data) => {
      if (err) {
      res.writeHead(500); res.end("Server Error"); return; }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

 // Items Route (HTML directly in JS)
if (path === "/items") {
  res.writeHead(200, { "Content-Type": "text/html" });

  let output = `
    <link rel="stylesheet" href="/style.css">
    <header>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/help">Help</a>
      <a href="/items">Items</a>
    </header>
    <div class="container">
  `;

  // Query by ID
  if (query.id) {
    const item = items.find(i => i.id == query.id);
    if (item) {
      output += `<h2>${item.name}</h2>
                 <p>Category: ${item.category}</p>
                 <p>Price: ${item.price}</p>
                 <a href="/items">Back to all items</a>`;
    } else {
      output += `<p>Item not found</p>
                 <a href="/items">Back to all items</a>`;
    }
  }

  // Query by Name
  else if (query.name) {
    const filtered = items.filter(i => i.name.toLowerCase() === query.name.toLowerCase());
    if (filtered.length > 0) {
      output += `<h1>Items matching: ${query.name}</h1>`;
      filtered.forEach(i => {
        output += `<p>${i.name} (${i.category}) - <a href="/items?id=${i.id}">View</a></p>`;
      });
    } else {
      output += `<p>No items found with name: ${query.name}</p>
                 <a href="/items">Back to all items</a>`;
    }
  }

  // Query by Category (new)
  else if (query.category) {
    const filtered = items.filter(i => i.category.toLowerCase() === query.category.toLowerCase());
    if (filtered.length > 0) {
      output += `<h1>Items in Category: ${query.category}</h1>`;
      filtered.forEach(i => {
        output += `<p>${i.name} - <a href="/items?id=${i.id}">View</a></p>`;
      });
    } else {
      output += `<p>No items found in category: ${query.category}</p>
                 <a href="/items">Back to all items</a>`;
    }
  }

  // Default: show all items
  else {
    output += "<h1>All Items</h1>";
    items.forEach(i => {
      output += `<p>${i.name} (${i.category}) - <a href="/items?id=${i.id}">View</a></p>`;
    });
  }

  res.end(output);
  return;
}


  //  404 
//   res.writeHead(404, { "Content-Type": "text/html" });
//   res.end("<h1>404 - Page Not Found</h1>");
});

// Start Server 
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
