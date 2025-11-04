import * as aircraftRepository from "../repositories/aircraftRepository.js";

export const getAircrafts = async (req, res) => {
  try {
    const aircraft = await aircraftRepository.getAllAircrafts();
    res.status(200).json({ success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single aircraft by ID
export const getAircraft = async (req, res) => {
  try {
    const aircraft = await aircraftRepository.getAircraftById(req.params.id);
    if (!aircraft) {
      return res
        .status(404)
        .json({ success: false, message: "Aircraft not found" });
    }
    res.status(200).json({ success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search aircrafts by query parameter
export const searchAircraftsInFlight = async (req, res) => {
  try {
    const { q } = req.params;
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    const results = await aircraftRepository.searchAircraftsByName(q);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createNewAircraft = async (req, res) => {
  try {
    const { name, manufacturer } = req.body;
    if (!name?.trim() || !manufacturer?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }
    const newAircraft = await aircraftRepository.createAircraft({
      name,
      manufacturer,
    });
    res.status(200).json({ success: true, data: newAircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get paginated aircrafts with search and sorting used by the admin panel
export const getAircraftsBySearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "id";
    const sortOrder = req.query.sortOrder || "asc";

    const { aircrafts, totalPages, currentPage } =
      await aircraftRepository.getAircraftsBySearch(
        page,
        pageSize,
        query,
        sortBy,
        sortOrder
      );

    return res.json({
      success: true,
      data: {
        aircrafts,
        totalPages,
        currentPage,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedAircrafts:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExistingAircraft = async (req, res) => {
  try {
    const { name, manufacturer } = req.body;
    if (!name?.trim() || !manufacturer?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }

    const updatedAircraft = await aircraftRepository.updateAircraft(
      req.params.id,
      { name, manufacturer }
    );
    res.status(200).json({ success: true, data: updatedAircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExistingAircraft = async (req, res) => {
  try {
    const deletedAircraft = await aircraftRepository.deleteAircraft(
      req.params.id
    );
    res.status(200).json({ success: true, data: deletedAircraft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterAircrafts = async (req, res) => {
  try {
    const results = await aircraftRepository.filterAircrafts(req.query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    if (err.message.includes('At least one')) {
      return res.status(400).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const countAircrafts = async (req, res) => {
  try {
    const count = await aircraftRepository.countAircrafts();
    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error in countAircrafts:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};