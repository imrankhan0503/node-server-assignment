const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.writeHead(200, { "Content-Type": "text/html" });

  // HOME PAGE (HTML directly in JS)
  if (path === "/") {
    res.write(`
      <h1>Home Page</h1>
      <p>This is a simple Node server using core modules only.</p>

      <h3>How to test the application:</h3>
      <ul>
        <li>/about</li>
        <li>/help</li>
        <li>/welcome?name=Ali&role=Student</li>
        <li>/items</li>
        <li>/items?id=2</li>
      </ul>
    `);
    res.end();
  }

  // ROUTE 1 – external HTML file
  else if (path === "/about") {
    fs.readFile("about.html", (err, data) => {
      res.write(data);
      res.end();
    });
  }

  // ROUTE 2 – external HTML file
  else if (path === "/help") {
    fs.readFile("help.html", (err, data) => {
      res.write(data);
      res.end();
    });
  }

  // ROUTE 3 – HTML directly in JS + queries
  else if (path === "/welcome") {
    const name = query.name || "Guest";
    const role = query.role || "Visitor";

    res.write(`
      <h1>Welcome ${name}</h1>
      <p>Your role is: ${role}</p>
    `);
    res.end();
  }

  // ROUTE 4 – data file with array of objects
  else if (path === "/items") {
    fs.readFile("data.txt", "utf8", (err, data) => {
      const items = JSON.parse(data);

      if (query.id) {
        const item = items.find(i => i.id == query.id);

        if (item) {
          res.write(`
            <h1>${item.name}</h1>
            <p>Type: ${item.type}</p>
          `);
        } else {
          res.write("<p>No item found</p>");
        }
      } else {
        res.write("<h1>All Items</h1>");
        items.forEach(i => {
          res.write(`<p>${i.name} (${i.type})</p>`);
        });
      }

      res.end();
    });
  }

  // 404
  else {
    res.write("<h1>404 - Page not found</h1>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
