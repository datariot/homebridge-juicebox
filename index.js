const util = require('util');
const request = require('request');
const Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-juicebox", "JuiceBox", JuiceBoxAccessory);
}

function JuiceBoxAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.device_token = config["device_token"];
    this.account_token = config["account_token"];
    this.juicenet = axios.create({
        baseURL: 'http://emwjuicebox.cloudapp.net',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    this.batteryService = new Service.BatteryService(this.name);

    this.batteryService
        .getCharacteristic(Characteristic.ChargingState)
        .on('get', this.getChargingState.bind(this));

    this.batteryService
        .getCharacteristic(Characteristic.ContactState)
        .on('get', this.getContactState.bind(this));

    this.batteryService
        .getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.getBatteryLevel.bind(this));

}

JuiceBoxAccessory.prototype.getServices = function() {
    return [this.batteryService];
}

//
// Battery Charging State
//

JuiceBoxAccessory.prototype.getChargingState = function(callback) {
    this.log("Getting current state...");
    axios.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

JuiceBoxAccessory.prototype.getContactState = function(callback) {
    this.log("Getting contact state...");
    axios.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

JuiceBoxAccessory.prototype.getBatteryLevel = function(callback) {
    this.log("Getting battery level ...");
    axios.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}