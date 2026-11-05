/* ──────────────────────────────────────────────
   Provider Controller
   ────────────────────────────────────────────── */
const providerService = require('../services/provider.service');

/* POST /api/providers */
async function create(req, res, next) {
    try {
        const data = { ...req.body, userId: req.user.uid };
        if (data.city) data.city = data.city.toLowerCase().trim();
        if (data.area) data.area = data.area.toLowerCase().trim();
        const provider = await providerService.createProvider(data);
        res.status(201).json({ success: true, data: provider });
    } catch (err) {
        next(err);
    }
}

/* GET /api/providers */
async function list(req, res, next) {
    try {
        const filters = { ...req.query, publicOnly: true };
        const providers = await providerService.getProviders(filters);
        res.json({ success: true, data: providers, count: providers.length });
    } catch (err) {
        next(err);
    }
}

/* GET /api/providers/search */
async function search(req, res, next) {
    try {
        const filters = { ...req.query, publicOnly: true };
        const providers = await providerService.getProviders(filters);
        res.json({ success: true, data: providers, count: providers.length });
    } catch (err) {
        next(err);
    }
}

/* GET /api/providers/me */
async function getMyProvider(req, res, next) {
    try {
        const provider = await providerService.getProviderByUserId(req.user.uid);
        if (!provider) return res.status(404).json({ success: false, message: 'Provider profile not found' });
        res.json({ success: true, data: provider });
    } catch (err) {
        next(err);
    }
}

/* GET /api/providers/:id */
async function getById(req, res, next) {
    try {
        const provider = await providerService.getProviderById(req.params.id);
        if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });
        res.json({ success: true, data: provider });
    } catch (err) {
        next(err);
    }
}

/* PUT /api/providers/:id */
async function update(req, res, next) {
    try {
        const provider = await providerService.getProviderById(req.params.id);
        if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });
        // Only the owner can update their own profile
        if (provider.userId !== req.user.uid) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this provider' });
        }
        // Prevent privilege fields from being set by the client
        delete req.body.verificationStatus;
        delete req.body.userId;
        delete req.body.providerId;
        delete req.body.averageRating;
        delete req.body.totalReviews;

        if (req.body.city) req.body.city = req.body.city.toLowerCase().trim();
        if (req.body.area) req.body.area = req.body.area.toLowerCase().trim();

        const updated = await providerService.updateProvider(req.params.id, req.body);
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
}

/* POST /api/providers/:id/image */
async function uploadImage(req, res, next) {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No image file provided' });
        const provider = await providerService.getProviderById(req.params.id);
        if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });
        if (provider.userId !== req.user.uid) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        await providerService.updateProvider(req.params.id, { profileImage: imageUrl });
        res.json({ success: true, data: { imageUrl } });
    } catch (err) {
        next(err);
    }
}

module.exports = { create, list, search, getById, getMyProvider, update, uploadImage };
