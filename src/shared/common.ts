import { ImoController } from "../ImoController.js";
import type { ImPostingOptions } from "../types.js";
import { skViteDevServers } from "./storage-keys.js";

export const eventImoLogsUpdated = 'imo-logs-updated';

/**
 * Determines if the origin in the given URL is a Vite server according to the given allowance restriction.
 * @param url URL to test.
 * @param allowedType Allowed origin type.
 * @returns A Boolean value that indicates if the URL is considered a Vite development server under the allowed type
 * setting.
 */
export function isViteServer(url: URL, allowedType: Required<ImPostingOptions>['autoAllowLocalhost']): boolean {
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || allowedType === 'none') {
        return false;
    }

    const hostname = url.hostname;
    const loopbackAllowed = allowedType === 'loopback' || allowedType === 'all';
    const privateIpAllowed = allowedType === 'private-ip' || allowedType === 'all';

    // Check for localhost
    if (hostname === 'localhost' && loopbackAllowed) {
        return true;
    }

    // Check for IPv4 private network ranges commonly used in home networks
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);

    if (match) {
        const [, a, b, c, d] = match.map(Number);

        // Validate that each octet is between 0-255
        if (a > 255 || b > 255 || c > 255 || d > 255) {
            return false;
        }

        // Check private IP ranges:
        // 127.0.0.0/8 (127.0.0.1 to 127.255.255.255) - loopback range
        if (a === 127 && loopbackAllowed) {
            return true;
        }

        if (privateIpAllowed) {
            // 192.168.0.0/16 (192.168.0.0 to 192.168.255.255)
            if (a === 192 && b === 168) {
                return true;
            }

            // 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
            if (a === 172 && b >= 16 && b <= 31) {
                return true;
            }

            // 10.0.0.0/8 (10.0.0.0 to 10.255.255.255)
            if (a === 10) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Reads from local storage and returns the list of stored Vite development servers.  The list is stored as an array of
 * tuples, where the first element is the server origin and the second is a Boolean indicating whether the server is
 * allowed for import map posts or not.
 * @returns A map object containing the Vite dev servers and their "allow for import map posts" status, or an empty map
 * object.
 */
export function getStoredDevServers(): Map<string, boolean> {
    return new Map<string, boolean>(JSON.parse(localStorage.getItem(skViteDevServers) || '[]'));
}

/**
 * Ensures that the `CollageJs.Imo` controller is initialized and available.  If it doesn't exist, it is created.
 */
export function ensureImoController(): void {
    if (!CollageJs.Imo) {
        // @ts-expect-error TS2540 - Imo property is declared as read-only.
        CollageJs.Imo = new ImoController();
    }
}
