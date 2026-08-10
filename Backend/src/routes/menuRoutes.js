import { Router } from 'express';
import { menuItems } from '../data/menuItems.js';

const router = Router();

// GET /api/menu - Get all menu items with filtering and search capabilities
router.get('/menu', (req, res) => {
  try {
    const { category, search, available, minPrice, maxPrice, limit, page } = req.query;
    
    let filtered = [...menuItems];

    // Filter by Category
    if (category && category !== 'All Menu') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by Name or Description
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // Filter by Availability
    if (available !== undefined) {
      const isAvail = available === 'true';
      filtered = filtered.filter((item) => item.isAvailable === isAvail);
    }

    // Filter by Price range
    if (minPrice) {
      filtered = filtered.filter((item) => item.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((item) => item.price <= Number(maxPrice));
    }

    // Optional Pagination
    const totalCount = filtered.length;
    let paginated = filtered;

    if (limit && page) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      paginated = filtered.slice(startIndex, startIndex + limitNum);
    }

    return res.status(200).json({
      success: true,
      count: totalCount,
      totalItems: menuItems.length,
      data: paginated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve menu items',
      error: error.message,
    });
  }
});

// GET /api/menu/:id - Get single menu item by ID
router.get('/menu/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = menuItems.find((m) => m.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve menu item',
      error: error.message,
    });
  }
});

// GET /api/categories - Get all categories with counts
router.get('/categories', (req, res) => {
  try {
    const categoriesMap = {};
    menuItems.forEach((item) => {
      categoriesMap[item.category] = (categoriesMap[item.category] || 0) + 1;
    });

    const categories = Object.keys(categoriesMap).map((cat) => ({
      name: cat,
      itemCount: categoriesMap[cat],
    }));

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
});

export default router;
