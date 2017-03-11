"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const hive_verify_1 = require("hive-verify");
// 查询车型信息
async function getCarModelByVin(vin, // 车架号(VIN)
    options // 可选参数
) {
    const sn = options.sn;
    logInfo(options, `sn: ${sn}, getCarModelByVin => RequestTime: ${new Date()}, requestData: { vin: ${vin} }`);
    if (!hive_verify_1.verify([
        hive_verify_1.stringVerifier("vin", vin),
    ], (errors) => {
        return Promise.reject({
            code: 403,
            message: errors.join("\n")
        });
    })) {
        // return;
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
                    resolve({
                        code: 200,
                        data: replyData
                    });
                }
                else {
                    reject({ code: 400, message: repData["error_code"] + ": " + repData["reason"] });
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
