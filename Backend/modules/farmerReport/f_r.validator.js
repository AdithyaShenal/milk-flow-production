import joi from 'joi'
import mongoose from 'mongoose'

const objectID = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Inavlid ObjectID')
  }
  return value
}
export const createReportSchema = joi.object({
  farmerID: joi.string().custom(objectID).required(),
  report: joi.string().required(),
  adminID: joi.string().custom(objectID),
  status: joi.string().valid('pending', 'resolved').required(),
})

export const reportIDSchema = joi.object({
  id: joi.string().required(),
})

export const getAllSchema = joi.object({
  all: joi.boolean().optional(),
})

export const updateReportSchema = joi.object({
  report: joi.string(),
  status: joi.string().valid('pending', 'resolved'),
})

export const bodyValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    next()
  }
}

export const paramsValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    next()
  }
}

export const queryValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    next()
  }
}
