export class ConfigurationService {
  getPort() {
    return +process.env.PORT || 3000;
  }

  getbaseUrl() {
    return process.env.INSTAGRAM_BASE_URL;
  }

  getAccessToken() {
    return process.env.INSTAGRAM_ACCESS_TOKEN;
  }

  getapiBaseUrl() {
    return process.env.API_BASE_URL;
  }
  getSender() {
    return process.env.SG_MAIL_FROM;
  }
}
