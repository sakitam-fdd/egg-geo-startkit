import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  // router.get('/image', controller.imageReader.index);
  // router.get('/image/readerSharp', controller.imageReader.readerSharp);

  router.get('/aviation/scatter', controller.wind.scatter);

  router.get('/light/scatter', controller.importantWeather.scatter);
};
