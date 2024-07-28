function health() {
    return {
        uptime: process.uptime(),
        ok: true
    }
}

export const HealthService = { health }