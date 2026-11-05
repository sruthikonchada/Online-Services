const router = require('express').Router();
const categoryService = require('../services/category.service');

/* GET /api/services — public listing of all service categories */
router.get('/', async (_req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json({ success: true, data: categories });
    } catch (err) { next(err); }
});

module.exports = router;
