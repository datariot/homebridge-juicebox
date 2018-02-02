var util = require('util');
var axios = require('axios');
var Service, Characteristic;

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

    this.informationService = new Service.AccessoryInformation()
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, 'eMotorWerks')
        .setCharacteristic(Characteristic.Model, 'JuiceBox')
        .setCharacteristic(Characteristic.SerialNumber, '123-456-789')

    this.batteryService = new Service.BatteryService(this.name)

    this.batteryService
        .getCharacteristic(Characteristic.BatteryLevel)
        .setProps({
            maxValue: 100,
            minValue: 0,
            minStep: 1
        })
        .on('get', this.getBatteryLevel.bind(this))

    this.batteryService
        .getCharacteristic(Characteristic.ChargingState)
        .setProps({
            maxValue: 1
        })
        .on('get', this.getChargingState.bind(this))

    this.batteryService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getLowBatteryStatus.bind(this))

    this.plugService = new Service.Outlet(this.name);

    this.plugService
        .getCharacteristic(Characteristic.OutletInUse)
        .on('get', this.getOutletInUse.bind(this));

}

JuiceBoxAccessory.prototype.getServices = function() {
    return [this.plugService, this.batteryService];
}

// Plug State
JuiceBoxAccessory.prototype.getOutletInUse = function(callback) {
    this.log("Getting contact state...");
    this.juicenet.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            console.log(response.data.state);
            switch (response.data.state) {
                case 'standby':
                    return callback(null, false)
                default:
                    return callback(null, true)
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

//
// Battery Charging State
//

JuiceBoxAccessory.prototype.getChargingState = function(callback) {
    this.log("Getting current state...");
    this.juicenet.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            switch (response.data.state) {
                case 'standby':
                    return callback(null, 1)
                default:
                    return callback(null, 0)
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

JuiceBoxAccessory.prototype.getBatteryLevel = function(callback) {
    this.log("Getting battery level ...");
    return 100;
    this.juicenet.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            return callback(null, 100);
        })
        .catch(function(error) {
            console.log(error);
        });
}

JuiceBoxAccessory.prototype.getLowBattery = function(callback) {
    this.log("Getting low battery level ...");
    return 0;
    this.juicenet.post('/box_api_secure', {
            cmd: "get_state",
            account_token: this.account_token,
            device_id: "datariot.test",
            token: this.device_token
        })
        .then(function(response) {
            return callback(null, 0);
        })
        .catch(function(error) {
            console.log(error);
        });
}