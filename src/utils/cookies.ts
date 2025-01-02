export const getUserFromCookie = (): string => {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('VABack.CIDI='))

    if (cookie) {
      const decodedValue = decodeURIComponent(cookie.split('=')[1])
      console.log('Cookie decodificada:', decodedValue)
      const match = decodedValue.match(/nombre_completo=([^&]+)/)
      console.log('Match encontrado:', match)
      const nombreCompleto = match ? match[1].replace(/\+/g, ' ') : ''
      return nombreCompleto || 'NO USUARIO'
    }
  } catch (error) {
    console.error('Error al procesar la cookie:', error)
  }

  return 'NO USUARIO'
} 