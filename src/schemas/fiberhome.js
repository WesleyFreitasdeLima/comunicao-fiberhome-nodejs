const joi = require("joi");

const schemaEmsConfig = joi.object({
  HOST: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    )
    .required(),

  PORT: joi.number().integer().min(0).max(65535).required(),
});

const validarEmsConfig = (HOST, PORT) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaEmsConfig.validate({ HOST, PORT });

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaEmsLogin = joi.object({
  LOGIN: joi.string().required(),

  SENHA: joi.string().required(),
});

const validarEmsLogin = (LOGIN, SENHA) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaEmsLogin.validate({ LOGIN, SENHA });

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaOnu = joi.object({
  OLTID: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    )
    .required(),

  PONID: joi.string().pattern(/^(([0-9]|NA)[-]){3}([0-9]|NA)$/),

  AUTHTYPE: joi.string().pattern(/^(\MAC|LOID|LOIDONCEON)$/),

  ONUID: joi
    .string()
    .pattern(
      /^(FHTT)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    ),

  ONUPORT: joi.string().pattern(/^(NA[-]){3}([0-4]{1,3})$/),

  PORTID: joi.string().pattern(/^(NA[-]){3}([0-4])$/),
});

const validarOnuInfo = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaOnu.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaCTAGReiniciarOnu = joi.object({
  RESETTYPE: joi.number().min(0).max(1),
});

const validarCTAGReiniciarOnu = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaCTAGReiniciarOnu.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaCTAGWanServiceCfg = joi.object({
  STATUS: joi.number().min(0).max(1),
  MODE: joi.number().min(1).max(4),
  CONNTYPE: joi.number().min(1).max(2),
  VLAN: joi.number().min(0).max(4085),
  COS: joi.number().min(0).max(7),
  QOS: joi.number().min(1).max(2),
  NAT: joi.number().min(1).max(2),
  IPMODE: joi.number().min(1).max(3),
  WANIP: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  WANMASK: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  WANGATEWAY: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  MASTERDNS: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  SLAVEDNS: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  PPPOEPROXY: joi.number().min(1).max(2),
  PPPOEUSER: joi.string(),
  PPPOEPASSWD: joi.string(),
  PPPOENAME: joi.string().allow(""),
  PPPOEMODE: joi.number().min(1).max(2),
  UPORT: joi.alternatives(
    joi.number().min(0).max(4),
    joi.number().min(100).max(110)
  ),
  SSID: joi.number().min(1).max(10),
  WANSVC: joi.number().min(1).max(1),
});

const validarCTAGWanServiceCfg = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaCTAGWanServiceCfg.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaCTAGVoipServiceCfg = joi.object({
  PHONENUMBER: joi
    .string()
    .pattern(
      /^\(?(?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/
    ),
  PT: joi.string().pattern(/^(\H.248|SIP)$/),
  EID: joi.string(),
  TID: joi.string(),
  SIPREGDM: joi.string(),
  SIPUSERNAME: joi.string(),
  SIPUSERPWD: joi.string(),
  SVLAN: joi.number().min(0).max(4095),
  VOIPVLAN: joi.number().min(0).max(4095),
  IPMODE: joi.string().pattern(/^(\DHCP|PPPOE|STATIC)$/),
  IP: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  IPMASK: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  IPGATEWAY: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  PPPOEUSER: joi.string(),
  PPPOEPWD: joi.string(),
  SCOS: joi.number().min(0).max(7),
  COS: joi.number().min(0).max(7),
  UPORT: joi.number().min(0).max(4),
  MGCIP1: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  MGCIP2: joi
    .string()
    .pattern(
      /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    ),
  VOICECODEC: joi.string().pattern(/^(\G.711U|G\.711A|G.722|G.723|G.729)$/),
});

const validarCTAGVoipServiceCfg = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaCTAGVoipServiceCfg.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaCTAGCodecVoipServiceCfg = joi.object({
  VoiceCodeMode: joi.string().pattern(/^(\G.711U|G\.711A|G.722|G.723|G.729)$/),
  FaxMode: joi.string().pattern(/^(\Transparent|T.38)$/),
  SlienceSwitch: joi.string().pattern(/^(\enable|disable)$/),
  EchoCancel: joi.string().pattern(/^(\enable|disable)$/),
  InputGain: joi.number().min(0),
  OutputGain: joi.number().min(0),
  DTMFMode: joi.string().pattern(/^(\Transparent|RFC2833)$/),
});

const validarCTAGCodecVoipServiceCfg = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaCTAGCodecVoipServiceCfg.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaCTAGVLANServicePortOnu = joi.object({
  VoiceCodeMode: joi.string().pattern(/^(\G.711U|G\.711A|G.722|G.723|G.729)$/),
  FaxMode: joi.string().pattern(/^(\Transparent|T.38)$/),
  SlienceSwitch: joi.string().pattern(/^(\enable|disable)$/),
  EchoCancel: joi.string().pattern(/^(\enable|disable)$/),
  InputGain: joi.number().min(0),
  OutputGain: joi.number().min(0),
  DTMFMode: joi.string().pattern(/^(\Transparent|RFC2833)$/),
});

const validarCTAGVLANServicePortOnu = ({ ...params }) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaCTAGCodecVoipServiceCfg.validate(params);

    if (schemaValidacao.error) return reject(schemaValidacao.error);

    return resolve(schemaValidacao.values);
  });
};

const schemaNumeroTelefone = joi.string().pattern(/^([0-9]{10})/);

const validarNumeroTelefone = (numTelefone) => {
  return new Promise((resolve, reject) => {
    const schemaValidacao = schemaNumeroTelefone.validate(numTelefone);

    if (schemaValidacao.error) return reject("Número de telefone inválido");

    return resolve(schemaValidacao.value);
  });
};

module.exports = {
  validarEmsConfig,
  validarEmsLogin,
  validarOnuInfo,
  validarCTAGWanServiceCfg,
  validarCTAGVoipServiceCfg,
  validarCTAGCodecVoipServiceCfg,
  validarCTAGReiniciarOnu,
  validarCTAGVLANServicePortOnu,
  validarNumeroTelefone,
};
