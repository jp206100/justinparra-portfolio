import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 116,
          fontWeight: 600,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          fontFamily: "Inter Tight, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        JP
      </div>
    ),
    {
      ...size,
    }
  );
}
