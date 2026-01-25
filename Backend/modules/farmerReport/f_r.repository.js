import FarmerReport from './f_r.model.js'
import farmer from '../farmer/farmer.model.js'//ensuring that farmer model was created


export async function create(data) {
  const farmer_report = new FarmerReport(data)
  return await farmer_report.save()
}

export async function delete_report(id) {
  return await FarmerReport.findByIdAndDelete(id)
}

export async function get_report(id) {
  return await FarmerReport.findById(id)
    .populate('farmerID', 'name phone')
    .populate('adminID', 'name')
}

export async function getAll() {
  return await FarmerReport.find()
    .populate('farmerID', 'name phone')
    .populate('adminID', 'name')
}

export async function update_report(id,data) {
 return await FarmerReport.findByIdAndUpdate(id,data,{new:true})
}
