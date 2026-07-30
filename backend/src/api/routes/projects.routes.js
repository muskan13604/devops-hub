const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticate');
const projectsController = require('../../modules/projects/projects.controller');

const router = Router();

router.use(authenticate);

router.post('/', projectsController.create);
router.get('/', projectsController.list);
router.get('/:id', projectsController.get);
router.put('/:id', projectsController.update);
router.delete('/:id', projectsController.remove);

module.exports = router;
