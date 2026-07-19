import { Injectable, OnModuleInit } from "@nestjs/common"

@Injectable()
export class ServerInfoService implements OnModuleInit {
  private port: number

  onModuleInit() {
    // Isso permite que a configuração da porta seja feita após a inicialização do servidor
    console.log("ServerInfoService initialized")
  }

  setPort(port: number) {
    this.port = port
  }

  getPort(): number {
    return this.port
  }
}
