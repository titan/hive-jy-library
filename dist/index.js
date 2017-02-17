"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const http = require("http");
const hive_verify_1 = require("hive-verify");
const crypto = require("crypto");
// 查询车型信息
function getCarModelByFrameNo(frameNo, // 车架号(VIN)
    options // 可选参数
    ) {
    return __awaiter(this, void 0, void 0, function* () {
        const sn = crypto.randomBytes(64).toString("base64");
        logInfo(options, `sn: ${sn}, getCarModelByFrameNo => RequestTime: ${new Date()}, requestData: { frameNo: ${frameNo} }`);
        if (!hive_verify_1.verify([
            hive_verify_1.stringVerifier("frameNo", frameNo),
        ], (errors) => {
            return Promise.reject({
                code: 403,
                msg: errors.join("\n")
            });
        })) {
        }
        return new Promise((resolve, reject) => {
            const getCarModelByFrameNoTimeString = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
            const requestData = {
                "vinCode": frameNo
            };
            const req = {
                "channelType": "00",
                "requestCode": "100103",
                "operatorCode": "dev@fengchaohuzhu.com",
                "data": requestData,
                "dtype": "json",
                "operatorPwd": "2fa392325f0fc080a7131a30a57ad4d3"
            };
            const getCarModelByFrameNoPostData = JSON.stringify(req);
            logInfo(options, `sn: ${sn}, getCarModelByFrameNo => getCarModelByFrameNoPostData: ${getCarModelByFrameNoPostData}`);
            let jyhost = "www.jy-epc.com";
            let hostport = 80;
            let hostpath = "/api-show/NqAfterMarketDataServlet";
            const getCarModelByFrameNoOptions = {
                "hostname": jyhost,
                "port": hostport,
                "method": "POST",
                "path": hostpath,
                "headers": {
                    "Content-Type": "application/x-json",
                    "Content-Length": Buffer.byteLength(getCarModelByFrameNoPostData)
                }
            };
            const getCarModelByFrameNoReq = http.request(getCarModelByFrameNoOptions, function (res) {
                logInfo(options, `sn: ${sn}, getCarModelByFrameNo => getCarModelByFrameNoReq status: ${res.statusCode}`);
                res.setEncoding("utf8");
                let getCarModelByFrameNoResult = "";
                res.on("data", (body) => {
                    getCarModelByFrameNoResult += body;
                });
                res.on("end", () => {
                    logInfo(options, `sn: ${sn}, getCarModelByFrameNo => End of getCarModelByFrameNoReq`);
                    const repData = JSON.parse(getCarModelByFrameNoResult);
                    logInfo(options, `sn: ${sn}, getCarModelByFrameNo => ReplyTime: ${new Date()} , getCarModelByFrameNoResult: ${JSON.stringify(getCarModelByFrameNoResult)}`);
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
                                    groupName: data["groupName"],
                                    pl: data["pl"],
                                    engineDesc: data["engineDesc"],
                                    inairform: data["inairform"],
                                    arrayType: data["arrayType"],
                                    valveNum: data["valveNum"],
                                    fuelJetType: data["fuelJetType"],
                                    supplyOil: data["supplyOil"],
                                    drivenType: data["drivenType"],
                                    gearboxName: data["gearboxName"],
                                    gearNum: data["gearNum"],
                                    bodyType: data["bodyType"],
                                    doorNum: data["doorNum"],
                                    wheelbase: data["wheelbase"],
                                    yearPattern: data["yearPattern"],
                                    cfgLevel: data["cfgLevel"]
                                };
                                replyData.push(vehicle);
                            }
                        }
                        resolve({
                            code: 200,
                            data: replyData
                        });
                    }
                    else {
                        reject({ code: 400, msg: repData["error_code"] + ": " + repData["reason"] });
                    }
                });
                res.setTimeout(6000, () => {
                    reject({
                        code: 408,
                        msg: "智通接口超时"
                    });
                });
                res.on("error", (err) => {
                    logError(options, `sn: ${sn}, Error on getCarModelByFrameNo: ${err}`);
                    reject({
                        code: 500,
                        msg: err
                    });
                });
            });
            getCarModelByFrameNoReq.end(getCarModelByFrameNoPostData);
        });
    });
}
exports.getCarModelByFrameNo = getCarModelByFrameNo;
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
