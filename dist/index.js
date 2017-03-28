"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const hive_verify_1 = require("hive-verify");
const crypto = require("crypto");
const msgpack = require("msgpack-lite");
// 查询车型信息
async function getCarModelByVin(vin, // 车架号(VIN)
    options // 可选参数
) {
    const sn = options.sn;
    const unity = crypto.randomBytes(64).toString("base64");
    logInfo(options, `sn: ${sn}, getCarModelByVin => RequestTime: ${new Date()}, requestData: { vin: ${vin} }`);
    try {
        await hive_verify_1.verify([
            hive_verify_1.stringVerifier("vin", vin),
        ]);
    }
    catch (err) {
        return {
            code: 410,
            message: err.message
        };
    }
    return new Promise((resolve, reject) => {
        const getCarModelByVinTimeString = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
        const requestData = {
            "vinCode": vin
        };
        const req = {
            "channelType": "00",
            "requestCode": "100103",
            "operatorCode": "dev@fengchaohuzhu.com",
            "data": requestData,
            "dtype": "json",
            "operatorPwd": "2fa392325f0fc080a7131a30a57ad4d3"
        };
        const getCarModelByVinPostData = JSON.stringify(req);
        sendMessage(options, getCarModelByVinPostData, "request", unity);
        logInfo(options, `sn: ${sn}, getCarModelByVin => getCarModelByVinPostData: ${getCarModelByVinPostData}`);
        let jyhost = "www.jy-epc.com";
        let hostport = 80;
        let hostpath = "/api-show/NqAfterMarketDataServlet";
        const getCarModelByVinOptions = {
            "hostname": jyhost,
            "port": hostport,
            "method": "POST",
            "path": hostpath,
            "headers": {
                "Content-Type": "application/x-json",
                "Content-Length": Buffer.byteLength(getCarModelByVinPostData)
            }
        };
        const getCarModelByVinReq = http.request(getCarModelByVinOptions, function (res) {
            res.setEncoding("utf8");
            let getCarModelByVinResult = "";
            res.on("data", (body) => {
                getCarModelByVinResult += body;
            });
            res.on("end", () => {
                const repData = JSON.parse(getCarModelByVinResult);
                sendMessage(options, getCarModelByVinResult, "response", unity);
                logInfo(options, `sn: ${sn}, getCarModelByVin => ReplyTime: ${new Date()} , getCarModelByVinResult: ${getCarModelByVinResult}`);
                if (repData["error_code"] === "000000") {
                    let replyData = [];
                    if (repData["result"] && repData["result"]["vehicleList"] && repData["result"]["vehicleList"].length > 0) {
                        const dataSet = repData["result"]["vehicleList"];
                        for (let data of dataSet) {
                            let vehicle = {
                                vehicleCode: data["vehicleCode"],
                                vehicleName: data["vehicleName"],
                                brandName: data["brandName"],
                                familyName: data["familyName"],
                                bodyType: data["bodyType"],
                                engineDesc: data["engineDesc"],
                                gearboxName: data["gearboxName"],
                                groupName: data["groupName"],
                                cfgLevel: data["cfgLevel"],
                                purchasePrice: data["purchasePrice"],
                                purchasePriceTax: data["purchasePriceTax"],
                                seat: data["seat"],
                                effluentStandard: data["effluentStandard"],
                                pl: data["pl"],
                                fuelJetType: data["fuelJetType"],
                                drivenType: data["drivenType"],
                                yearPattern: data["yearPattern"]
                            };
                            replyData.push(vehicle);
                        }
                    }
                    else {
                        // 从目前精友的返回报文来看,不会出现此情况
                        reject({
                            code: 404,
                            msg: getCarModelByVinResult
                        });
                    }
                    resolve({
                        code: 200,
                        data: replyData
                    });
                }
                else {
                    reject({ code: 400, message: getCarModelByVinResult });
                }
            });
            res.setTimeout(6000, () => {
                reject({
                    code: 408,
                    message: "精友接口超时"
                });
            });
            res.on("error", (err) => {
                logError(options, `sn: ${sn}, Error on getCarModelByVin: ${err}`);
                reject({
                    code: 500,
                    message: err
                });
            });
        });
        getCarModelByVinReq.end(getCarModelByVinPostData);
    });
}
exports.getCarModelByVin = getCarModelByVin;
// 输出日志
function logInfo(options, msg) {
    if (options && options.log) {
        let log = options.log;
        log.info(msg);
    }
}
// 输出错误日志
function logError(options, msg) {
    if (options && options.log) {
        let log = options.log;
        log.error(msg);
    }
}
// 请求响应记录分析
function sendMessage(options, msg, type, unity) {
    if (options && options.disque && options.queue) {
        const sn = options.sn;
        const disque = options.disque;
        const queue = options.queue;
        const job = {
            "sn": sn,
            "unity": unity,
            "type": type,
            "body": JSON.parse(msg),
            "src": "精友",
            "timestamp": new Date()
        };
        const job_buff = msgpack.encode(job);
        disque.addjob(queue, job_buff, () => { }, (e) => {
            logError(options, e.message);
        });
    }
}
