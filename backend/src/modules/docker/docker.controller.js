const dockerService = require('./docker.service');

async function listImages(req, res, next) {
  try {
    const images = await dockerService.listImages();
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    next(error);
  }
}

async function pullImage(req, res, next) {
  try {
    const { imageName } = req.body;
    const result = await dockerService.pullImage(imageName);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function deleteImage(req, res, next) {
  try {
    const { imageId } = req.params;
    const result = await dockerService.deleteImage(imageId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function buildImage(req, res, next) {
  try {
    const { tag, path } = req.body;
    const result = await dockerService.buildImage(tag, path);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listImages,
  pullImage,
  deleteImage,
  buildImage
};
