/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ck: {
          navy: "#0F172A",     // 메인 네이비
          blue: "#1E40AF",     // 포인트 블루
          sky: "#E0F2FE",      // 연한 배경
          orange: "#F97316",   // CTA 오렌지
          gray: "#64748B",     // 서브 텍스트
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        card: "0 6px 20px rgba(15,23,42,0.08)",
      },
    },
  },
  plugins: [],
};
