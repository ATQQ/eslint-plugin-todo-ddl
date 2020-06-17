const { RuleTester } = require('eslint'),
    rule = require('../../../lib/rules/eslint-plugin-todo-ddl')

// TESTS
const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
})

const expiredWord = (text) => `TODO WARN: 已经过截止日期，请立即修改 --> ${text}`
const expiringSoonWords = (days, text) => `TODO WARN: 还有${days}天截止，请尽快修改 --> ${text}`
const invalidWord = (text) => `TODO WARN: 没有设置有效的Deadline,设置方法(https://km.sankuai.com/page/354295200) --> ${text}`

const flag = ['future', 'FIx', 'wait']
const ddl = ['deadline', 'last date', 'waitdate']
let testData1 = {
    valid: [
        '// TODO: DDL 2020-5-29 测试内容',
        '// TODO: DDL 2020-6-28 测试内容',
        `/**
        * TODO
        * DDL 2020-5-30
        * 内容十三水
        */`,
        `/**
        * fixme
        * DDL 2020-8-30
        * xxx
        */`,
        {
            code: '// future: DDL 2020-5-30 ddd',
            options: [{
                flag
            }]
        }, {
            code: '// fix: DDL 2020-5-30 ddd',
            options: [{
                flag
            }]
        }, {
            code: '// wait: DDL 2020-5-30 ddd',
            options: [{
                flag
            }]
        },
        {
            code: '// future: deadline 2020-5-30 ddd',
            options: [{
                flag,
                ddl
            }]
        }, {
            code: '// fix: waitdate 2020-5-30 ddd',
            options: [{
                flag,
                ddl
            }]
        }, {
            code: '// wait: last date 2020-5-30 ddd',
            options: [{
                flag,
                ddl
            }]
        },
        {
            code: '// TODO: DDL 2020-5-20 ddd',
            options: [{
                flag: ['fixme']
            }]
        },
        {
            code: '// TODO: DDL 2020-5-30 测试内容',
            options: [{ warnline: 6 }]
        }
    ],
    invalid: [
        {
            code: '// fix: DDL 2020-5-22 ddd',
            options: [{
                flag
            }],
            errors: [{ message: expiringSoonWords(1) }]
        }, {
            code: '// wait: DDL 2020-5-23 ddd',
            options: [{
                flag
            }],
            errors: [{ message: expiringSoonWords(2) }]
        },
        {
            code: '// future: deadline 2020-5-25 ddd',
            options: [{
                flag,
                ddl
            }],
            errors: [{ message: expiringSoonWords(4) }]
        }, {
            code: '// fix: waitdate 2020-5-23 ddd',
            options: [{
                flag,
                ddl
            }],
            errors: [{ message: expiringSoonWords(2) }]
        },
        {
            code: "// TODO: DDL 2020-4-28 测试内容",
            errors: [{ message: expiredWord() }]
        },
        {
            code: "// TODO: DDL 2020-5-23 测试内容",
            errors: [{ message: expiringSoonWords(2) }]
        },
        {
            code: "// fixme: DDL 2020-5-23 测试内容",
            errors: [{ message: expiringSoonWords(2) }],
            options: [{
                flag: ['fixme']
            }]
        },
        {
            code: `/**
            * TODO
            * DDL 2020-5-25
            * 内容十三水
            */`,
            errors: [{ message: expiringSoonWords(4) }]
        }
    ]
}

let testData2 = {
    valid: [
        '// xxtodo: ddl 2020/6/30 text',
        '// todo: ddl 2020-06-20 这里是内容',
        '// todo: ddl 2020/06/20 这里是内容',
        '// todo: ddl 20200620 这里是内容',
        '// todo: ddl 20-06-20 这里是内容',
        '// todo: ddl 20/06/20 这里是内容',
        '// todo: ddl 200620 这里是内容',
        '// todo: ddl 2020-6-20 这里是内容',
        '// todo: ddl 2020/6/20 这里是内容',
        '// todo: ddl 20/6/20 这里是内容',
        '// todo: deadline 20/6/20 这里是内容',
    ],
    invalid: [
        {
            code: '// fix: DDL 2020-5-22 ddd大大的人人人',
            options: [{
                flag
            }],
            errors: [{ message: expiredWord('ddd大大的人人人') }]
        },
        {
            code: `/**
            * TODO
            * DDL 2020-5-25
            * 内容十三水
            */`,
            errors: [{ message: expiredWord('内容十三水') }]
        },
        {
            code: '// todo: ddl 20/6/2 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20-6-2 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 200602 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
        {
            code: '// todo: deadline 200602 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
        {
            code: '// todo: 200602 这里是内容',
            errors: [
                { message: invalidWord(': 200602 这里是内容') }
            ]
        },
        {
            code: '// todo: dead 200602 这里是内容',
            errors: [
                { message: invalidWord(': dead 200602 这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20602 这里是内容',
            errors: [
                { message: invalidWord('20602 这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 202006 这里是内容',
            errors: [
                { message: invalidWord('这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20602 这里是内容',
            errors: [
                { message: invalidWord('20602 这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20-6-2 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20-16-2 这里是内容',
            errors: [
                { message: invalidWord('这里是内容') }
            ]
        },
        {
            code: '// todo: ddl 20/03/02 这里是内容',
            errors: [
                { message: expiredWord('这里是内容') }
            ]
        },
    ]
}
ruleTester.run('todo-ddl', rule, testData2)