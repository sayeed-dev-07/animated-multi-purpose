const Spinner = () => (
  <div className="flex h-[200px] w-full items-center justify-center">
    <svg className="w-10 h-10 animate-spin" viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="3"
        stroke="currentColor"
        strokeLinecap="round"
        style={{
          strokeDasharray: '90, 150',
          strokeDashoffset: '0',
          animation: 'dash 1.5s ease-in-out infinite'
        }}
      />
    </svg>

    <style jsx>{`
      @keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }
    `}</style>
  </div>
);

export default Spinner;