export default {
  default: {
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    requireModule: ['ts-node/register'],
    require: ['tests/steps/*.ts'],
    paths: ['tests/features/*.feature']
  }
};
