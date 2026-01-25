import * as schemas from './f_r.validator.js'
import * as farmerReportController from './f_r.controller.js'
import express from 'express'

const router = express.Router()

router.post(
  '/',
  schemas.bodyValidator(schemas.createReportSchema),
  farmerReportController.create
)

router.delete(
  '/:report_id',
  schemas.paramsValidator(schemas.reportIDSchema),
  farmerReportController.delete_report
)

router.get(
  '/',
  schemas.queryValidator(schemas.getAllSchema),
  farmerReportController.getAll
)

router.get(
  '/:report_id',
  schemas.paramsValidator(schemas.reportIDSchema),
  farmerReportController.get_report
)

router.put(
  '/:report_id',
  schemas.paramsValidator(schemas.reportIDSchema),
  schemas.bodyValidator(schemas.updateReportSchema),
  farmerReportController.update_report
)

export default router
