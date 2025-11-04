import {
  getAllRevenue
} from "../repositories/revenueRepository.js";

export const getRevenue = async (req, res) => {
  try {
    const revenue = await getAllRevenue();
    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}