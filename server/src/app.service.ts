import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return "Hello World!"
  }

  async myTest() {
    try {
      return {
        success: true,
      }
    } catch (error) {
      return { error: `${error.message || error}` }
    }
  }
}
