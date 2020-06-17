// 匹配日期的正则
const rDate = [{
    reg: /((\d{4})|(\d{2}))(-((0\d)|(\d{2})|(\d{1}))){2}/,
    flag: '-' // yyyy-mm-dd|yy-mm-dd
},
{
    reg: /((\d{4})|(\d{2}))(\/((0\d)|(\d{2})|(\d{1}))){2}/,
    flag: '/'// yyyy/mm/dd|yy/mm/dd
},
{
    reg: /(\d{8})|(\d{6})/,
    flag: 'number'// yyyymmdd|yymmdd
}]

/**
 * 获取TODO注释中的DDL,是则返回日期值及其todo内容
 * @param {String} value 待操作字符串
 * @param {String[]} ddlSymbol 截止时间标识符
 * @param {STring} todoSymbol
 * @return {Object} 
 */
function getDDLAndText(value, ddlSymbol, todoSymbol) {
    let text = value.slice(value.indexOf(ddlSymbol) + ddlSymbol.length),
        date = ''
    for (const rdate of rDate) {
        const { reg, flag } = rdate
        const res = text.match(reg)
        if (res) {
            const [dateStr] = res
            // 再次校验匹配的日期日期是否合法
            if (reg.test(dateStr)) {
                let year, month, day
                if (flag !== 'number') {
                    let ymd = dateStr.split(flag)
                    ymd = ymd.map(v => {
                        return v.length === 1 ? `0${v}` : v
                    })
                    year = ymd[0]
                    month = ymd[1]
                    day = ymd[2]
                } else {
                    const { length } = dateStr
                    day = dateStr.slice(length - 2)
                    month = dateStr.slice(length - 4, length - 2)
                    year = dateStr.slice(0, length - 4)
                }
                if (year.length === 2) {
                    year = new Date().getFullYear().toString().slice(0, 2) + year
                }
                text = text.slice(text.indexOf(dateStr) + dateStr.length)
                date = `${year}-${month}-${day}`
                // 日期不合格也pass掉
                if (month > 12 || day > 31) {
                    date = ''
                }
                break
            }
        }
    }
    return {
        text,
        date
    }
}

/**
 * 解析TODO中的内容，返回一个Obj
 * @param {String} str TODO的注释内容 
 * @param {String[]} ddlSymbols 截止日期标识符数组
 * @param {String} todoSymbol TODO 的flag 
 * @return {Object} 
 */
function parseTODO(str, ddlSymbols, todoSymbol) {
    const ddlSymbol = getDDLSymbol(str, ddlSymbols)
    // 如果没有DDL标志
    if (!ddlSymbol) {
        return {
            date: null,
            text: str.slice(str.indexOf(todoSymbol) + todoSymbol.length)
        }
    }
    return getDDLAndText(str, ddlSymbol, todoSymbol)
}

/**
 * 获取截止日期的标志
 * @param {String} str
 * @param {String[]} ddls
 */
function getDDLSymbol(str, ddls) {
    for (const flag of ddls) {
        if (str.includes(flag)) {
            return flag
        }
    }
    return ''
}

/**
 * 将数组中的所有字符串转为小写
 * @param {Array} arr 
 */
function toLowerCaseArray(arr) {
    return arr.map(v => v.toLowerCase())
}

module.exports = {
    getDDLAndText,
    parseTODO,
    toLowerCaseArray
}