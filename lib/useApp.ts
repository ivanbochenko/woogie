import { useEffect, useState } from "react"

export const useApp = <T extends unknown> (fetcher: () => Promise<T>) => {
  const [response, setResponse] = useState<T>()
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    (async () => {
      setFetching(true)
      try {
        setResponse(await fetcher())
      } catch (error) {
        console.log(error)
      }
      setFetching(false)
    })()
  }, [])
  
  return { response, fetching }
}