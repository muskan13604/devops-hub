// Mock environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.MONGODB_DB_NAME = 'test';
process.env.JWT_ACCESS_SECRET = 'test_secret_must_be_at_least_32_characters_long';
process.env.JWT_REFRESH_SECRET = 'test_secret_must_be_at_least_32_characters_long';
process.env.PORT = '5000';
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test_openai_key';

jest.mock('@kubernetes/client-node', () => {
  return {
    KubeConfig: jest.fn().mockImplementation(() => ({
      loadFromDefault: jest.fn(),
      makeApiClient: jest.fn().mockReturnValue({
        listNamespacedDeployment: jest.fn().mockResolvedValue({ body: { items: [] } })
      })
    })),
    AppsV1Api: jest.fn()
  };
});
