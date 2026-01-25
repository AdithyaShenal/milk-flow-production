import * as farmerReportRepo from './f_r.repository.js'
import { findById } from '../farmer/farmer.repository.js'
import * as errors from '../../errors/errors.js'

export async function create(data) {
  const farmer = await findById(data.farmerID)
  if (!farmer) {
    throw new errors.NotFoundError('farmer id is not found')
  }
  return farmerReportRepo.create(data)
}

export async function delete_report(id) {
  const report = await farmerReportRepo.get_report(id)
  if (!report) {
    throw new errors.NotFoundError('report is not found')
  }
  return farmerReportRepo.delete_report(id)
}

export async function getAll() {
  const reports = await farmerReportRepo.getAll()
  if (!reports || reports.length == 0) {
    throw new errors.NotFoundError('no reports available')
  }
  return reports
}

export async function get_report(id) {
  const report = await farmerReportRepo.get_report(id)
  if (!report) {
    throw new errors.NotFoundError('report is not found')
  }
  return report
}

export async function update_report(id,data){
 const report=await farmerReportRepo.get_report(id)
 if(!report) throw new errors.NotFoundError("report not found")
  return farmerReportRepo.update_report(id,data)
}