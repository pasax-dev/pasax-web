import type { Metadata } from "next"
import { ThreatMapViewer } from "./_components/threat-map-viewer"

export const metadata: Metadata = {
  title: "Live Cyber Threat Radar | Pasax Fleet Immunity",
  description:
    "Real-time 3D global cyber threat radar, kernel wire-speed packet drop metrics, and autonomous Linux VPS fleet telemetry.",
  openGraph: {
    title: "Live Cyber Threat Radar | Pasax Fleet Immunity",
    description:
      "Real-time 3D cyber threat interception radar, Linux kernel packet filtering metrics, and autonomous node status.",
  },
}

export default function ThreatMapPage() {
  return <ThreatMapViewer />
}
