/*jshint esversion: 6 */
/**
 * 数值格式化：支持千分位、%、‰、指定整数最小长度、指定小数最小长度及其它符号做前缀或后缀
 * 例：$#,###.00 $为前缀，千分位分割，小数位必须两位小数，不足两位以0补足
 *    $#,###.00# $为前缀，千分位分割，小数位至少要两位小数，不足两位以0补足，最大展示3位小数
 *    $.00# $为前缀，整数部分正常展示，小数位至少要两位小数，不足两位以0补足，最大展示3位小数
 *    $#000# $为前缀，整数部分至少需要4位，不足4位以0补足
 */

var NumberFormat = function() {
    const zeroDigit = '0';
    const groupingSeparator = ',';
    const decimalSeparator = '.';
    const percent = '%';
    const perMill = '\u2030';
    const digit = '#';
    const separator = ';';
    const exponent = 'E';
    const minus = '-';
    const CURRENCY_SIGN = '\u00A4';
    const QUOTE = '\'';

    var useExponentialNotation = false;
    var multiplier = 1;  // 格式化后的乘数，默认为1，如果有%则乘100，‰则乘1000
    var decimalPos = -1;  // 小数点位置
    var digitLeftCount = 0;
    var zeroDigitCount = 0;
    var digitRightCount = 0;
    var groupingCount = -1;
    var minExponentDigits = 0;
    var prefix = '';
    var suffix = '';

    var decimalMinmum = 0;  // 小数位最小位数
    var decimalMaxmum = 0;  // 小数位最大位数

    var integerMinmum = 0;  // 整数位最小位数

    /**
     * 解析格式化模板
     */
    var applyPattern = function (pattern) {
        let start = 0;
        let patternLen = pattern.length;
        let phase = 0;
        let phaseOneStart = 0;
        let phaseOneLength = 0;

        let affix = '';
        let collectPrefix = true; // 默认是收集前缀

        for (let pos = start; pos < patternLen; ++pos) {
            let ch = pattern.charAt(pos);
            switch (phase) {
                case 0:
                case 2:
                    if (ch == digit || ch == zeroDigit || ch == groupingSeparator || ch == decimalSeparator) {
                        phase = 1;
                        phaseOneStart = pos;
                        --pos;
                        continue;
                    } else if (ch == CURRENCY_SIGN) {
                        let doubled = (pos + 1) < patternLen && pattern.charAt(pos + 1) == CURRENCY_SIGN;
                        if (doubled) {
                            ++pos;
                        }
                        isCurrencyFormat = true;
                        affix += double ? "\u00A4\u00A4" : "\u00A4";
                        continue;
                    } else if (ch == QUOTE) { // ''单引号，不支持
                        throw new Error("Unquoted special character '" + ch + "' in pattern \"" + pattern + '"');
                    } else if (ch == separator) {
                        if (phase == 0) {
                            throw new Error("Unquoted special character '" + ch + "' in pattern \"" + pattern + '"');
                        }
                        start = pos + 1;
                        pos = patternLen;
                        continue;
                    } else if (ch == percent) {
                        if (multiplier != 1) {
                            throw new Error("Too many percent/per mille characters in pattern \"" + pattern + '"');
                        }
                        multiplier = 100;
                        affix += "%";
                        continue;
                    } else if (ch == perMill) {
                        if (multiplier != 1) {
                            throw new Error("Too many percent/per mille characters in pattern \"" + pattern + '"');
                        }
                        multiplier = 1000;
                        affix += "\u2030";
                        continue;
                    }
                    affix += ch;
                    if (collectPrefix) {
                        prefix += affix;
                    } else {
                        suffix += affix;
                    }
                    affix = '';
                    break;
                case 1:
                    ++phaseOneLength;
                    if (ch == digit) {
                        if (zeroDigitCount > 0) {
                            ++digitRightCount;
                        } else {
                            ++digitLeftCount;
                        }
                        if (groupingCount >= 0 && decimalPos < 0) {
                            ++groupingCount;
                        }
                    } else if (ch == zeroDigit) {
                        if (digitRightCount > 0) {
                            throw new Error("Unexpected '0' in pattern \"" + pattern + '"');
                        }
                        ++zeroDigitCount;
                        if (groupingCount >= 0 && decimalPos < 0) {
                            ++groupingCount;
                        }
                    } else if (ch == groupingSeparator) {
                        groupingCount = 0;
                    } else if (ch == decimalSeparator) {
                        if (decimalPos >= 0) {
                            throw new Error("Multiple decimal separators in pattern \"" + pattern + '"');
                        }
                        decimalPos = digitLeftCount + zeroDigitCount + digitRightCount;
                    } else if (pattern.substring(pos, pos + exponent.length) == exponent) {
                        throw new Error("Unexpected 'E' in pattern \"" + pattern + '"');
                        // if (useExponentialNotation) {
                        //     throw new Error("Multiple exponential symbols in pattern \"" + pattern + '"');
                        // }
                        // useExponentialNotation = true;
                        // minExponentDigits = 0;
                        // pos = pos + exponent.length;
                        // while (pos < patternLen && pattern.charAt(pos) == zeroDigit) {
                        //     ++minExponentDigits;
                        //     ++phaseOneLength;
                        //     ++pos;
                        // }
                        // if ((digitLeftCount + zeroDigitCount) < 1 || minExponentDigits < 1) {
                        //     throw new Error("Malformed exponential pattern \"" + pattern + '"');
                        // }
                        // phase = 2;
                        // affix = suffix;
                        // --pos;
                        // continue;
                    } else {
                        phase = 2;
                        affix = '';
                        collectPrefix = false;
                        --pos;
                        --phaseOneLength;
                        continue;
                    }
                    break;
            }
        }
        if (collectPrefix) {
            prefix += affix;
        } else {
            suffix += affix;
        }
        decimalRange();
        getIntegerMinmum(pattern);
    };

    /**
     * 算小数位的范围
     */
    var decimalRange = function () {
        if (zeroDigitCount > 0) {
            let lastZeroPos = digitLeftCount + zeroDigitCount;
            if (lastZeroPos > decimalPos) {
                decimalMinmum = lastZeroPos - decimalPos;
            }
        }
        if (decimalPos >= 0) {
            decimalMaxmum = digitLeftCount + zeroDigitCount + digitRightCount - decimalPos;
        }
    };

    /**
     * 计算整数位最小值
     */
    var getIntegerMinmum = function(pattern) {
        if(zeroDigitCount > 0) {
            if(decimalPos == -1) {
                integerMinmum = zeroDigitCount + digitRightCount;
            } else {
                integerMinmum = decimalPos - digitLeftCount;
            }
            
        }
    };

    /**
     * 入参为0或空等信息时返回的默认值
     */
    var defaultValue = function () {
        let result = '';
        if (decimalMinmum == 0) {
            result = 0;
        } else {
            for (let i = 0; i < decimalMinmum; i++) {
                result += zeroDigit;
            }
            result = '0.' + result;
        }
        if (prefix) {
            result = prefix + result;
        }
        if (suffix) {
            result += suffix;
        }
        return result;
    };

    /**
     * 做格式化操作
     */
    var doFormat = function (val) {
        if (!val || Number.isNaN(val)) {
            return defaultValue();
        }

        let digits = null;
        if (typeof (val) != 'number') {
            digits = Number(val);
        } else {
            digits = val;
        }
        let isNegative = Math.sign(val) == -1;
        // 是否需要进位
        if (multiplier != 1) {
            digits = digits * multiplier;
        }
        if(decimalMaxmum > 0) {
            digits = digits.toFixed(decimalMaxmum);
        }
        let digitsStr = String(digits);
        let digitsStrArr = digitsStr.split('.');
        let integerStr = digitsStrArr[0];
        let decimalStr = digitsStrArr.length > 1 ? digitsStrArr[1] : '';
        let result = '';
        result = addIntegerDigits(result, integerStr);
        decimalStr = deleteLastZero(decimalStr);
        result = addDecimalDigits(result, decimalStr);
        result = prefix + result;
        result += suffix;
        return result;
    };

    /**
     * 整数位格式化
     */
    var addIntegerDigits = function(val, integerStr) {
        if (groupingCount == 0) {
            val += integerStr;
        } else {
            integerStr = integerDigitsSupplement(integerStr);
            let count = 0;
            let nextPos = 0;
            for (let i = integerStr.length - 1; i >= 0; i--) {
                ++count;
                val = integerStr.charAt(i) + val;
                if (count == groupingCount) {
                    nextPos = i - 1;
                    if (nextPos >= 0 && integerStr.charAt(nextPos) != minus) {
                        val = groupingSeparator + val;
                    }
                    count = 0;
                }
            }
        }
        
        return val;
    };

    /**
     * 补足整数部分长度，如果整数部分限定最小长度，当前数据不满足长度则用0补足
     */
    var integerDigitsSupplement = function(integerStr) {
        if(integerMinmum == 0) {
            return integerStr;
        }
        let isNegative = false;
        if(integerStr.charAt(0) == minus) {
            integerStr = integerStr.substring(1, integerStr.length - 1);
            isNegative = true;
        }
        if(integerStr.length < integerMinmum) {
            let diff = integerMinmum - integerStr.length;
            let supplement = '';
            for(let i = 0; i < diff; i++) {
                supplement += zeroDigit;
            }
            integerStr = supplement + integerStr;
        }
        if(isNegative) {
            integerStr = minus + integerStr;
        }
        return integerStr;
    };

    /**
     * 删除小数位后多余的0
     */
    var deleteLastZero = function(value) {
        let len = value.length;
        if(len == 0) {
            return value;
        }
        let count = 0;
        for(let i = len - 1; i >= 0; i--) {
            if(value.charAt(i) == zeroDigit) {
                count++;
            } else {
                break;
            }
        }
        if(count > 0) {
            value = value.substring(0, len - count);
        }
        return value;
    };

    /**
     * 添加小数位
     */
    var addDecimalDigits = function(val, decimalStr) {
        let decimalLen = decimalStr.length;
        if(decimalMaxmum == 0) {
            return val;
        }
        if(decimalLen == 0 && decimalMinmum == 0) {
            return val;
        }
        val += decimalSeparator;
        
        if (decimalLen < decimalMinmum) {
            val += decimalStr;
            let diff = decimalMinmum - decimalLen;
            if (diff == 1) {
                val += zeroDigit;
            } else {
                for (let i = 0; i < diff; i++) {
                    val += zeroDigit;
                }
            }
        } else {
            val += decimalStr;
        }
        return val;
    };

    this.format = function(val, pattern) {
        applyPattern(pattern);
        // console.log(pattern + ' 【】 整数位分组：' + groupingCount + '; 乘数：' + multiplier + '; 小数位最小个数：' + decimalMinmum + '; 小数位最大个数：' + decimalMaxmum + "; 前缀：" + prefix + "; 后缀：" + suffix);
        let result = doFormat(val);
        // console.log("【" + val + "】" + " 【" + pattern + "】 " + result);
        return result;
    };

    this.numberFormat = function(val, tausendstel = -1, decimal = 0, multiple = 1) {
        decimalMinmum = decimal;  // 小数位最小位数
        decimalMaxmum = decimal;
        groupingCount = tausendstel;
        multiplier = multiple;
        return doFormat(val);
    };
}

export default NumberFormat;