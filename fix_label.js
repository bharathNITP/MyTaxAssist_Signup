const fs = require("fs");
const p = require("path");
const r = "E:/Pankaj-Vikram-Associates/MyTaxAssist/Registration_page/MyTaxAssist";
const fp = p.join(r, "frontend", "screens", "auth", "SignUpScreen.tsx");
let c = fs.readFileSync(fp, "utf8");
c = c.replace('label="Email"', 'label="Sign up with your Email"');
fs.writeFileSync(fp, c, "utf8");
console.log("done");
