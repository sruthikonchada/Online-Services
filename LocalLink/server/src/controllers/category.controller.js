/* ──────────────────────────────────────────────
   Category Controller
   ────────────────────────────────────────────── */
const categoryService = require('../services/category.service');

async function list(_req, res, next) {
    try {
        const categories = await categoryService.getAllCategories();
        res.json({ success: true, data: categories });
    } catch (err) { next(err); }
}

async function getById(req, res, next) {
    try {
        const cat = await categoryService.getCategoryById(req.params.id);
        if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, data: cat });
    } catch (err) { next(err); }
}

async function create(req, res, next) {
    try {
        const cat = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: cat });
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const cat = await categoryService.updateCategory(req.params.id, req.body);
        res.json({ success: true, data: cat });
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
