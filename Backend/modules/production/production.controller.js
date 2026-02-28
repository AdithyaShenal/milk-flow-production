import * as productionService from "./poduction.service.js";

export async function getProductions(req, res) {
  const {
    search = "",
    filterBy = "none",
    date = "",
    status = "all",
  } = req.query;

  const productions = await productionService.searchProductions({
    search,
    filterBy,
    date,
    status,
  });

  res.status(200).json(productions);
}

export async function submitProduction(req, res, next) {
  const farmer_id = req.user._id;
  const volume = req.body.volume;

  const savedProd = await productionService.submitProduction(farmer_id, volume);

  res.status(200).json(savedProd);
}

export async function getMyProductions(req, res) {
  const productions = await productionService.getMyProductions(req.user._id);

  res.status(200).json(productions);
}

export async function getMyProductionToday(req, res) {
  const farmerId = req.user._id;

  const production = await productionService.getMyProductionToday(farmerId);

  if (production) {
    return res.json({
      registered: true,
      message: "Milk already submitted today",
      production,
    });
  }

  return res.json({
    registered: false,
    message: "No milk submitted today",
    production: null,
  });
}

export async function updateProductionController(req, res) {
  const farmer_id = req.user._id;
  const production_id = req.params.production_id;
  const volume = req.body.volume;

  const production = await productionService.updateProductionService(
    farmer_id,
    production_id,
    volume,
  );

  res.status(200).json(production);
}

export async function deleteProductionController(req, res) {
  const farmer_id = req.user._id;
  const production_id = req.params.production_id;

  await productionService.deleteProductionService(farmer_id, production_id);

  res.status(200).json("Successfully deleted production");
}

export async function getAllPendingProductions(req, res, next) {
  try {
    const productions = await productionService.getAllPendingProductions();
    return res.json(productions);
  } catch (err) {
    next(err);
  }
}

export async function blockProduction(req, res) {
  const productionId = req.params.productionId;

  const production = await productionService.blockProduction(productionId);

  return res.status(200).json(production);
}

export async function getProductionsByFarmerId(req, res, next) {
  try {
    const productions = await productionService.getProductionsByFarmerId(
      req.params.farmer_id,
    );
    return res.json(productions);
  } catch (err) {
    next(err);
  }
}

export async function getProductionsByRoute(req, res, next) {
  try {
    const productions = await productionService.getProductionsByRoute(
      parseInt(req.params.route),
    );
    return res.json(productions);
  } catch (err) {
    next(err);
  }
}
