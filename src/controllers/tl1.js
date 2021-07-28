const Socket = require("./socket");
const FiberHomeSchema = require("../schemas/fiberhome");

class TL1 {
  #servidor = null;

  constructor() {
    this.#servidor = new Socket();
  }

  /**
   * Inicia conexão TL1 com o #servidor informado
   * @param {*} emsHost
   * @param {*} emsPortaTL1
   */
  conectar(emsHost, emsPortaTL1) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarEmsConfig(emsHost, emsPortaTL1);
        await this.#servidor.conectar(emsHost, emsPortaTL1);
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Encerra a conexão TL1
   */
  desconectar() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.#servidor.desconectar();
        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Envia comando de operacao, faz a checagem e retorna a resposta em formato de string
   * @param {*} stringDeComando
   */
  enviarComando = (stringDeComando, forcarEspera = 1000) => {
    return new Promise(async (resolve, reject) => {
      try {
        let retornoString = await this.#servidor.enviarComando(
          stringDeComando,
          null,
          forcarEspera
        );
        retornoString = await this.checarErroNoComando(retornoString);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  };

  /**
   * Envia o comando de consulta, faz a checagem e retorna a resposta em formato de array
   * @param {*} stringDeComando
   */
  enviarComandoConsulta = (stringDeComando) => {
    return new Promise(async (resolve, reject) => {
      try {
        const retornoString = await this.#servidor.enviarComando(
          stringDeComando,
          ";"
        );
        await this.checarErroNoComando(retornoString);
        const retornoArray = this.converterRetornoListaStringParaArray(
          retornoString
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  };

  /**
   * Verifica se na string de retorno do comando contém erros
   * @param {*} retornoString
   */
  checarErroNoComando = (retornoString) => {
    return new Promise((resolve, reject) => {
      // Mantém apenas o caractes aceitos
      retornoString = retornoString.replace(/[^a-zA-Z0-9-.:;=/]/g, " ");

      // Obtém os index de posição das palavras chaves
      const codigoErroPos = retornoString.toString().indexOf("EN=");
      const descricaoErroPos = retornoString.toString().indexOf("ENDESC=");
      const ultimoCaracterePos = retornoString.toString().indexOf(";");

      // Obtém as strings do código e descrição de erro
      const codigoErro = retornoString
        .substring(codigoErroPos, descricaoErroPos)
        .trim();
      const descricaoErro = retornoString
        .substring(descricaoErroPos, ultimoCaracterePos)
        .trim();

      // Caso indique uma mensagem diferente da padrão rejeita passando a string do erro
      if (descricaoErroPos > -1)
        if (descricaoErro !== "ENDESC=No error")
          return reject(`${codigoErro} ${descricaoErro}`);

      retornoString = `${codigoErro} ${descricaoErro}`;
      return resolve(retornoString);
    });
  };

  /**
   * Converte em array a string obtida no retorno de comandos de consulta
   * @param {*} retornoString
   */
  converterRetornoListaStringParaArray = (retornoString) => {
    try {
      // Transforma a string em array, quebrando pelo delimitador de blocos informado
      const delimitadorDeBlocos =
        "--------------------------------------------------------------------------------";
      const arrayBlocos = retornoString.split(delimitadorDeBlocos);

      // Exclui os blocos de informação do resultado da consulta, mantendo apenas os blocos com as informações necessárias
      const arrayApenasBlocosValidos = arrayBlocos.filter(
        (bloco) => bloco.indexOf("total_blocks") === -1
      );

      // Faz o tratamento para criar o array que será retornado como resultado
      let arrayCabecalhos = Array();
      let retornoArray = Array();
      arrayApenasBlocosValidos.forEach((bloco, indexBloco) => {
        // Quebra o bloco e obtém todas linhas
        const linhasPorBloco = bloco.split("\r\n");

        // Exclui as linhas vazias
        const apenasLinhasValidas = linhasPorBloco.filter((linha) => linha);

        apenasLinhasValidas.forEach((linha, indexLinha) => {
          // Pega apenas a primeira linha do primeiro bloco, que é a do cabeçalho e armazena no arrayCabecalhos
          if (indexBloco === 0 && indexLinha === 0) {
            arrayCabecalhos = linha.split("\t");
          }

          // Armazena as linhas com os campos de informações no retornoArray
          if (indexLinha > 0) {
            let arrayInfo = Array();
            const campos = linha.split("\t");
            campos.forEach((campo, indexCampo) => {
              // Armazena a info com o cabeçaho respectivo no arrayInfo
              arrayInfo[arrayCabecalhos[indexCampo]] = campo.trim();
            });

            // Armazena o arrayInfo no retornoArray
            retornoArray.push(arrayInfo);
          }
        });
      });

      return retornoArray;
    } catch (error) {
      return [];
    }
  };

  /**
   * Retorna formatada a string do comando, organizando o parametros dinâmicamente
   * @param {*} cmdPrincipal
   * @param {*} parametrosCmdPrincipal
   * @param {*} parametrosCTAG
   */
  montarStringDeComando = (
    cmdPrincipal,
    parametrosCmdPrincipal = "",
    parametrosCTAG = ""
  ) => {
    return new Promise((resolve, reject) => {
      try {
        // Mescla os objetos com os parametros obrigatórios e opcionais do Cmd Principal e da CTAG
        /*
                const parametrosCmdPrincipal = Object.assign(parametrosObrigatoriosCmdPrincipal, parametrosOpcionaisCmdPrincipal);
                const parametrosCTAG = Object.assign(parametrosObrigatoriosCTAG, parametrosOpcionaisCTAG);
                */

        // Obtém a quantidade de valores por objeto de parametros
        const qtdeParamsCmdPrincipal = Object.values(parametrosCmdPrincipal)
          .length;
        const qtdeParamsCTAG = Object.values(parametrosCTAG).length;

        // Formata a string com os parâmetros do comando principal
        let stringParametrosCmdPrincipal = String();
        if (qtdeParamsCmdPrincipal > 0) {
          Object.entries(parametrosCmdPrincipal).forEach((parametro, index) => {
            const parametroChave = String(parametro[0]).trim();
            const parametroValor = String(parametro[1]).trim();

            // Não permite parametros vazios
            if (parametroValor)
              stringParametrosCmdPrincipal += `${
                index === 0 ? "" : ","
              }${parametroChave}=${parametroValor}`;
          });
        }

        // Formata a string com os parâmetros da CTAG
        let stringParametrosCTAG = String();
        if (qtdeParamsCTAG > 0) {
          Object.entries(parametrosCTAG).forEach((parametro, index) => {
            const parametroChave = String(parametro[0]).trim();
            const parametroValor = String(parametro[1]).trim();
            stringParametrosCTAG += `${
              index === 0 ? "" : ","
            }${parametroChave}=${parametroValor ? parametroValor : ""}`;
          });
        }

        // Formata a string final
        const stringComando = `${cmdPrincipal}::${stringParametrosCmdPrincipal}:CTAG::${stringParametrosCTAG};`;

        return resolve(stringComando);
      } catch (error) {
        reject("Falhou ao montar string de comando");
      }
    });
  };
}

module.exports = TL1;
