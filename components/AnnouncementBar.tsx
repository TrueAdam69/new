'use client';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="scroll-container">
        <div className="scroll-text">
          🚚 Free Delivery All Over Pakistan • 🚚 Free Delivery All Over Pakistan • 🚚 Free Delivery All Over Pakistan
        </div>
      </div>
      <style jsx>{`
        .announcement-bar {
          width: 100%;
          background: #000;
          color: #fff;
          height: 36px;
          display: flex;
          align-items: center;
          overflow: hidden;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-family: var(--font-dm-sans), sans-serif;
        }

        .scroll-container {
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
        }

        .scroll-text {
          display: inline-block;
          padding-left: 100%;
          animation: scroll-left 25s linear infinite;
          line-height: 36px;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
