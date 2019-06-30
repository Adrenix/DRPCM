"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_rich_presence_1 = require("discord-rich-presence");
var RemoteTransport = /** @class */ (function () {
    function RemoteTransport(window) {
        this.window = window;
    }
    RemoteTransport.prototype._createClient = function (id) {
        var _this = this;
        this.client = discord_rich_presence_1.default(id);
        this.client.on('error', function (err) {
            console.log(err);
            _this.client = undefined;
        });
        this.client.rpc.transport.on('close', function () {
            console.log('client transport closed');
            _this.window.webContents.send('render-transport-closed');
        });
        console.log('successfully created client', this.client);
    };
    RemoteTransport.prototype.getClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('client requested: sending promise', this.client);
                return [2 /*return*/, this.client];
            });
        });
    };
    RemoteTransport.prototype.connect = function (id) {
        var _this = this;
        console.log('main-rpc-connect: attempting to connect rpc...', id);
        if (this.client) {
            console.log('destroying old client');
            this.disconnect();
        }
        this._createClient(id);
        return new Promise(function (resolve, reject) {
            var callExpire = function () {
                console.log('connection timeout');
                if (_this.client) {
                    _this.client.removeListener('connected', callConnection);
                }
                reject('Connection timed out.');
            };
            var callConnection = function (rpc) {
                console.log('connected', rpc);
                if (_this.client) {
                    _this.client.removeListener('error', callExpire);
                }
                resolve(rpc);
            };
            _this.client.once('connected', callConnection);
            _this.client.once('error', callExpire);
        });
    };
    RemoteTransport.prototype.setActivity = function (data) {
        var _this = this;
        console.log('setting rpc activity with', data);
        return new Promise(function (resolve, reject) {
            if (!_this.client) {
                return reject('No discord client connected.');
            }
            var expire = setTimeout(function () {
                console.log('setActivity timeout');
                reject('Could not set activity.');
            }, 5000);
            _this.client.updatePresence(data);
            _this.client.once('activity', function (response) {
                clearTimeout(expire);
                resolve(response);
            });
        });
    };
    RemoteTransport.prototype.clearActivity = function () {
        if (!this.client) {
            console.log('no client connected to clear');
            return;
        }
        console.log('clearing activity');
        this.client.clearPresence();
    };
    RemoteTransport.prototype.disconnect = function () {
        if (!this.client) {
            console.log('no client exists to disconnected');
            return;
        }
        console.log('disconnecting client');
        this.client.disconnect();
    };
    return RemoteTransport;
}());
exports.default = RemoteTransport;
//# sourceMappingURL=rpc.js.map