import dynamic from 'next/dynamic';

// Bypass the standard skeleton — capture script waits on window.__rigReady.
const RigViewer = dynamic(() => import('@/components/RigViewer'), { ssr: false });

// Dedicated full-viewport page used by scripts/render-rig-video.mjs to drive
// the rig through deterministic camera angles for offline video pre-rendering.
// Not linked from anywhere in the site nav — accessed via /capture-rig only
// when the script is running, or manually for QA.
export default function CaptureRig() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#1A1A1A',
        margin: 0,
      }}
    >
      <RigViewer captureMode />
    </div>
  );
}
