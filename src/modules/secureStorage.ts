const setSecureItem = (key: string, data: any): void => {
  const jsonData = JSON.stringify(data)
  localStorage.setItem(key, jsonData)
}

const getSecureItem = (key: string): any => {
  const jsonData = localStorage.getItem(key)
  if (jsonData) {
    return JSON.parse(jsonData)
  }
  return null
}

export { setSecureItem, getSecureItem }