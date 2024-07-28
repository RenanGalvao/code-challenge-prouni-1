import { Request, Response, Router } from 'express'
import { TEMPLATE } from '@src/utils/template'
import { MESSAGE, routes } from '@src/const'
import { logger } from '@src/utils/logger'

function handleData(res: Response, handlerName: string, resData: any = {}) {
	if (handlerName.match(/many/i) && Object.keys(resData).includes('totalCount')) {
		const { data, totalCount, totalPages } = resData

		res.header('X-Total-Count', totalCount)
		res.header('X-Total-Pages', totalPages)
		return data
	} else {
		return resData
	}
}


export function formatResponse(req: Request, res: Response, data: any) {
	const route = req.route.path.split('/')[1]
	const handlerName = req.route.stack[req.route.stack.length - 1].name

	return {
		message: generateMessage(route, handlerName),
		data: handleData(res, handlerName, data),
		timestamp: new Date().toISOString()
	}
}

export function generateMessage(route: keyof typeof routes, handler: string) {
	if (handler.match(/^create/i)) {
		return TEMPLATE.ROUTES.CREATE(routes[route].singular, routes[route].gender)
	} else if (handler.match(/many/i)) {
		return TEMPLATE.ROUTES.FIND_MANY(routes[route].plural, routes[route].gender)
	} else if (handler.match(/one/i)) {
		return TEMPLATE.ROUTES.FIND_ONE(routes[route].singular, routes[route].gender)
	} else if (handler.match(/update/i)) {
		return TEMPLATE.ROUTES.UPDATE(routes[route].singular, routes[route].gender)
	} else if (handler.match(/remove/i)) {
		return TEMPLATE.ROUTES.DELETE(routes[route].singular, routes[route].gender)
	}

	// Auth Routes
	else if (handler.match(/signin/i)) {
		return MESSAGE.ROUTES.SIGN_IN
	}

	// Others Routes
	else if (handler.match(/health/i)) {
		return MESSAGE.ROUTES.HEALTH_CHECK
	}
}

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