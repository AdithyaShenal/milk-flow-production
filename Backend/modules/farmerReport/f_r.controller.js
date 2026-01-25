import * as farmerReportService from './f_r.service.js'
import { successResponse } from '../../util/response.js'

export async function create(req, res, next) {
  try {
    const report = await farmerReportService.create(req.body)
    successResponse(res, report, 201)
  } catch (err) {
    next(err)
  }
}

export async function delete_report(req, res, next) {
  try {
    await farmerReportService.delete_report(req.params.id)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function getAll(req, res, next) {
  try {
    const reports = await farmerReportService.getAll()
    return res.json(reports)
  } catch (err) {
    next(err)
  }
}

export async function get_report(req, res, next) {
  try {
    const report = await farmerReportService.get_report(req.params.id)
    return res.json(report)
  } catch (err) {
    next(err)
  }
}

export async function update_report(req,res,next){
 try{
   const report =await farmerReportService.get_report(req.params.id,req.body.data)
   return res.json(report)
 }
 catch(err){
  next(err)
 }
}
