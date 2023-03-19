import { useContext } from 'react'
import { RefreshContext } from 'contexts/RefreshContext'

const useRefresh = () => {
  const { fast, slow, veryFast } = useContext(RefreshContext)
  return { veryFastRefresh: veryFast, fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
