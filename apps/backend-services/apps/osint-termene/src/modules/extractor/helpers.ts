export const getCompanyUrl = (cui: string) => `https://termene.ro/firma/${cui}-firma`

export const getPersonAssociateUrl = (personId: string) =>
  `https://termene.ro/persoana.php?id=${personId}`

export const getProceedingUrl = (id: string) => `https://termene.ro/detalii_dosar_modular/${id}`
