const http = require("http");
http.get("http://localhost:8081/", function(res) {
  let b = "";
  res.on("data", c => b += c);
  res.on("end", function() {
    console.log("Status:", res.statusCode);
    console.log("Has root div:", b.includes('id="root"'));
    console.log("Has script bundle:", b.includes("entry.bundle"));
    console.log("Response length:", b.length);
  });
}).on("error", e => console.log("Server down:", e.message));