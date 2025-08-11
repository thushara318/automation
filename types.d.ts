declare module "*.json" {
  const value: any;
  export default value;
}

interface TestConfig {
  credentials: {
    valid: {
      username: string;
      password: string;
    };
    invalid: {
      username: string;
      password: string;
    };
  };
  urls: {
    base: string;
    inventory: string;
  };
  testData: {
    products: string[];
  };
}
