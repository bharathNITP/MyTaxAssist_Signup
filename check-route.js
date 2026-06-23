const http = require("http");
http.get("http://localhost:8081/bankDetails", function(res) {
  let b = "";
  res.on("data", c => b += c);
  res.on("end", function() {
    console.log("Status:", res.statusCode);
    console.log("Has root:", b.includes('id="root"'));
    console.log("Unmatched:", b.includes("Unmatched"));
    console.log("Length:", b.length);
  });
}).on("error", e => console.log("Error:", e.message));