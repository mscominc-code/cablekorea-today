export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              케이블코리아
            </div>
            <p className="mt-2 text-sm text-slate-600">
              미국 인터넷 · 모바일을 한국어로 쉽고 투명하게
            </p>
          </div>

          <div className="text-sm text-slate-600">
            <div>상담전화: 1-800-777-5840</div>
            <div className="mt-1">© {new Date().getFullYear()} CableKorea</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
