const { exec } = require('child_process');
const util = require('util');
const { AppError } = require('../../shared/errors/AppError');

const execAsync = util.promisify(exec);

async function listImages() {
  try {
    const { stdout } = await execAsync('docker images --format "{{json .}}"');
    if (!stdout.trim()) return [];
    
    // Parse json lines
    return stdout.trim().split('\n').map(line => JSON.parse(line));
  } catch (error) {
    throw new AppError(`Failed to list images: ${error.message}`, 500);
  }
}

async function pullImage(imageName) {
  try {
    if (!imageName || typeof imageName !== 'string') {
      throw new AppError('Image name is required', 400);
    }
    const { stdout, stderr } = await execAsync(`docker pull ${imageName}`);
    return { logs: stdout || stderr };
  } catch (error) {
    throw new AppError(`Failed to pull image: ${error.message}`, 500);
  }
}

async function deleteImage(imageId) {
  try {
    if (!imageId || typeof imageId !== 'string') {
      throw new AppError('Image ID is required', 400);
    }
    const { stdout, stderr } = await execAsync(`docker rmi -f ${imageId}`);
    return { logs: stdout || stderr };
  } catch (error) {
    throw new AppError(`Failed to delete image: ${error.message}`, 500);
  }
}

async function buildImage(tag, dockerfilePath) {
  try {
    if (!tag) {
      throw new AppError('Image tag is required', 400);
    }
    const path = dockerfilePath || '.';
    const { stdout, stderr } = await execAsync(`docker build -t ${tag} ${path}`);
    return { logs: stdout || stderr };
  } catch (error) {
    throw new AppError(`Failed to build image: ${error.message}`, 500);
  }
}

async function pushImage(imageName) {
  try {
    if (!imageName || typeof imageName !== 'string') {
      throw new AppError('Image name is required', 400);
    }
    const { stdout, stderr } = await execAsync(`docker push ${imageName}`);
    return { logs: stdout || stderr };
  } catch (error) {
    throw new AppError(`Failed to push image: ${error.message}`, 500);
  }
}

module.exports = {
  listImages,
  pullImage,
  deleteImage,
  buildImage,
  pushImage
};
