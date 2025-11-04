import {
  getAllAirports,
  getAirportById,
  createAirport,
  updateAirport,
  deleteAirport,
  searchAirportsByQuery,
  searchAirportsByName,
} from "../repositories/airportRepository.js";

export const getAirports = async (req, res) => {
  try {
    const airports = await getAllAirports();
    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAirport = async (req, res) => {
  try {
    const airport = await getAirportById(req.params.id);
    if (!airport) {
      return res
        .status(404)
        .json({ success: false, message: "Airport not found" });
    }
    res.status(200).json({ success: true, data: airport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchAirport = async (req, res) => {
  try {
    const { q } = req.params;
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    const results = await searchAirportsByQuery(q);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchAirportsInFlight = async (req, res) => {
  try {
    const { q } = req.params;
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    const results = await searchAirportsByName(q);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewAirport = async (req, res) => {
  try {
    const newAirport = await createAirport(req.body);
    res.status(200).json({ success: true, data: newAirport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExistingAirport = async (req, res) => {
  try {
    const updatedAirport = await updateAirport(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedAirport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExistingAirport = async (req, res) => {
  try {
    const deletedAirport = await deleteAirport(req.params.id);
    res.status(200).json({ success: true, data: deletedAirport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
