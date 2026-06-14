const fs = require('fs');
const path = require('path');

const dir = './src';
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk(dir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/max-w-sm\b/g, 'max-w-[384px]');
  content = content.replace(/max-w-md\b/g, 'max-w-[448px]');
  content = content.replace(/max-w-lg\b/g, 'max-w-[512px]');
  content = content.replace(/max-w-xl\b/g, 'max-w-[576px]');
  fs.writeFileSync(file, content);
});
console.log('Fixed max-w classes!');
