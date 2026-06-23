const http = require("http");
http.get("http://localhost:8081/_expo/router/sitemap", { headers: { Accept: "text/plain" } }, function(res) {
  let b = "";
  res.on("data", c => b += c);
  res.on("end", function() {
    console.log(b);
  });
}).on("error", e => console.log("Error:", e.message));