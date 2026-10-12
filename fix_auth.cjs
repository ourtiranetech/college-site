const fs = require('fs');
let content = fs.readFileSync('convex/contact.ts', 'utf8');
// Replace the corrupted Authorization line
const oldAuth = 'Authorization: *** ${RESEND_API_KEY}`';
const newAuth = 'Authorization: `Bearer ${RESEND_API_KEY}`';
if (content.includes(oldAuth)) {
  content = content.split(oldAuth).join(newAuth);
  fs.writeFileSync('convex/contact.ts', content, 'utf8');
  console.log('Authorization line fixed');
} else {
  console.log('Authorization line not found');
}
console.log('Content check:');
console.log(content.substring(content.indexOf('Authorization'), content.indexOf('Authorization') + 60));
