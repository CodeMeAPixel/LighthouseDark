import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { ReactNode } from 'react'

async function loadGoogleFont(font: string, weight: number): Promise<ArrayBuffer> {
  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`
  
  const css = await fetch(API, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }).then((res) => res.text())

  const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/)?.[1]
  
  if (!fontUrl) {
    throw new Error('Failed to load font')
  }

  return fetch(fontUrl).then((res) => res.arrayBuffer())
}

async function generateOGImage() {
  console.log('Loading fonts...')
  const [interBold, interMedium] = await Promise.all([
    loadGoogleFont('Inter', 700),
    loadGoogleFont('Inter', 500),
  ])

  console.log('Generating SVG with Satori...')
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
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
        },
        children: [
          // Gradient orbs background
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-400px',
                right: '-400px',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-300px',
                left: '-300px',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255, 37, 116, 0.25) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          // Content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
              },
              children: [
                // Fire emoji
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '80px',
                      marginBottom: '20px',
                    },
                    children: '🔥',
                  },
                },
                // Main heading
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '72px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #FF2574 0%, #FF8AB2 50%, #FF6B00 100%)',
                      backgroundClip: 'text',
                      color: 'transparent',
                      letterSpacing: '-2px',
                      marginBottom: '10px',
                    },
                    children: 'Lighthouse Dark',
                  },
                },
                // Slogan
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '42px',
                      color: '#CCCCCC',
                      marginTop: '20px',
                      fontWeight: 500,
                      maxWidth: '1000px',
                      lineHeight: 1.3,
                    },
                    children: 'The metrics Google is too polite to give you.',
                  },
                },
              ],
            },
          },
          // Bottom accent
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                fontSize: '20px',
                color: '#888888',
                fontWeight: 'bold',
              },
              children: 'lighthousedark.org',
            },
          },
        ],
      },
    } as ReactNode,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interMedium,
          weight: 500,
          style: 'normal',
        },
      ],
    },
  )

  console.log('Converting to PNG...')
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  // Ensure public directory exists
  const publicDir = join(process.cwd(), 'public')
  mkdirSync(publicDir, { recursive: true })

  // Write the PNG file
  const outputPath = join(publicDir, 'og-image.png')
  writeFileSync(outputPath, pngBuffer)
  
  console.log(`✅ OG Image generated: ${outputPath}`)
}

generateOGImage().catch(console.error)
