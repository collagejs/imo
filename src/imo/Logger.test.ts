import { describe, test, expect, vi } from "vitest";
import { Logger } from "./Logger";
import { skImoLogs } from "../shared/storage-keys";
import type { ImoLogEntry } from "../private-types";
import { eventImoLogsUpdated } from "../shared/common";

describe("Logger", () => {
    describe("save", () => {
        test("Should save the logs to session storage.", () => {
            sessionStorage.clear();
            const logger = new Logger();
            logger.info("Test log entry");
            logger.save();
            const storedLogs = JSON.parse(sessionStorage.getItem(skImoLogs) || "[]") as ImoLogEntry[][];
            expect(storedLogs.length).toBe(1);
            expect(storedLogs[0].length).toBe(1);
            expect(storedLogs[0][0].message).toBe("Test log entry");
        });
        test("Should not create multiple sessions for the same log being saved more than once.", () => {
            sessionStorage.clear();
            const logger = new Logger();
            logger.info("Test log entry");
            logger.save();
            logger.save();
            const storedLogs = JSON.parse(sessionStorage.getItem(skImoLogs) || "[]") as ImoLogEntry[][];
            expect(storedLogs.length).toBe(1);
            expect(storedLogs[0].length).toBe(1);
            expect(storedLogs[0][0].message).toBe("Test log entry");
        });
        test("Should preserve previously existing log sessions.", () => {
            sessionStorage.clear();
            const existingLogs: ImoLogEntry[][] = [
                [
                    {
                        timestamp: 0,
                        level: "info",
                        message: "Existing log entry",
                    },
                ],
            ];
            sessionStorage.setItem(skImoLogs, JSON.stringify(existingLogs));
            const logger = new Logger();
            logger.info("New log entry");
            logger.save();
            const storedLogs = JSON.parse(sessionStorage.getItem(skImoLogs) || "[]") as ImoLogEntry[][];
            expect(storedLogs.length).toBe(2);
            expect(storedLogs[0].length).toBe(1);
            expect(storedLogs[0][0].message).toBe("New log entry");
            expect(storedLogs[1].length).toBe(1);
            expect(storedLogs[1][0].message).toBe("Existing log entry");
        });
        test("Should prepend new log sessions to the existing logs.", () => {
            sessionStorage.clear();
            const existingLogs: ImoLogEntry[][] = [
                [
                    {
                        timestamp: 0,
                        level: "info",
                        message: "Existing log entry",
                    },
                ],
            ];
            sessionStorage.setItem(skImoLogs, JSON.stringify(existingLogs));
            const logger = new Logger();
            logger.info("New log entry");
            logger.save();
            const storedLogs = JSON.parse(sessionStorage.getItem(skImoLogs) || "[]") as ImoLogEntry[][];
            expect(storedLogs.length).toBe(2);
            expect(storedLogs[0].length).toBe(1);
            expect(storedLogs[0][0].message).toBe("New log entry");
            expect(storedLogs[1].length).toBe(1);
            expect(storedLogs[1][0].message).toBe("Existing log entry");
        });
        test("Should dispatch the updated logs custom event whenever logs are saved.", () => {
            sessionStorage.clear();
            const logger = new Logger();
            const eventListener = vi.fn();
            window.addEventListener(eventImoLogsUpdated, eventListener);
            logger.info("Test log entry");
            logger.save();
            expect(eventListener).toHaveBeenCalledTimes(1);
            const eventDetail = eventListener.mock.calls[0][0].detail as ImoLogEntry[][];
            expect(eventDetail.length).toBe(1);
            expect(eventDetail[0].length).toBe(1);
            expect(eventDetail[0][0].message).toBe("Test log entry");
        });
    });
    describe("Log Levels", () => {
        test("Should log error level messages to the console.error.", () => {
            const logger = new Logger();
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
            logger.error("Test error message");
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            const loggedMessage = consoleErrorSpy.mock.calls[0][0] as string;
            expect(loggedMessage).toContain("[ERROR] Test error message");
            consoleErrorSpy.mockRestore();
        });
        test("Should not log info or warning level messages to the console.error.", () => {
            const logger = new Logger();
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });
            logger.info("Test info message");
            logger.warn("Test warning message");
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
            consoleErrorSpy.mockRestore();
        });
        test("Should store the correct log levels in the logs.", () => {
            const logger = new Logger();
            logger.info("Test info message");
            logger.warn("Test warning message");
            logger.error("Test error message");
            expect(logger.logs.length).toBe(3);
            expect(logger.logs[0].level).toBe("info");
            expect(logger.logs[1].level).toBe("warning");
            expect(logger.logs[2].level).toBe("error");
        });
    });
    describe("Timestamps", () => {
        test("Should store timestamps as numbers representing milliseconds since the Unix epoch.", () => {
            const logger = new Logger();
            logger.info("Test log entry");
            expect(logger.logs.length).toBe(1);
            const timestamp = logger.logs[0].timestamp;
            expect(typeof timestamp).toBe("number");
            expect(timestamp).toBeGreaterThan(0);
        });
    });
});
