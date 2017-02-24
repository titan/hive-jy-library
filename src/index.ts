import * as http from "http";
import { verify, uuidVerifier, stringVerifier, numberVerifier } from "hive-verify";
import * as bunyan from "bunyan";
import { Logger } from "bunyan";
import * as crypto from "crypto";

// 车型信息
export interface CarModel {
  vehicleCode: string; // 车型代码，唯一标识
  vehicleName: string; // 车型名称
  brandName: string; // 品牌名称
  familyName: string; // 车系名称
  bodyType?: string; // 车身结构
  engineDesc: string; // 发动机描述
  gearboxName?: string; // 变速箱类型
  groupName: string; // 车组名称
  cfgLevel?: string; // 配置级别
  purchasePrice: string; // 新车购置价
  purchasePriceTax: string; // 新车购置价含税
  seat: string; // 座位
  effluentStandard?: string; // 排放标准
  pl: string; // 排量
  fuelJetType?: string; // 燃油类型
  drivenType?: string; // 驱动形式
  yearPattern?: string; // 年款
}

// options
export interface Option {
  log: Logger; // 日志输出
}

// 查询车型信息
export async function getCarModelByVin(
  vin: string, // 车架号(VIN)
  options?: Option // 可选参数
): Promise<any> {
  const sn = crypto.randomBytes(64).toString("base64");
  logInfo(options, `sn: ${sn}, getCarModelByVin => RequestTime: ${new Date()}, requestData: { vin: ${vin} }`);
  if (!verify([
    stringVerifier("vin", vin),
  ], (errors: string[]) => {
    return Promise.reject({
      code: 403,
      message: errors.join("\n")
    });
  })) {
    // return;
  }
  return new Promise((resolve, reject) => {
    const getCarModelByVinTimeString: string = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
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
    const getCarModelByVinPostData: string = JSON.stringify(req);
    logInfo(options, `sn: ${sn}, getCarModelByVin => getCarModelByVinPostData: ${getCarModelByVinPostData}`);
    let jyhost: string = "www.jy-epc.com";
    let hostport: number = 80;
    let hostpath: string = "/api-show/NqAfterMarketDataServlet";
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
      logInfo(options, `sn: ${sn}, getCarModelByVin => getCarModelByVinReq status: ${res.statusCode}`);
      res.setEncoding("utf8");
      let getCarModelByVinResult: string = "";
      res.on("data", (body) => {
        getCarModelByVinResult += body;
      });
      res.on("end", () => {
        logInfo(options, `sn: ${sn}, getCarModelByVin => End of getCarModelByVinReq`);
        const repData = JSON.parse(getCarModelByVinResult);
        logInfo(options, `sn: ${sn}, getCarModelByVin => ReplyTime: ${new Date()} , getCarModelByVinResult: ${JSON.stringify(getCarModelByVinResult)}`);
        if (repData["error_code"] === "000000") {
          let replyData: CarModel[] = [];
          if (repData["result"] && repData["result"]["vehicleList"] && repData["result"]["vehicleList"].length > 0) {
            const dataSet: Object[] = repData["result"]["vehicleList"];
            for (let data of dataSet) {
              let vehicle: CarModel = {
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
        } else {
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

// 输出日志
function logInfo(options: Option, msg: string): void {
  if (options && options.log) {
    let log: Logger = options.log;
    log.info(msg);
  }
}

// 输出错误日志
function logError(options: Option, msg: string): void {
  if (options && options.log) {
    let log: Logger = options.log;
    log.error(msg);
  }
}
