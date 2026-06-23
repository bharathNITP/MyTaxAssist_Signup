const fs = require("fs");
const p = require("path");
const r = "E:/Pankaj-Vikram-Associates/MyTaxAssist/Registration_page/MyTaxAssist";
const fp = p.join(r, "frontend", "screens", "auth", "SignUpScreen.tsx");
let content = fs.readFileSync(fp, "utf8");

// Add required prop to Email Input
content = content.replace(
  '<Input label="Email" placeholder="Email"',
  '<Input label="Email" placeholder="Email" required'
);

// Add required prop to Password Input
content = content.replace(
  '<Input label="Create Password" placeholder="Password" secureTextEntry={!showPassword}',
  '<Input label="Create Password" placeholder="Password" required secureTextEntry={!showPassword}'
);

// Add required prop to Confirm Password Input
content = content.replace(
  '<Input label="Re enter Password" placeholder="Confirm Password" secureTextEntry={!showConfirmPassword}',
  '<Input label="Re enter Password" placeholder="Confirm Password" required secureTextEntry={!showConfirmPassword}'
);

fs.writeFileSync(fp, content, "utf8");
console.log("signup required fields added");
