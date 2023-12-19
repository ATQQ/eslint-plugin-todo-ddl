const { RuleTester } = require("eslint"),
  rule = require("../../../src/rules/eslint-plugin-todo-notice");

// TESTS
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
});

const today = new Date().toLocaleDateString();
const content = "这里是内容";
const oneDay = 1000 * 60 * 60 * 24;

const later = (num) => {
  const now = Date.now() + num * oneDay;
  const after = new Date(now);
  return `${after.getFullYear()}-${after.getMonth() + 1}-${after.getDate()}`;
};
const expiredWord = (text) =>
  `TODO WARN: 已经过截止日期，请立即修改，避免出现遗漏的bug --> ${text}`;
const expiringSoonWords = (days, text) =>
  `TODO WARN: 还有${days}天截止，请尽快修改，避免出现遗漏的bug --> ${text}`;
const invalidWord = (text) =>
  `TODO WARN: 没有设置有效的Deadline,设置方法(https://github.com/BertramXue/eslint-plugin-todo-notice) --> ${text}`;

const flag = ["future", "FIx", "wait"];
const ddl = ["deadline", "last date", "waitdate"];

let testData = {
  valid: [
    "// xxtodo: ddl 2050/6/30 text",
    "// todo: ddl 2050-06-20 这里是内容",
    "// todo: ddl 2050/06/20 这里是内容",
    "// todo: ddl 20500620 这里是内容",
    "// todo: ddl 50-06-20 这里是内容",
    "// todo: ddl 50/06/20 这里是内容",
    "// todo: ddl 500620 这里是内容",
    "// todo: ddl 2050-6-20 这里是内容",
    "// todo: ddl 2050/6/20 这里是内容",
    "// todo: ddl 50/6/20 这里是内容",
    "// todo: deadline 50/6/20 这里是内容",
    `/**
     * TODO
     * DDL 2050-5-25
     * ${content}
     */`,
    `/**
     * TODO
     * DDL ${later(10)}
     * ${content}
     */`,
  ],
  invalid: [
    {
      code: `// fix: DDL ${later(4)} ${content}`,
      options: [
        {
          flag,
        },
      ],
      errors: [{ message: expiringSoonWords(3, content) }],
    },
    {
      code: `// fix: deadline ${later(3)} ${content}`,
      options: [
        {
          flag,
          ddl,
        },
      ],
      errors: [{ message: expiringSoonWords(2, content) }],
    },
    {
      code: `// fix: DDL 2020-5-22 ${content}`,
      options: [
        {
          flag,
        },
      ],
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `/**
            * TODO
            * DDL 2020-5-25
            * ${content}
            */`,
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `// todo: ddl 20/6/2 ${content}`,
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `// todo: ddl 20-6-2 ${content}`,
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `// todo: ddl 200602 ${content}`,
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `// todo: deadline 200602 ${content}`,
      errors: [{ message: expiredWord(content) }],
    },
    {
      code: `// todo: 200602 ${content}`,
      errors: [{ message: invalidWord(`: 200602 ${content}`) }],
    },
    {
      code: "// todo: dead 200602 这里是内容",
      errors: [{ message: invalidWord(": dead 200602 这里是内容") }],
    },
    {
      code: "// todo: ddl 20602 这里是内容",
      errors: [{ message: invalidWord("20602 这里是内容") }],
    },
    {
      code: "// todo: ddl 202006 这里是内容",
      errors: [{ message: invalidWord("这里是内容") }],
    },
    {
      code: "// todo: ddl 20602 这里是内容",
      errors: [{ message: invalidWord("20602 这里是内容") }],
    },
    {
      code: "// todo: ddl 20-6-2 这里是内容",
      errors: [{ message: expiredWord("这里是内容") }],
    },
    {
      code: "// todo: ddl 20-16-2 这里是内容",
      errors: [{ message: invalidWord("这里是内容") }],
    },
    {
      code: "// todo: ddl 20/03/02 这里是内容",
      errors: [{ message: expiredWord("这里是内容") }],
    },
  ],
};
ruleTester.run("todo-ddl", rule, testData);
