import { storeToRefs } from 'pinia'
import { postura } from '../store/postura'

const usePostura = () => {
  const storeRef = storeToRefs(postura());

  return {
    ...storeRef,
    getCursosByDocenteId: postura().getCursosByDocenteId,
    getSesionesByCursosId: postura().getSesionesByCursosId,
    getReporteBySesionesId: postura().getReporteBySesionesId,
    getLatestBySesionesId: postura().getLatestBySesionesId,
    checkHealth: postura().checkHealth,
    analyzeAndPersist: postura().analyzeAndPersist,
  }
}

export default usePostura
