import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Lighthouse Dark - The metrics Google is too polite to give you.'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs background */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 37, 116, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
          }}
        >
          {/* Fire emoji */}
          <div
            style={{
              fontSize: '80px',
              marginBottom: '20px',
            }}
          >
            🔥
          </div>

          {/* Main heading */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #FF2574 0%, #FF8AB2 50%, #FF6B00 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-2px',
              marginBottom: '10px',
            }}
          >
            Lighthouse Dark
          </div>

          {/* Slogan */}
          <div
            style={{
              fontSize: '42px',
              color: '#CCCCCC',
              marginTop: '20px',
              fontWeight: '500',
              maxWidth: '1000px',
              lineHeight: '1.3',
            }}
          >
            The metrics Google is too polite to give you.
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            fontSize: '20px',
            color: '#888888',
            fontWeight: 'bold',
          }}
        >
          lighthousedark.org
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
