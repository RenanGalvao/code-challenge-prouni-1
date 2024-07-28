export const TEMPLATE = {
    ROUTES: {
        CREATE: (route: string, gender: string) => `${route} criad${gender} com sucesso!`,
        FIND_ONE: (route: string, gender: string) => `${route} recuperad${gender} com sucesso!`,
        FIND_MANY: (route: string, gender: string) => `${route} recuperad${gender}s com sucesso!`,
        UPDATE: (route: string, gender: string) => `${route} atualizad${gender} com sucesso!`,
        DELETE: (route: string, gender: string) => `${route} deletad${gender} com sucesso!`,
    }
}