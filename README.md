# eslint-plugin-todo-ddl

检查代码中的`TODO`注释是否到期或者将要到期

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-todo-ddl`:

```
$ mnpm install eslint-plugin-todo-ddl --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-todo-ddl` globally.

## Usage

Add `todo-ddl` to the plugins section of your `.eslintrc` configuration file or `package.json`. You can omit the `eslint-plugin-` prefix:

`package.json` demo
```json
"eslintConfig": {
    "plugins": [
      "todo-ddl"
    ],
    "rules": {
      "todo-ddl/diy":1
    }
}
```

After the configuration is complete, you can see the prompts when coding and building

Formats that can be detected

```js
// TODO: DDL 2020-4-28 提示自己的内容
// fixme: DDL 2020/4/28 提示自己的内容
// TODO: deadline 20200428 提示自己的内容
// fixme: deadline 20-4-28 提示自己的内容
```
or
```js
/**
* TODO
* DDL 2020-5-19
* 提示自己的内容
*/
```

## support date formats
> For example, June 1, 2020 --- 2020-06-01

|  format1   |    demo    |  format2   |    demo    | format3  |   demo   |
| :--------: | :--------: | :--------: | :--------: | :------: | :------: |
| yyyy-mm-dd | 2020-06-01 | yyyy/mm/dd | 2020/06/01 | yyyymmdd | 20200601 |
|            | 2020-06-1  |            | 2020/06/1  |          |  200601  |
|            | 2020-6-01  |            | 2020/6/01  |
|            |  20-06-01  |            |  20/06/01  |
|            |   20-6-1   |            |   20/6/1   |
|            |  20-6-01   |            |  20/6/01   |
## customize
You can customize the detected keywords

|   key    |   type   |                  comment                   |
| :------: | :------: | :----------------------------------------: |
|   flag   | string[] |   The beginning of the detected comment    |
|   ddl    | string[] | The effective time of the detected comment |
| warnline |  string  |                  warnline                  |

**default value**
```json
"rules": {
    "todo-ddl/diy":[1,{
      "flag": ["todo","fixme"],
      "ddl":  ["ddl","deadline"],
      "warnline": "7"
    }]
}
```
