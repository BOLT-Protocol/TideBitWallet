// const env = 'production';
const env = "development";
const apiVersion = "/api/v1";
export const apiKey = "yourKey";
export const apiSecret = "yourSecret";

export const url =
  (env === "production"
    ? "https://service.tidewallet.io"
    : "https://staging.tidewallet.io") + apiVersion;

export const network_publish = false;
// const network_publish = true;
