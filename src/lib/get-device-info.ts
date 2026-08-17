// lib/getDeviceInfo.js
import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export async function getDeviceInfo() {
  const { name: browser } = parser.getBrowser();
  const { name: os } = parser.getOS();
  const { type } = parser.getDevice();

  const ipifyUrl = import.meta.env.DEV
    ? "/ipify/?format=json"
    : "https://api.ipify.org?format=json";

  const ipAddress = await fetch(ipifyUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`IP fetch failed: ${res.status}`);
      return res.json();
    })
    .then((data) => data.ip)
    .catch(() => "");

  return {
    deviceType: type || "desktop",
    ipAddress,
    browser: browser || "",
    os: os || "",
  };
}