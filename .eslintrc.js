module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["prettier", "todo-ddl"], // 在eslint时启动prettier检查
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": "error", // prettier的lint的冲突会被ESLint当做错误处理
    "no-unexpected-multiline": "warn",
    "todo-ddl/diy": "warn",
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 7,
    sourceType: "module",
  },
};
