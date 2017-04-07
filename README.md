<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ChangeLog](#changelog)
- [Data Structure](#data-structure)
  - [CarModel](#carmodel)
  - [Option](#option)
- [API](#api)
  - [getCarModelByVin](#getcarmodelbyvin)
      - [request](#request)
      - [response](#response)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

jy-library 是对精友接口的二次封装, 供相应的后端模块调用。所有的返回数据以Promise进行封装。后端调用时使用async-await可以方便地处理Promise，try-catch 的err 返回的是精友接口访问不成功的捕获，根据业务情况在catch中，根据code处理err。

# ChangeLog

1. 2017-04-07
  * 增加 CarModel, Option 数据结构 
  * 增加 getcarmodelbyvin 接口
  * 修改 CarModel 数据结构

# Data Structure

## CarModel

| name              | type    | note                       |
| ----              | ----    | ----                       |
| vehicleCode                | string  | 车型代码，唯一标识                 |
| vehicleName            | string  | 车型名称       |
| brandName          | string  | 品牌名称           |
| familyName          | string  | 车系名称         |
| bodyType?             | string  | 车身结构                      |
| engineDesc                | string  | 发动机描述                 |
| gearboxName?            | string  | 变速箱类型       |
| groupName          | string  | 车组名称         |
| cfgLevel?          | string  | 配置级别           |
| purchasePrice             | string  | 新车购置价                      |
| purchasePriceTax                | string  | 新车购置价含税                 |
| seat            | string  | 座位       |
| effluentStandard?          | string  | 排放标准         |
| pl          | string  | 排量         |
| fuelJetType?             | string  | 燃油类型                      |
| drivenType?             | string  | 驱动形式                      |
| yearPattern?             | string  | 年款                      |

## Option

| name              | type    | note                       |
| ----              | ----    | ----                       |
| log?                | Logger  | 日志输出                 |
| sn?                | string  | sn 码                 |
| disque?                | Disq | Disq 对象                 |
| queue?                | string  | disque 存储位置                 |

# API

## getCarModelByVin
查询车型信息

#### request

| name     | type   | meaning    |
| ----     | ----   | ----       |
| vin     | string | 车架号(VIN)     |
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
| 400  | 精友接口返回错误信息 |
| 403  | 入参错误 |
| 408  | 精友接口超时 |
| 500  | 精友引擎库代码执行出错 |
