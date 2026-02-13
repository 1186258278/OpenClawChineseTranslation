import fs from 'node:fs';

const c = fs.readFileSync('C:/Data/PC/openclaw-upstream/src/commands/auth-choice-options.ts', 'utf8');

// 检查换行符类型
const hasCRLF = c.includes('\r\n');
const hasLF = c.includes('\n');
console.log('换行符类型:', hasCRLF ? 'CRLF (\\r\\n)' : 'LF (\\n)');

// 检查关键文本
console.log('has shengsuanyun:', c.includes('shengsuanyun'));
console.log('has 胜算云:', c.includes('胜算云'));
console.log('has Together AI API key:', c.includes('Together AI API key'));
console.log('has venice:', c.includes('venice'));

// 用 LF 检查锚点1
const anchor1_lf = 'hint: "Access to Llama, DeepSeek, Qwen, and more open models",\n  });';
const anchor1_crlf = 'hint: "Access to Llama, DeepSeek, Qwen, and more open models",\r\n  });';
console.log('anchor1 (LF):', c.includes(anchor1_lf));
console.log('anchor1 (CRLF):', c.includes(anchor1_crlf));

// 用 LF 检查锚点2
const anchor2_lf = 'choices: ["together-api-key"],\n  },\n  {\n    value: "venice"';
const anchor2_crlf = 'choices: ["together-api-key"],\r\n  },\r\n  {\r\n    value: "venice"';
console.log('anchor2 (LF):', c.includes(anchor2_lf));
console.log('anchor2 (CRLF):', c.includes(anchor2_crlf));

// 打印 Together AI 附近的行
const lines = c.split(/\r?\n/);
lines.forEach((l, i) => {
  if (l.includes('Together') || l.includes('venice') || l.includes('shengsuanyun')) {
    console.log(`${i + 1}: ${l.trim()}`);
  }
});
