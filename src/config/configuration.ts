export class ConfigurationService {
  getPort() {
    return +process.env.PORT || 3000;
  }

  getApiUrl() {
    return process.env.API_URL;
  }

  getSender() {
    return process.env.SG_MAIL_FROM;
  }
}
