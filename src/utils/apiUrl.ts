export function getApiUrl(urlPart:string)
{
  let fullUrl = ''

  if(import.meta.env.VITE_APP_SERVER_HOST)
  {
    fullUrl = `${import.meta.env.VITE_APP_SERVER_HOST}`
  }
  else
  {
    fullUrl = `${window.location.protocol}//${window.location.hostname}`
  }


  if(import.meta.env.VITE_APP_SERVER_PORT)
  {
    fullUrl += `:${import.meta.env.VITE_APP_SERVER_PORT}`
  }

  return `${fullUrl}/${urlPart}`
}


export function getIcApiUrl(urlPart:string)
{
  let fullUrl = ''

  if(import.meta.env.VITE_APP_IC_HOST)
  {
    fullUrl = `${window.location.protocol}//${import.meta.env.VITE_APP_IC_HOST}`
  }
  else
  {
    fullUrl = `${window.location.protocol}//${window.location.hostname}`
  }


  if(import.meta.env.VITE_APP_IC_PORT)
  {
    fullUrl += `:${import.meta.env.VITE_APP_IC_PORT}`
  }

  return `${fullUrl}/${urlPart}`
}
