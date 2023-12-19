const { parseTODO, toLowerCaseArray } = require("../utils");
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "WARN：TODO过期/即将过期",
      category: "Stylistic Issues",
      recommended: true,
    },
    schema: [
      {
        type: "object", // 第一个可配置属性为object
        properties: {
          flag: {
            // 被检测的注释的开头关键字 默认 ["todo","fixme"]
            type: "array",
            items: {
              type: "string",
            },
          },
          ddl: {
            // 被检测的日期标志 默认 ["ddl","deadline"]
            type: "array",
            items: {
              type: "string",
            },
          },
          warnline: {
            // 发出警告的截止天数 默认 7
            type: "string",
          },
        },
      },
    ],
  },
  create(context) {
    const oneDay = 60 * 60 * 1000 * 24;
    // 取得AST
    const sourceCode = context.getSourceCode();
    // 获取所有的注释节点
    let comments = sourceCode.getAllComments();
    // 默认参数值
    let dFlag = ["todo", "fixme"];
    let dDdl = ["ddl", "deadline"];
    let dWarnLine = 7;

    // 获取传递的参数,校验参数合法性与设置参数值
    let [params] = context.options;
    if (params && Object.keys(params).length > 0) {
      let { flag, ddl, warnline } = params;
      dFlag = flag || dFlag;
      dDdl = ddl || dDdl;
      dWarnLine = warnline || dWarnLine;
    }

    // 转化为小写
    dFlag = toLowerCaseArray(dFlag);
    dDdl = toLowerCaseArray(dDdl);

    // 过滤出包含关键词的注释节点
    comments = comments.filter((comment) => {
      let { value, type } = comment;
      if (type === "Block") {
        value = value.replace(/\*|\n/g, "");
      }
      value = value.toLowerCase().trim();
      // 保存格式化后的字符串
      comment.newValue = value;
      for (const flag of dFlag) {
        if (value.startsWith(flag)) {
          // 保存上flag
          comment.flag = flag;
          return true;
        }
      }
      return false;
    });

    return {
      Program(node) {
        comments.forEach((comment) => {
          const { newValue, loc, type, flag } = comment;
          let { date, text } = parseTODO(newValue, dDdl, flag);
          text = text.trim();
          let errMsg = "";

          // 未设置DDL或者DDL不合法情况
          if (!date) {
            errMsg =
              "没有设置有效的Deadline,设置方法(https://github.com/BertramXue/eslint-plugin-todo-notice)";
          } else {
            const TODODate = new Date(date).getTime();
            const interval = TODODate - Date.now();
            // 如果已经到期
            if (interval < 0 || interval < oneDay) {
              errMsg = "已经过截止日期，请立即修改，避免出现遗漏的bug";
            } else {
              // 剩余天数(向下取整)
              const theRestDays = ~~(interval / oneDay);
              errMsg =
                theRestDays <= dWarnLine
                  ? `还有${theRestDays}天截止，请尽快修改，避免出现遗漏的bug`
                  : "";
            }
          }
          if (errMsg) {
            context.report({
              node: comment,
              message: `TODO WARN: ${errMsg} --> ${text}`,
            });
          }
        });
      },
    };
  },
};
