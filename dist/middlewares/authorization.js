"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const pems = {};
class AuthMiddleware {
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new AuthMiddleware();
        return this.instance;
    }
    constructor() {
        this.poolRegion = config_1.AWS_REGION;
        this.userPoolId = config_1.COGNITO_USER_POOL_ID;
        this.getAWSCognitoPems();
    }
    verifyToken(req, res, next) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.replace('Bearer ', '');
            const decodedJWT = jsonwebtoken_1.default.decode(token, { complete: true });
            if (!decodedJWT) {
                return res.status(401).send({ code: 'InvalidTokenException', message: 'The token is no valid' });
            }
            const kid = decodedJWT.header.kid;
            if (kid !== undefined) {
                if (Object.keys(pems).includes(kid)) {
                    console.log("Verificado");
                    //return res.status(401).end();
                }
                const pem = pems[kid];
                jsonwebtoken_1.default.verify(token, pem, { algorithms: ['RS256'] }, function (err) {
                    if (err) {
                        return res.status(401).send({ code: 'InvalidTokenException', message: 'The token is no valid' });
                    }
                });
                req.user = decodedJWT.payload.username;
                req.token = token;
                next();
            }
            else {
                return res.status(401).send({ code: 'InvalidTokenException', message: 'The token is no valid' });
            }
        }
        else {
            res.status(401).send({ code: 'NoTokenFound', message: 'The token is not present in the request' });
        }
    }
    getAWSCognitoPems() {
        return __awaiter(this, void 0, void 0, function* () {
            const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
            try {
                const response = yield (0, node_fetch_1.default)(URL);
                if (response.status !== 200) {
                    throw 'COGNITO PEMS ERROR';
                }
                const data = yield response.json();
                // "kid": "1234example=",
                // "alg": "RS256",
                // "kty": "RSA",
                // "e": "AQAB",
                // "n": "1234567890",
                // "use": "sig"
                const { keys } = data;
                keys.forEach((key) => {
                    pems[key.kid] = (0, jwk_to_pem_1.default)({
                        kty: key.kty,
                        n: key.n,
                        e: key.e,
                    });
                });
                console.log(Object.keys(pems));
            }
            catch (error) {
                console.log('Auth Middleware getAWSCognitoPems() error', error);
            }
        });
    }
}
exports.default = AuthMiddleware;
