import { Router } from 'express'
import { logger } from '@/utils'

export function appInitLog(router: Router) {
	for (const layer of router.stack) {
		if (layer.name !== 'router') {
			logger.info(`[Middleware] ${layer.name.charAt(0).toUpperCase() + layer.name.slice(1)} created`)
		} else {
			// @ts-ignore
			for (const subLayer of layer.handle!.stack) {
				const method = Object.keys(subLayer.route!.methods)[0].toUpperCase()
				logger.info(`[Router] ${method} ${subLayer.route!.path} created`)
			}
		}

	}
}