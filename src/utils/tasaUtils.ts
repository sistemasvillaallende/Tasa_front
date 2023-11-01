export const getSituacion = (codSituacionJudicial: number) => {
  switch (codSituacionJudicial) {
    case 1:
      return "Normal"
    case 2:
      return "Judicial"
    case 3:
      return "Administrativa prejudicial"
    case 4:
      return "Administrativa judicializada"
    default:
      return "Desconocido"
  }
}
