const net = require("net");
const { PromiseSocket } = require("promise-socket");

class Socket {
  constructor() {
    const socketNovo = new net.Socket();
    socketNovo.setMaxListeners(0);
    this.socket = new PromiseSocket(socketNovo);
    this.socket.setTimeout(120000);
    this.socket.setEncoding("utf8");
    this.conexaoAtiva = false;
  }

  /**
   * Inicia a conexão no host pela porta indicada
   * @param {*} host
   * @param {*} porta
   */
  conectar = (host, porta) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.info("*** Iniciando conexão com o host");

        await this.socket.connect(porta, host);
        this.conexaoAtiva = true;

        console.log("*** Conexão iniciada");
        console.log(`*** Host: ${host} - Porta: ${porta}`);
        return resolve(this.socket);
      } catch (error) {
        return reject(error.message);
      }
    });
  };

  /**
   * Encerra a conexão
   */
  desconectar = () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("*** Encerrando conexão");

        await this.socket.end();
        this.conexaoAtiva = false;

        console.log("*** Conexão encerrada");
        return resolve(this.socket);
      } catch (error) {
        this.socket.destroy();
        this.conexaoAtiva = false;
        return reject(error.message);
      }
    });
  };

  /**
   * Envia comando para o servidor e, caso necessário, aguarda um delimitador para obter uma lista de retorno
   * @param {*} comando
   * @param {*} delimitador
   */
  enviarComando = (comando, delimitador = null, forcarEspera = 1000) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`*** Enviando comando '${comando}'`);

        if (!this.conexaoAtiva) return reject("Não há sessão iniciada");

        // Envia o comando
        await this.socket.write(`${comando}\n`);
        await this.#sleep(forcarEspera);

        // Armazena resultado
        let resultado = String();
        if (delimitador) {
          console.log(`*** Aguardando resposta do comando`);
          while (resultado.indexOf(delimitador) === -1) {
            resultado += await this.socket.read();
          }
        } else {
          resultado += await this.socket.read();
        }

        console.log(`*** Comando enviado com sucesso`);
        return resolve(resultado);
      } catch (error) {
        return reject(error.message);
      }
    });
  };

  /**
   * Força espera do terminal
   * @param {*} ms
   */
  #sleep = (ms) => {
    console.log(`*** Forçando espera por ${ms} ms`);
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
}

module.exports = Socket;
