const wrapAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(e => next(e));
  };
};
//can be used instead of npm install express-async-errors
