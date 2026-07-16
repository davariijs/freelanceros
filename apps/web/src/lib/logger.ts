export class WebLogger {
  static info(message: string, data?: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `%c[INFO] [${new Date().toISOString()}]: ${message}`,
        "color: #60a5fa; font-weight: bold;",
        data || "",
      );
    }
  }

  static error(message: string, error?: any): void {
    console.error(
      `%c[ERROR] [${new Date().toISOString()}]: ${message}`,
      "color: #ef4444; font-weight: bold;",
      error || "",
    );
  }
}
