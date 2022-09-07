module.exports = (config, context) => {
  return {
    ...config,
    devServer: {
      ...config.devServer,
      reconnect: true,
      devMiddleware: {
        ...config.devServer.devMiddleware,
        writeToDisk: true,
      },
    },
  };
};
