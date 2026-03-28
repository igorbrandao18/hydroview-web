export function loadDotEnv(): void;
export function creds(): { accessKey: string; secretKey: string; baseUrl: string };
export function stepListProjectDevices(ctx: unknown): Promise<unknown[]>;
export function stepDeviceDetail(ctx: unknown, deviceId: string): Promise<unknown>;
export function stepDeviceStatus(ctx: unknown, deviceId: string): Promise<unknown>;
