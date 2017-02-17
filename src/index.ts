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
  groupName: string; // 车组名称
  pl: string; // 排量
  engineDesc: string; // 发动机描述
  inairform: string; // 进气形式
  arrayType?: string; // 气缸排列形式
  valveNum?: string; // 气门数
  fuelJetType?: string; // 燃油类型
  supplyOil?: string; // 供油方式
  drivenType?: string; // 驱动形式
  gearboxName?: string; // 变速箱类型
  gearNum?: string; // 变速器档数
  bodyType?: string; // 车身结构
  doorNum?: string; // 门数
  wheelbase?: string; // 轴距
  yearPattern?: string; // 年款
  cfgLevel?: string; // 配置级别
}

// options
export interface Option {
  log: Logger; // 日志输出
}

// 查询车型信息
export async function getCarModelByFrameNo(
  frameNo: string, // 车架号(VIN)
  options?: Option // 可选参数
): Promise<any> {
  const sn = crypto.randomBytes(64).toString("base64");
  logInfo(options, `sn: ${sn}, getCarModelByFrameNo => RequestTime: ${new Date()}, requestData: { frameNo: ${frameNo} }`);
  if (!verify([
    stringVerifier("frameNo", frameNo),
  ], (errors: string[]) => {
    return Promise.reject({
      code: 403,
      msg: errors.join("\n")
    });
  })) {
    // return;
  }
  return new Promise((resolve, reject) => {
    const getCarModelByFrameNoTimeString: string = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
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
    const getCarModelByFrameNoPostData: string = JSON.stringify(req);
    logInfo(options, `sn: ${sn}, getCarModelByFrameNo => getCarModelByFrameNoPostData: ${getCarModelByFrameNoPostData}`);
    let jyhost: string = "www.jy-epc.com";
    let hostport: number = 80;
    let hostpath: string = "/api-show/NqAfterMarketDataServlet";
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
      let getCarModelByFrameNoResult: string = "";
      res.on("data", (body) => {
        getCarModelByFrameNoResult += body;
      });
      res.on("end", () => {
        logInfo(options, `sn: ${sn}, getCarModelByFrameNo => End of getCarModelByFrameNoReq`);
        const repData = JSON.parse(getCarModelByFrameNoResult);
        logInfo(options, `sn: ${sn}, getCarModelByFrameNo => ReplyTime: ${new Date()} , getCarModelByFrameNoResult: ${JSON.stringify(getCarModelByFrameNoResult)}`);
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
        } else {
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