import { NextResponse } from "next/server";

type ZippopotamResponse = {
  "post code": string;
  places: {
    "place name": string;
    "state abbreviation": string;
  }[];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ zip: string }> }
) {
  const { zip } = await params;

  // ZIP 유효성 검사
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: "Invalid ZIP" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.zippopotam.us/us/${zip}`,
      { cache: "no-store" } // 🔥 캐시로 꼬이는 거 방지
    );

    if (!res.ok) {
      return NextResponse.json(
        { zip, city: null, state: null },
        { status: 200 }
      );
    }

    const data = (await res.json()) as ZippopotamResponse;

    const place = data.places?.[0];

    if (!place) {
      return NextResponse.json(
        { zip, city: null, state: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      zip,
      city: place["place name"],
      state: place["state abbreviation"],
    });
  } catch (err) {
    return NextResponse.json(
      { zip, city: null, state: null, error: "ZIP lookup failed" },
      { status: 500 }
    );
  }
}
