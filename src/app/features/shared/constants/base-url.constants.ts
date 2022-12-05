export const environment = {
  production: false,
  WS_BASE_URL: "/api/v1/famille/socket/ws-notification",
};

export const WEBSOCKET_ENDPOINT = `${environment.WS_BASE_URL}`;
export const WEBSOCKET_NOTIFY_TOPIC = "/topic/notif";
