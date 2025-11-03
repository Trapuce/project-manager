import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'
export const alt = 'ProjectHub'
export const size = {
  width: 64,
  height: 64,
}
export const contentType = 'image/png'

// Image generation - Logo Target dans un carré arrondi bleu (comme sur la page d'accueil)
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#3b82f6', // Couleur primary (bleu)
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          position: 'relative',
        }}
      >
        {/* Cercles concentriques pour l'icône Target */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            border: '3px solid white',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            border: '2px solid white',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            background: 'white',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}

