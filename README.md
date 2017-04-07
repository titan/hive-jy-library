jy-library 是对智通接口的二次封装, 供相应的后端模块调用。所有的返回数据以Promise进行封装。后端调用时使用async-await可以方便地处理Promise，try-catch 的err 返回的是智通接口访问不成功的捕获，根据业务情况在catch中，根据code处理err。

# ChangeLog

1. 2017-04-07
  * 增加 Option 的字段 sn, disque, queue
  * 修改 getAccuratePrice 和 getReferrencePrice 的入参

# Data Structure

## Vehicle

| name              | type    | note                       |
| ----              | ----    | ----                       |
| responseNo                | string  | 响应码                 |
| engineNo            | string  | 发动机号       |
| licenseNo          | string  | 车牌号         |
| frameNo          | string  | 车架号(VIN码)         |
| registerDate             | string  | 初登日期                      |

## CarModel

| name              | type    | note                       |
| ----              | ----    | ----                       |
| vehicleFgwCode                | string  | 发改委编码                 |
| vehicleFgwName            | string  | 发改委名称       |
| parentVehName          | string  | 年份款型         |
| modelCode          | string  | 品牌型号编码         |
| brandName             | string  | 品牌型号名称                      |
| engineDesc                | string  | 排量                 |
| familyName            | string  | 车系名称       |
| gearboxType          | string  | 车档型号         |
| remark          | string  | 备注         |
| newCarPrice             | string  | 新车购置价                      |
| purchasePriceTax                | string  | 含税价格                 |
| importFlag            | string  | 进口标识       |
| purchasePrice          | string  | 参考价         |
| seatCount          | string  | 座位数         |
| standardName             | string  | 款型名称                      |

## NextPolicyDate

| name              | type    | note                       |
| ----              | ----    | ----                       |
| ciLastEffectiveDate                | string  | 下期交强险起期                 |
| biLastEffectiveDate            | string  | 下期商业险起期       |

## Car

| name              | type    | note                       |
| ----              | ----    | ----                       |
| licenseNo                | string  | 车牌号码                 |
| frameNo?            | string  | 车架号(VIN码)       |
| modelCode          | string  | 品牌型号代码         |
| engineNo          | string  | 车架号(VIN码)         |
| isTrans?             | string  | 是否过户                      |
| transDate?            | string  | 过户日期       |
| registerDate          | string  | 初登日期         |

## Person

| name              | type    | note                       |
| ----              | ----    | ----                       |
| ownerName?                | string  | 车主姓名                 |
| ownerID?            | string  | 车主身份证号       |
| ownerMobile?          | string  | 车主手机号         |
| insuredName?          | string  | 被保人姓名         |
| insuredID?             | string  | 被保人身份证号                      |
| insuredMobile?             | string  | 被保人手机号                      |

## Coverage

| name              | type    | note                       |
| ----              | ----    | ----                       |
| coverageCode                | string  | 险别代码                 |
| coverageName?            | string  | 险别名称       |
| insuredPremium          | string  | 保额         |
| flag?          | string  | 标识         |

## SPAgreement

| name              | type    | note                       |
| ----              | ----    | ----                       |
| spaCode                | string  | 特约条款码                 |
| spaName            | string  | 特约条款名称       |
| spaContent          | string  | 特约条款内容         |
| riskCode          | string  | 险种代码         |

## QuotePrice

| name              | type    | note                       |
| ----              | ----    | ----                       |
| insurerCode                | string  | 保险人代码                 |
| channelCode?            | string  | 渠道编码       |
| thpBizID?          | string  | 请求方业务号         |
| bizID?          | string  | 智通引擎业务号         |
| biBeginDate             | string  | 商业险起期                      |
| biPremium                | string  | 商业险总保费                 |
| coverageList            | Coverage[]  | 商业险险别列表       |
| integral          | string  | 积分         |
| ciBeginDate          | string  | 交强险起期         |
| ciPremium             | string  | 交强险保费                      |
| carshipTax                | string  | 车船税金额                 |
| spAgreement?            | SPAgreement[]  | 特约信息       |
| cIntegral?          | string  | 结算交强险费率         |
| bIntegral?          | string  | 结算商业险费率         |
| showCiCost?             | string  | 显示交强险费率                      |
| showBiCost?            | string  | 显示商业险费率       |
| showSumIntegral?          | string  | 显示总积分         |

## Paylink

| name              | type    | note                       |
| ----              | ----    | ----                       |
| biProposalNo                | string  | 商业险投保单号                 |
| ciProposalNo            | string  | 交强险投保单号       |
| payLink          | string  | 支付链接         |
| bizID?          | string  | 业务号         |
| synchFlag?             | string  | 是否同步返回结果                      |

## Option

| name              | type    | note                       |
| ----              | ----    | ----                       |
| log?                | Logger  | 日志输出                 |
| sn?                | string  | sn 码                 |
| disque?                | Disq | Disq 对象                 |
| queue?                | string  | disque 存储位置                 |

# API

## getVehicleByLicense

根据车牌号查询车辆信息。

#### request

| name     | type   | meaning    |
| ----     | ----   | ----       |
| licenseNo     | string | 车牌号码     |
| options     | Option | 可选参数     |
#### response

| name | type    | meaning  |
| ---- | ----    | ----     |
| code | integer | 返回编码 |
| msg  | string  | 错误信息 |
| data | Vehicle | 车辆信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getVehicleByFrameNo

根据车架号查询车辆信息。

#### request

| name     | type   | meaning    |
| ----     | ----   | ----       |
| frameNo     | string | 车架号     |
| options     | Option | 可选参数     |

#### response

| name | type    | meaning  |
| ---- | ----    | ----     |
| code | integer | 返回编码 |
| msg  | string  | 错误信息 |
| data | Vehicle | 车辆信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

可能是用户已经注册，或者手机号码重复。

## getCarModel

查询车型信息。

#### request

| name     | type   | meaning    |
| ----     | ----   | ----       |
| frameNo    | string | 车架号      |
| licenseNo      | string   | 车牌信息   |
| responseNo    | string | 响应码      |
| options      | Option   | 可选参数   |

#### response

| name | type    | meaning  |
| ---- | ----    | ----     |
| code | integer | 返回编码 |
| msg  | string  | 错误信息 |
| data | CarModel  | 车型信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getFuzzyVehicle

模糊匹配车型。

#### request

| name | type | meaning   |
| ---- | ---- | ----      |
| brandName  | string | 品牌型号名称 |
| row      | string   | 行数   |
| page    | string | 当前页      |
| options      | Option   | 可选参数   |

#### response

| name | type    | meaning    |
| ---- | ----    | ----       |
| code | integer | 返回编码   |
| msg  | string  | 错误信息   |
| data | CarModel[]  | 车型信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getNextPolicyDate

获取下期投保起期。

#### request

| name    | type    | meaning            |
| ----    | ----    | ----               |
| responseNo | string | 响应码     |
| licenseNo  | string | 车牌号码     |
| limit   | integer | 返回结果集大小     |
| since   | iso8601 | 最晚结果的时间时间 |
| max     | iso8601 | 最新结果的时间     |

#### response

| name | type            | meaning        |
| ---- | ----            | ----           |
| code | integer         | 返回编码       |
| msg  | string          | 错误信息       |
| data | NextPolicyDate | 下期投保起期 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getReferrencePrice

获取参考报价。

#### request

| name | type | meaning   |
| ---- | ---- | ----      |
| cityCode  | string | 行驶城市代码 |
| responseNo  | string | 响应码 |
| licenseNo  | string | 车牌号码 |
| frameNo  | string | 车架号（vin) |
| modelCode  | string | 品牌型号代码 |
| engineNo  | string | 发动机号 |
| isTrans  | string | 是否过户车 |
| transDate  | string | 过户日期 |
| registerDate  | string | 初登日期 |
| ownerName  | string | 车主姓名 |
| ownerID  | string | 车主身份证号 |
| ownerMobile  | string | 车主手机号 |
| insurerCode  | string | 保险人代码 |
| coverageList  | Coverage[] | 险别列表 |
| options  | Option | 可选参数 |

#### response

| name | type    | meaning  |
| ---- | ----    | ----     |
| code | integer | 返回编码 |
| msg  | string  | 错误信息 |
| data | QuotePrice  | 报价信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getAccuratePrice

获取精准报价。

#### request

| name | type | meaning   |
| ---- | ---- | ----      |
| thpBizID  | string | 请求方业务号 |
| cityCode  | string | 行驶城市代码 |
| responseNo  | string | 响应码 |
| biBeginDate  | string | 商业险起期 |
| ciBeginDate  | string | 交强险去起期 |
| licenseNo  | string | 车牌号码 |
| frameNo  | string | 车架号（vin) |
| modelCode  | string | 品牌型号代码 |
| engineNo  | string | 发动机号 |
| isTrans  | string | 是否过户车 |
| transDate  | string | 过户日期 |
| registerDate  | string | 初登日期 |
| ownerName  | string | 车主姓名 |
| ownerID  | string | 车主身份证号 |
| ownerMobile  | string | 车主手机号 |
| insuredName  | string | 被保人姓名 |
| insuredID  | string | 被保人身份证号 |
| insuredMobile  | string | 被保人手机号 |
| insurerCode  | string | 保险人代码 |
| coverageList  | Coverage[] | 险别列表 |
| options  | Option | 可选参数 |

#### response

| name | type    | meaning  |
| ---- | ----    | ----     |
| code | integer | 返回编码 |
| msg  | string  | 错误信息 |
| data | QuotePrice  | 报价信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## applyPolicyCheck

申请核保。

#### request

| name   | type    | meaning            |
| ----   | ----    | ----               |
| insurerCode | string | 保险人代码     |
| bizID  | string | 业务号     |
| channelCode  | string | 渠道编码, 从精准报价接口的出参获取 |
| applicantName    | string | 投保人姓名     |
| applicantIdNo    | string    | 投保人身份证号          |
| applicantMobile | string | 投保人手机号码     |
| addresseeName  | string | 收件人姓名     |
| addresseeMobile  | string | 收件人电话 |
| addresseeDetails    | string | 收件人详细地址     |
| addresseeCounty    | string    | 收件人地区国标码          |
| addresseeCity | string | 收件人城市国标码     |
| addresseeProvince  | string | 收件人省国标码     |
| policyEmail  | string | 保单邮箱 |
| applicantUrl    | string | 支付成功后跳转地址, 后端和前段协定     |
| options    | Option    | 可选参数          |

#### response

| name | type               | meaning  |
| ---- | ----               | ----     |
| code | integer            | 返回编码 |
| msg  | string             | 错误信息 |
| data | Paylink | 支付链接信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getPaylink

申请核保。

#### request

| name   | type    | meaning            |
| ----   | ----    | ----               |
| bizID | string | 业务号     |
| options    | Option    | 可选参数          |

#### response

| name | type               | meaning  |
| ---- | ----               | ----     |
| code | integer            | 返回编码 |
| msg  | string             | 错误信息 |
| data | Paylink | 支付链接信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |

## getUnd

申请核保。

#### request

| name   | type    | meaning            |
| ----   | ----    | ----               |
| bizID | string | 业务号     |
| verificationCode  | string | 手机号验证码     |
| options    | Option    | 可选参数          |

#### response

| name | type               | meaning  |
| ---- | ----               | ----     |
| code | integer            | 返回编码 |
| msg  | string             | 错误信息 |
| data | Paylink | 支付链接信息 |

| code | meaning      |
| ---- | ----         |
| 200  | 成功 |
| 400  | 智通接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 智通接口超时 |
| 500  | 智通引擎库代码执行出错 |


