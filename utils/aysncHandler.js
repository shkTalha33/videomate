const aysncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = { aysncHandler };

// Try Catch and also using Higher Order Fuction (Usally takes fucntion as a parameter and return function)
// const aysncHandler = (fn) = async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: true,
//             message: error.message
//         })
//     }
// }
